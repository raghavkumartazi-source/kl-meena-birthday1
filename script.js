/**
 * ============================================================================
 * LUXURY CINEMATIC DIGITAL INVITATION — CORE LOGIC
 * ============================================================================
 * Features:
 * - Phase 0 Loading Timeline (3-5 sec staggered golden particle & text reveal)
 * - Phase 1 Cinematic Frame Transition (The golden line expands -> glowing frame -> hero burst)
 * - Scroll-Triggered Handwritten Letter Sentence Reveal
 * - Staggered Event Cards Upward Slide
 * - Natural Smooth Countdown Clock
 * - Magnetic Buttons & Tactile Ripple Physics
 * - Mouse-Following Ambient Gold Glow (Spring Physics)
 * - Floating Golden Stardust Particle Canvas
 * - Web Audio API Generative Soft Ambient Piano Synthesizer
 * - Guest Name Personalization (?guest= / Live Modal Customizer)
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. GUEST PERSONALIZATION & STATE MANAGEMENT
     ========================================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('guest');
  const introElInitial = document.getElementById('intro-guest-name');
  const defaultGuest = introElInitial && introElInitial.textContent.trim() ? introElInitial.textContent.trim() : '✨ Rajkumar Meena & Arita Meena ✨';
  const pageKey = 'kl_meena_guest_' + window.location.pathname.replace(/[^a-zA-Z0-9]/g, '');
  let stored = localStorage.getItem(pageKey);
  let currentGuestName = guestParam ? guestParam : (stored || defaultGuest);

  function updateGuestNameDisplays(name) {
    currentGuestName = name;
    localStorage.setItem(pageKey, name);

    const introGuestEl = document.getElementById('intro-guest-name');
    if (introGuestEl) introGuestEl.textContent = name;

    const dynamicGuests = document.querySelectorAll('.dynamic-guest-display');
    dynamicGuests.forEach(el => {
      el.textContent = name.replace(/[✨]/g, '').trim() || name;
    });

    const confirmedGuestEl = document.getElementById('confirmed-guest-name');
    if (confirmedGuestEl) confirmedGuestEl.textContent = name.replace(/[✨]/g, '').trim() || name;

    const inputEl = document.getElementById('guest-name-input');
    if (inputEl) inputEl.value = name.replace(/[✨]/g, '').trim();
  }

  /* ==========================================================================
     2. PHASE 0: LOADING TIMELINE & PHASE 1: CINEMATIC TRANSITION
     ========================================================================== */
  const loadingOverlay = document.getElementById('loading-overlay');
  const goldenParticle = document.getElementById('golden-particle');
  const goldenLine = document.getElementById('golden-line');
  const introLine1 = document.getElementById('intro-line-1');
  const introDivider1 = document.getElementById('intro-divider-1');
  const introLine2 = document.getElementById('intro-line-2');
  const introDivider2 = document.getElementById('intro-divider-2');
  const introLine3 = document.getElementById('intro-line-3');
  const introGuestName = document.getElementById('intro-guest-name');
  const introBtnWrapper = document.getElementById('intro-btn-wrapper');
  const openInvitationBtn = document.getElementById('open-invitation-btn');
  const cinematicFrame = document.getElementById('cinematic-frame');
  const mainExperience = document.getElementById('main-experience');
  const heroSection = document.getElementById('hero-section');

  function startLoadingTimeline() {
    updateGuestNameDisplays(currentGuestName);

    // Reset classes if replayed
    goldenParticle.className = 'golden-particle';
    goldenLine.className = 'golden-line';
    introLine1.className = 'intro-text';
    introDivider1.className = 'intro-dot-divider';
    introLine2.className = 'intro-text';
    introDivider2.className = 'intro-dot-divider';
    introLine3.className = 'intro-text';
    introGuestName.className = 'intro-guest-name';
    introBtnWrapper.className = 'intro-btn-wrapper hidden';
    cinematicFrame.className = 'cinematic-frame aria-hidden';

    // Step 1: Golden particle appears (100ms)
    setTimeout(() => {
      goldenParticle.classList.add('appear');
    }, 200);

    // Step 2: Golden line draws & expands (800ms)
    setTimeout(() => {
      goldenLine.classList.add('expand');
    }, 800);

    // Step 3: "An Invitation" fades in (1600ms)
    setTimeout(() => {
      introLine1.classList.add('show');
      introDivider1.classList.add('show');
    }, 1600);

    // Step 4: "Crafted with Love" fades in (2500ms)
    setTimeout(() => {
      introLine2.classList.add('show');
      introDivider2.classList.add('show');
    }, 2500);

    // Step 5: "Especially For" fades in (3400ms)
    setTimeout(() => {
      introLine3.classList.add('show');
    }, 3400);

    // Step 6: Guest Name fades in (4200ms)
    setTimeout(() => {
      introGuestName.classList.add('show');
    }, 4200);

    // Step 7: Open Invitation Button appears (5000ms)
    setTimeout(() => {
      introBtnWrapper.classList.remove('hidden');
      // Trigger reflow for transition
      void introBtnWrapper.offsetWidth;
      introBtnWrapper.classList.add('show');
    }, 5000);
  }

  // Handle "Open Invitation" Click -> Cinematic Glowing Frame Transition
  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', function () {
      // Start audio automatically upon explicit user interaction
      if (!isAudioPlaying && audioEnabledByDefault) {
        toggleAudio(true);
      } else if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Step A: Fade out text & button inside loading overlay
      const introTextContainer = document.querySelector('.intro-text-wrapper');
      if (introTextContainer) introTextContainer.style.opacity = '0';
      if (introBtnWrapper) introBtnWrapper.style.opacity = '0';
      if (goldenParticle) goldenParticle.style.opacity = '0';

      // Step B: Expand golden line into glowing cinematic frame border
      setTimeout(() => {
        cinematicFrame.classList.remove('aria-hidden');
        void cinematicFrame.offsetWidth;
        cinematicFrame.classList.add('active');
      }, 300);

      // Step C: Frame fills with glowing light
      setTimeout(() => {
        cinematicFrame.classList.add('burst');
      }, 1000);

      // Step D: Reveal main experience & dissolve loading overlay
      setTimeout(() => {
        mainExperience.classList.remove('hidden');
        heroSection.classList.add('is-visible');
        loadingOverlay.classList.add('fade-out');
      }, 1600);

      // Step E: Cleanup loading overlay from DOM/layout
      setTimeout(() => {
        document.body.classList.remove('loading-active');
        loadingOverlay.classList.add('hidden');
        // Trigger initial scroll animations check
        checkScrollReveals();
      }, 2600);
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL (Handwritten Letter Sentence Fade & Card Slide Up)
     ========================================================================== */
  function setupScrollReveals() {
    const revealElements = document.querySelectorAll('.scroll-reveal-sentence, .slide-up-card');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Keep observing or unobserve depending on effect
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  }

  function checkScrollReveals() {
    const revealElements = document.querySelectorAll('.scroll-reveal-sentence:not(.is-revealed), .slide-up-card:not(.is-revealed)');
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('is-revealed');
      }
    });
  }

  /* ==========================================================================
     4. SCROLL PROGRESS INDICATOR & PARALLAX
     ========================================================================== */
  const scrollProgressEl = document.getElementById('scroll-progress');
  const heroBackgroundGlow = document.querySelector('.hero-background-glow');
  const portraitFrame = document.querySelector('.portrait-frame');

  let isScrolling = false;
  function onScroll() {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgressEl) {
          scrollProgressEl.style.width = `${progress}%`;
        }

        // Gentle Parallax on Hero elements
        if (heroBackgroundGlow && scrollTop < window.innerHeight * 1.5) {
          heroBackgroundGlow.style.transform = `translate(-50%, calc(-50% + ${scrollTop * 0.18}px))`;
        }
        if (portraitFrame && scrollTop < window.innerHeight * 1.2) {
          portraitFrame.style.transform = `translateY(${scrollTop * 0.08}px)`;
        }

        checkScrollReveals();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ==========================================================================
     5. NATURAL SMOOTH COUNTDOWN CLOCK
     ========================================================================== */
  // Target date: July 10, 2026, 20:00:00 (Today at 8:00 PM)
  const targetDate = new Date('July 10, 2026 20:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    let distance = targetDate - now;

    // If 8 PM arrived or passed today, hold at 00:00:00:00 for the celebration
    if (distance < 0) {
      distance = 0;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    animateNumberChange('count-days', String(days).padStart(2, '0'));
    animateNumberChange('count-hours', String(hours).padStart(2, '0'));
    animateNumberChange('count-minutes', String(minutes).padStart(2, '0'));
    animateNumberChange('count-seconds', String(seconds).padStart(2, '0'));
  }

  function animateNumberChange(id, newValue) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== newValue) {
      // Natural fade & scale nudge
      el.style.opacity = '0.4';
      el.style.transform = 'scale(0.94)';
      setTimeout(() => {
        el.textContent = newValue;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 150);
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     6. TACTILE RIPPLE EFFECT & MAGNETIC BUTTONS
     ========================================================================== */
  function setupTactileButtons() {
    // Ripple effect on click
    document.querySelectorAll('.ripple-trigger').forEach(button => {
      button.addEventListener('click', function (e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-span';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Remove old ripples
        const oldRipples = button.getElementsByClassName('ripple-span');
        while (oldRipples.length > 3) {
          oldRipples[0].remove();
        }

        button.appendChild(ripple);
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Magnetic physics on desktop mousemove
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * 0.22;
          const deltaY = (e.clientY - centerY) * 0.22;

          btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', function () {
          btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
      });
    }
  }

  /* ==========================================================================
     7. MOUSE-FOLLOWING AMBIENT GOLD GLOW (SPRING Lerp Physics)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  let isGlowVisible = false;

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isGlowVisible) {
        cursorGlow.style.opacity = '1';
        isGlowVisible = true;
      }
    });

    function animateCursorGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();
  }

  /* ==========================================================================
     8. FLOATING GOLDEN STARDUST PARTICLE CANVAS
     ========================================================================== */
  const canvas = document.getElementById('stardust-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  const PARTICLE_COUNT = 45;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class StardustParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
      this.y = initial ? Math.random() * (canvas ? canvas.height : window.innerHeight) : (canvas ? canvas.height : window.innerHeight) + 10;
      this.size = Math.random() * 2 + 0.6;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.fadeSpeed = (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
      this.hue = Math.random() > 0.2 ? 43 : 48; // Golden shades (#D4AF37 range)
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.3 + this.speedX;
      this.opacity += this.fadeSpeed;

      if (this.opacity > 0.75 || this.opacity < 0.15) {
        this.fadeSpeed = -this.fadeSpeed;
      }

      if (this.y < -10 || this.x < -20 || (canvas && this.x > canvas.width + 20)) {
        this.reset();
      }
    }

    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 68%, 58%, ${Math.max(0, Math.min(1, this.opacity))})`;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 0.6)`;
      ctx.fill();
      ctx.restore();
    }
  }

  function initStardust() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new StardustParticle());
    }
    animateStardust();
  }

  function animateStardust() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateStardust);
  }

  window.addEventListener('resize', resizeCanvas);

  /* ==========================================================================
     9. WEB AUDIO API SOFT AMBIENT PIANO SYNTHESIZER
     ========================================================================== */
  let audioContext = null;
  let isAudioPlaying = false;
  let audioLoopTimeout = null;
  let audioEnabledByDefault = false;

  // Pentatonic notes in C/A minor for serene luxury cinematic feel (Frequencies in Hz)
  const luxuryScale = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99  // G5
  ];

  function createReverb(ctx) {
    const rate = ctx.sampleRate;
    const length = rate * 3.5; // 3.5s lush tail
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (rate * 1.2));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }

    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  function playSoftPianoNote() {
    if (!audioContext || !isAudioPlaying) return;

    // Pick 1 or 2 harmonious notes
    const freq1 = luxuryScale[Math.floor(Math.random() * luxuryScale.length)];
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    // Soft sine/triangle blend for warm celesta/piano tone
    osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq1, audioContext.currentTime);

    // Envelope: gentle attack, long warm decay
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.15); // very soft
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    // Connect through reverb master
    if (window.masterAudioGain) {
      osc.connect(gain);
      gain.connect(window.masterAudioGain);
    } else {
      osc.connect(gain);
      gain.connect(audioContext.destination);
    }

    osc.start(now);
    osc.stop(now + 3.3);

    // Schedule next note with natural tempo variation (800ms - 2200ms)
    const nextInterval = Math.random() * 1400 + 800;
    audioLoopTimeout = setTimeout(playSoftPianoNote, nextInterval);
  }

  function toggleAudio(forcePlay = null) {
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const shouldPlay = forcePlay !== null ? forcePlay : !isAudioPlaying;

    if (shouldPlay) {
      if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();

        // Create Master Reverb & Gain
        window.masterAudioGain = audioContext.createGain();
        window.masterAudioGain.gain.setValueAtTime(0.8, audioContext.currentTime);

        try {
          const reverb = createReverb(audioContext);
          window.masterAudioGain.connect(reverb);
          reverb.connect(audioContext.destination);
        } catch (e) {
          window.masterAudioGain.connect(audioContext.destination);
        }
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      isAudioPlaying = true;
      if (musicToggleBtn) musicToggleBtn.classList.add('playing');
      playSoftPianoNote();
    } else {
      isAudioPlaying = false;
      if (audioLoopTimeout) clearTimeout(audioLoopTimeout);
      if (audioContext && audioContext.state === 'running') {
        audioContext.suspend();
      }
      if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
    }
  }

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => toggleAudio());
  }

  /* ==========================================================================
     10. PERSONALIZATION MODAL CONTROLLER & RSVP FORM
     ========================================================================== */
  const customizeGuestBtn = document.getElementById('customize-guest-btn');
  const customizerModal = document.getElementById('customizer-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveGuestBtn = document.getElementById('save-guest-btn');
  const guestNameInput = document.getElementById('guest-name-input');

  if (customizeGuestBtn && customizerModal) {
    customizeGuestBtn.addEventListener('click', () => {
      customizerModal.classList.remove('hidden');
      customizerModal.setAttribute('aria-hidden', 'false');
      if (guestNameInput) {
        guestNameInput.value = currentGuestName.replace(/[✨]/g, '').trim();
        guestNameInput.focus();
      }
    });

    const closeModal = () => {
      customizerModal.classList.add('hidden');
      customizerModal.setAttribute('aria-hidden', 'true');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) closeModal();
    });

    if (saveGuestBtn) {
      saveGuestBtn.addEventListener('click', () => {
        const val = guestNameInput.value.trim() || defaultGuest.replace(/[✨]/g, '').trim();
        const formatted = `✨ ${val} ✨`;
        updateGuestNameDisplays(formatted);
        closeModal();

        // Replay Phase 0 Intro with new personalized name!
        loadingOverlay.classList.remove('hidden', 'fade-out');
        document.body.classList.add('loading-active');
        mainExperience.classList.add('hidden');
        heroSection.classList.remove('is-visible');
        startLoadingTimeline();
      });
    }
  }

  // RSVP Form Interactive Toggle & Submit
  const btnAccept = document.getElementById('btn-accept');
  const btnDecline = document.getElementById('btn-decline');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpConfirmation = document.getElementById('rsvp-confirmation');
  let isAccepted = true;

  if (btnAccept && btnDecline) {
    btnAccept.addEventListener('click', () => {
      isAccepted = true;
      btnAccept.classList.add('active');
      btnDecline.classList.remove('active');
    });

    btnDecline.addEventListener('click', () => {
      isAccepted = false;
      btnDecline.classList.add('active');
      btnAccept.classList.remove('active');
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const guestName = nameInput && nameInput.value ? nameInput.value.trim() : currentGuestName;

      const confirmedGuestEl = document.getElementById('confirmed-guest-name');
      if (confirmedGuestEl) confirmedGuestEl.textContent = guestName;

      const confirmationTitle = rsvpConfirmation.querySelector('.confirmation-title');
      if (!isAccepted && confirmationTitle) {
        confirmationTitle.textContent = 'आपकी कमी खलेगी';
        const msg = rsvpConfirmation.querySelector('.confirmation-message');
        if (msg) msg.textContent = `सूचित करने के लिए धन्यवाद, ${guestName}। इस शुभ अवसर पर हम आपकी उपस्थिति को अवश्य याद करेंगे।`;
      }

      rsvpForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      rsvpForm.style.opacity = '0';
      rsvpForm.style.transform = 'scale(0.95)';

      setTimeout(() => {
        rsvpForm.classList.add('hidden');
        rsvpConfirmation.classList.remove('hidden');
        // Trigger celebratory golden confetti / stardust burst!
        burstGoldenConfetti();
      }, 500);
    });
  }

  // Add to Calendar helper
  const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent("के.एल. मीना जी का 54वाँ जन्मोत्सव");
      const details = encodeURIComponent("के.एल. मीना जी के 54वें जन्मोत्सव एवं शाही भोज में आपका सपरिवार स्वागत है।");
      const location = encodeURIComponent("E2, के.एल. मीना क्वार्टर (KL MEENA Quarter)");
      const startTime = "20260710T143000Z"; // 8 PM IST in UTC on July 10
      const endTime = "20260710T190000Z";
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
    });
  }

  // Celebratory Golden Confetti/Particles on RSVP Confirm
  function burstGoldenConfetti() {
    for (let i = 0; i < 30; i++) {
      const p = new StardustParticle();
      if (canvas) {
        p.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
        p.y = canvas.height * 0.7;
        p.speedY = -(Math.random() * 6 + 2);
        p.speedX = (Math.random() - 0.5) * 8;
        p.size = Math.random() * 4 + 2;
        p.opacity = 1;
        particles.push(p);
      }
    }
  }

  /* ==========================================================================
     11. INITIALIZATION ON DOM CONTENT LOADED
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveals();
    setupTactileButtons();
    initStardust();
    startLoadingTimeline();
  });

})();
