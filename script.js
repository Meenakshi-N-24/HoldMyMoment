
  /* ──────────────────────────────────────────────────────────
     1. STATE MACHINE DEFINITION
     
     The experience has exactly 7 states.
     Only one state is active at any time.
     
     IDLE    → waiting for the user to hold
     SCENE_1 → "Are you having fun?"        (nod reaction)
     SCENE_2 → "Do you like the flowers?"   (arm points + daisy wiggles)
     SCENE_3 → "Is the moon pretty tonight?"(looks at moon; eye tracking)
     SCENE_4 → "I have something for you..."(gift reveal)
     SCENE_5 → "I love you."               (happy eyes; screen brightens)
     RELEASE → user let go mid-sequence    (sad flash; resets)
  ────────────────────────────────────────────────────────── */
  const States = {
    IDLE:    'idle',
    SCENE_1: 'scene_1',
    SCENE_2: 'scene_2',
    SCENE_3: 'scene_3',
    SCENE_4: 'scene_4',
    SCENE_5: 'scene_5',
    RELEASE: 'release'
  };
 
  /* ──────────────────────────────────────────────────────────
     2. DIALOGUE DATA
     
     Each entry maps to one scene and describes:
       text    → the speech bubble string
       eyes    → 'normal' | 'wide' | 'happy' | 'look-up'
       mouth   → false | 'smile' | 'o-face'
       arm     → null | 'point-left' | 'gift'
       nod     → true = trigger double-nod after 1.5s
       moon    → true = intensify moon glow
       final   → true = brighten screen & loop end
       duration → ms before auto-advancing to next scene
  ────────────────────────────────────────────────────────── */
  const DIALOGUE = [
    {
      text:     'Are you having fun?',
      eyes:     'wide',
      mouth:    false,
      arm:      null,
      nod:      true,
      moon:     false,
      final:    false,
      duration: 3800
    },
    {
      text:     'Do you like the flowers?',
      eyes:     'normal',
      mouth:    'smile',
      arm:      'point-left',
      nod:      false,
      moon:     false,
      final:    false,
      duration: 3800
    },
    {
      text:     'Is the moon pretty tonight?',
      eyes:     'look-up',
      mouth:    'smile',
      arm:      null,
      nod:      false,
      moon:     true,
      final:    false,
      duration: 4000
    },
    {
      text:     'I have something for you...',
      eyes:     'normal',
      mouth:    'o-face',
      arm:      'gift',
      nod:      false,
      moon:     false,
      final:    false,
      duration: 4000
    },
    {
      text:     'I love you.',
      eyes:     'happy',
      mouth:    'smile',
      arm:      null,
      nod:      false,
      moon:     false,
      final:    true,
      duration: 5000    /* Holds the final scene longer */
    }
  ];
 
  /* ──────────────────────────────────────────────────────────
     3. ELEMENT REFERENCES
     
     Grab all DOM nodes once on load — avoids repeated queries.
  ────────────────────────────────────────────────────────── */
  const el = {
    scene:      document.getElementById('scene'),
    targetZone: document.getElementById('target-zone'),
    targetRing: document.getElementById('target-ring'),
    prompt:     document.getElementById('prompt-text'),
    hint:       document.getElementById('hold-hint'),
    bubble:     document.getElementById('bubble'),
    eyeL:       document.getElementById('eye-l'),
    eyeR:       document.getElementById('eye-r'),
    mouth:      document.getElementById('mouth'),
    armL:       document.getElementById('arm-left'),
    armR:       document.getElementById('arm-right'),
    gift:       document.getElementById('gift'),
    moon:       document.getElementById('moon'),
    daisy:      document.getElementById('daisy'),
    nodWrapper: document.getElementById('nod-wrapper'),
    sadOverlay: document.getElementById('sad-overlay'),
    muteBtn:    document.getElementById('mute-btn'),
    bgm:        document.getElementById('bgm')
  };
 
  /* ──────────────────────────────────────────────────────────
     4. RUNTIME STATE VARIABLES
  ────────────────────────────────────────────────────────── */
  let currentState  = States.IDLE;   // Active FSM state
  let currentStep   = 0;             // Index into DIALOGUE array
  let isHolding     = false;         // Is the user pressing right now?
  let isMuted       = true;          // Start muted (good UX default)
  let advanceTimer  = null;          // setTimeout handle for scene transitions
 
  /* ──────────────────────────────────────────────────────────
     5. CHARACTER ANIMATION HELPERS
     
     These functions translate FSM state into DOM changes.
  ────────────────────────────────────────────────────────── */
 
  /**
   * setEyes(type)
   * Applies the correct class to both eye elements.
   * Clears previous classes first to avoid conflicts.
   */
  function setEyes(type) {
    el.eyeL.className = 'eye';
    el.eyeR.className = 'eye';
 
    if (type === 'wide')    { el.eyeL.classList.add('wide');    el.eyeR.classList.add('wide');    }
    if (type === 'happy')   { el.eyeL.classList.add('happy');   el.eyeR.classList.add('happy');   }
    if (type === 'look-up') { el.eyeL.classList.add('look-up'); el.eyeR.classList.add('look-up'); }
    /* 'normal' = no extra class needed (base .eye styles) */
  }
 
  /**
   * setMouth(type)
   * Shows and styles the mouth element.
   * type = false → hide mouth
   * type = 'smile' → curved smile
   * type = 'o-face' → surprised open circle
   */
  function setMouth(type) {
    el.mouth.className = 'mouth';  /* Reset all classes */
 
    if (!type) return;             /* Leave hidden */
 
    el.mouth.classList.add('show');
    if (type === 'smile')  el.mouth.classList.add('smile');   /* Inherits D-arc CSS */
    if (type === 'o-face') el.mouth.classList.add('o-face');
  }
 
  /**
   * setArms(type)
   * Rotates arms via class names.
   * null → both arms in resting position
   * 'point-left' → left arm raised toward daisy
   * 'gift' → right arm raised to present gift
   */
  function setArms(type) {
    el.armL.className = '';
    el.armR.className = '';
    el.armL.id = 'arm-left';
    el.armR.id = 'arm-right';
 
    if (type === 'point-left') el.armL.classList.add('point');
    if (type === 'gift')       el.armR.classList.add('gift');
  }
 
  /**
   * triggerNod()
   * Removes then re-adds .nodding to force animation restart.
   * void el.nodWrapper.offsetWidth → forces style recalculation
   * so the animation replays even if already active.
   */
  function triggerNod() {
    el.nodWrapper.classList.remove('nodding');
    void el.nodWrapper.offsetWidth;   /* Reflow trick */
    el.nodWrapper.classList.add('nodding');
    /* Remove class after animation ends so it can replay again */
    setTimeout(() => el.nodWrapper.classList.remove('nodding'), 1200);
  }
 
  /**
   * showBubble(text)
   * Sets bubble text and animates it in.
   * A brief delay before adding .show gives the CSS
   * transition something to transition FROM.
   */
  function showBubble(text) {
    el.bubble.textContent = text;
    el.bubble.classList.remove('show');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.bubble.classList.add('show'));
    });
  }
 
  /**
   * hideBubble()
   * Removes .show to fade/slide the bubble out.
   */
  function hideBubble() {
    el.bubble.classList.remove('show');
  }
 
  /**
   * resetCharacter()
   * Returns all character parts to their idle defaults.
   * Called when releasing mid-sequence or completing the date.
   */
  function resetCharacter() {
    setEyes('normal');
    setMouth(false);
    setArms(null);
    el.gift.classList.remove('show');
    el.moon.classList.remove('glow');
    el.scene.style.filter = '';
    el.nodWrapper.classList.remove('nodding');
    hideBubble();
  }
 
 
  /* ──────────────────────────────────────────────────────────
     6. SCENE APPLIER
     
     applyScene(step)
     Reads the DIALOGUE[step] data object and applies every
     relevant animation and DOM change for that scene.
  ────────────────────────────────────────────────────────── */
  function applyScene(step) {
    const scene = DIALOGUE[step];
 
    /* ① Update speech bubble text */
    showBubble(scene.text);
 
    /* ② Set character expressions */
    setEyes(scene.eyes);
    setMouth(scene.mouth);
    setArms(scene.arm);
 
    /* ③ Daisy wiggle (Scene 2 — pointing at flower) */
    if (scene.arm === 'point-left') {
      setTimeout(() => {
        el.daisy.classList.add('wiggle');
        setTimeout(() => el.daisy.classList.remove('wiggle'), 700);
      }, 500);
    }
 
    /* ④ Moon glow (Scene 3) */
    if (scene.moon) {
      setTimeout(() => el.moon.classList.add('glow'), 700);
    } else {
      el.moon.classList.remove('glow');
    }
 
    /* ⑤ Gift reveal (Scene 4) */
    if (scene.arm === 'gift') {
      setTimeout(() => el.gift.classList.add('show'), 500);
    } else {
      el.gift.classList.remove('show');
    }
 
    /* ⑥ Nod reaction (Scene 1 — after 1.5s delay) */
    if (scene.nod) {
      setTimeout(triggerNod, 1500);
    }
 
    /* ⑦ Final scene: slight screen brighten (Scene 5) */
    if (scene.final) {
      setTimeout(() => {
        el.scene.style.filter = 'brightness(1.18)';
      }, 900);
    }
  }
 
 
  /* ──────────────────────────────────────────────────────────
     7. SCENE SEQUENCER
     
     advanceToNext()
     Called by a timer after each scene's duration.
     Checks if we're still holding before progressing.
     Loops stay at the final scene (don't advance beyond it).
  ────────────────────────────────────────────────────────── */
  function advanceToNext() {
    if (!isHolding) return;   /* User released — don't advance */
 
    const nextStep = currentStep + 1;
 
    /* Clamp at the last scene (Scene 5 / index 4) */
    if (nextStep >= DIALOGUE.length) {
      /* Stay on final scene; schedule auto-reset after final duration */
      advanceTimer = setTimeout(() => {
        endHold(true);    /* true = graceful end (not a release) */
      }, DIALOGUE[currentStep].duration);
      return;
    }
 
    currentStep = nextStep;
    applyScene(currentStep);
 
    /* Schedule the next advance */
    advanceTimer = setTimeout(advanceToNext, DIALOGUE[currentStep].duration);
  }
 
 
  /* ──────────────────────────────────────────────────────────
     8. HOLD START / END HANDLERS
     
     startHold() — fired on mousedown / touchstart on the target
     endHold()   — fired on mouseup / touchend anywhere on document
  ────────────────────────────────────────────────────────── */
 
  /**
   * startHold()
   * Begins or resumes the experience.
   * Guards against double-firing (e.g., touch + mouse events).
   * Guards against triggering during a RELEASE animation.
   */
  function startHold() {
    if (isHolding)                   return;   /* Already holding */
    if (currentState === States.RELEASE) return;   /* Mid-reset, ignore */
 
    isHolding = true;
 
    /* Activate the ring visual */
    el.targetRing.classList.add('active');
 
    /* Swap prompt text for the hint */
    el.prompt.style.opacity = '0';
    el.hint.classList.add('show');
 
    /* Start from the beginning if IDLE */
    if (currentState === States.IDLE) {
      currentStep   = 0;
      currentState  = States.SCENE_1;
      resetCharacter();
      applyScene(0);
      advanceTimer = setTimeout(advanceToNext, DIALOGUE[0].duration);
    }
 
    /* Start background music (browser requires user gesture) */
    if (!isMuted && el.bgm.src) {
      el.bgm.play().catch(() => {});   /* Catch autoplay policy errors silently */
    }
  }
 
  /**
   * endHold(graceful)
   * Called when the user releases, or after the final scene ends.
   * graceful = true  → completed the date; soft fade reset
   * graceful = false → released mid-date; surprise/sad reaction
   */
  function endHold(graceful = false) {
    if (!isHolding && !graceful) return;  /* Nothing to end */
 
    isHolding = false;
    clearTimeout(advanceTimer);
 
    /* Deactivate the ring */
    el.targetRing.classList.remove('active');
    el.hint.classList.remove('show');
 
    /* Pause music */
    el.bgm.pause();
 
    /* ── GRACEFUL END (completed all 5 scenes) ── */
    if (graceful || currentStep >= DIALOGUE.length - 1) {
      currentState = States.IDLE;
      setTimeout(() => {
        resetCharacter();
        el.prompt.style.opacity = '1';
        currentStep = 0;
      }, 3000);
      return;
    }
 
    /* ── EARLY RELEASE (let go mid-sequence) ── */
    currentState = States.RELEASE;
 
    /* Surprised reaction */
    setEyes('normal');
    setMouth('o-face');
    setArms(null);
    el.gift.classList.remove('show');
    showBubble('Wait... come back! 🥺');
 
    /* Dark flash overlay */
    el.sadOverlay.classList.add('flash');
 
    /* Reset everything after 2 seconds */
    setTimeout(() => {
      el.sadOverlay.classList.remove('flash');
      hideBubble();
      resetCharacter();
      el.prompt.style.opacity = '1';
      currentStep  = 0;
      currentState = States.IDLE;
    }, 2200);
  }
 
 
  /* ──────────────────────────────────────────────────────────
     9. EYE TRACKING (Scene 3 only)
     
     During Scene 3 ("Is the moon pretty tonight?"), the
     character's eyes subtly follow the user's cursor/touch.
     This creates the "LookAt constraint" effect.
     
     Only active when currentStep === 2 (Scene 3 index).
  ────────────────────────────────────────────────────────── */
  function handleEyeTracking(clientX) {
    if (!isHolding || currentStep !== 2) return;
 
    const rect    = el.scene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dx      = (clientX - centerX) / rect.width;  /* -0.5 to +0.5 */
    const shift   = dx * 5;                            /* Max 2.5px shift */
 
    el.eyeL.style.transform = `translateX(${shift}px)`;
    el.eyeR.style.transform = `translateX(${shift}px)`;
  }
 
  el.scene.addEventListener('mousemove', (e) => handleEyeTracking(e.clientX));
  el.scene.addEventListener('touchmove', (e) => {
    if (e.touches[0]) handleEyeTracking(e.touches[0].clientX);
  }, { passive: true });
 
 
  /* ──────────────────────────────────────────────────────────
     10. EVENT LISTENERS — Hold Zone
     
     mousedown / touchstart on the target → startHold()
     mouseup / touchend anywhere           → endHold()
     
     preventDefault on touchstart stops:
       - Double-tap zoom
       - Ghost click events after touch
  ────────────────────────────────────────────────────────── */
  el.targetZone.addEventListener('mousedown',  (e) => { e.preventDefault(); startHold(); });
  el.targetZone.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); }, { passive: false });
 
  document.addEventListener('mouseup',  () => endHold(false));
  document.addEventListener('touchend', () => endHold(false));
 
  /* ──────────────────────────────────────────────────────────
     11. MUTE TOGGLE
     
     Simple toggle for the background music.
     Updates button text between ♪ (unmuted) and ♩ (muted).
  ────────────────────────────────────────────────────────── */
  el.muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
 
    if (isMuted) {
      el.bgm.pause();
      el.muteBtn.textContent = '♩';
      el.muteBtn.classList.add('muted');
    } else {
      el.muteBtn.textContent = '♪';
      el.muteBtn.classList.remove('muted');
      if (isHolding && el.bgm.src) {
        el.bgm.play().catch(() => {});
      }
    }
  });
 
  /* ──────────────────────────────────────────────────────────
     12. INITIALIZATION
     
     Set initial visual state on page load.
  ────────────────────────────────────────────────────────── */
  (function init() {
    currentState = States.IDLE;
    currentStep  = 0;
    isHolding    = false;
    isMuted      = true;
    el.bgm.volume = 0.55;   /* Gentle volume */
    /* Mute indicator already shows ♪ by default — update to muted */
    el.muteBtn.textContent = '♩';
    el.muteBtn.classList.add('muted');
  })();