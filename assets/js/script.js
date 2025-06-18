document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    mobileMenuOpen: false,
    scrolled: false,
    formStatus: null,
    loading: false,
    typedText: '',

    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.mobileMenuOpen = false;
      }
    },

    async submitForm(e) {
      e.preventDefault();
      this.loading = true;
      try {
        await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_ACTUAL_USER_ID');
        this.formStatus = 'Message sent successfully!';
        e.target.reset();
      } catch (error) {
        this.formStatus = 'Failed to send message. Please try again.';
        console.error('EmailJS Error:', error);
      } finally {
        this.loading = false;
        setTimeout(() => (this.formStatus = null), 5000);
      }
    },

    init() {
      // Typing effect for hero section
      const text = 'Thanatsitt';
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          this.typedText += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      typeWriter();

      // Scroll Progress Bar
      window.addEventListener('scroll', () => {
        const progress = document.getElementById('scroll-progress');
        if (progress) {
          const height = document.body.scrollHeight - window.innerHeight;
          const scrolled = (window.scrollY / height) * 100;
          progress.style.width = scrolled + '%';
        }
      });

      // Dynamic Footer Year
      const yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    }
  }));
});

gsap.registerPlugin(CustomEase, SplitText, ScrambleTextPlugin);

document.addEventListener("DOMContentLoaded", function () {
  CustomEase.create("customEase", "0.86, 0, 0.07, 1");
  CustomEase.create("mouseEase", "0.25, 0.1, 0.25, 1");

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.fonts.ready.then(() => {
    initializeAnimation();
  });

  function initializeAnimation() {
    const backgroundTextItems = document.querySelectorAll(".text-item");
    const backgroundImages = {
      default: document.getElementById("default-bg"),
      cultural: document.getElementById("cultural-bg"),
      fusion: document.getElementById("fusion-bg"),
      heritage: document.getElementById("heritage-bg")
    };

    backgroundTextItems.forEach((item, index) => {
      item.style.setProperty('--text-index', index);
    });

    function switchBackgroundImage(id) {
      if (prefersReducedMotion) return; // Skip animations for reduced motion
      Object.values(backgroundImages).forEach((bg) => {
        gsap.to(bg, {
          opacity: 0,
          duration: 0.6,
          ease: "customEase"
        });
      });

      if (backgroundImages[id]) {
        gsap.to(backgroundImages[id], {
          opacity: 0.7,
          duration: 0.6,
          ease: "customEase",
          delay: 0.1
        });
      } else {
        gsap.to(backgroundImages.default, {
          opacity: 0.6,
          duration: 0.6,
          ease: "customEase",
          delay: 0.1
        });
      }
    }

    const alternativeTexts = {
      cultural: {
        BE: "INSPIRE",
        PRESENT: "CONNECTED",
        LISTEN: "EMPATHIZE",
        DEEPLY: "INTIMATELY",
        OBSERVE: "DISCERN",
        "&": "+",
        FEEL: "RESONATE",
        S: "SHARE",
        I: "IMMERSE",
        M: "MOTIVATE",
        P: "PRESERVE",
        L: "LEARN",
        C: "CONNECT",
        T: "TRANSFORM",
        Y: "YIELD",
        "IS THE KEY": "UNLOCKS CULTURE"
      },
      fusion: {
        BE: "BLEND",
        PRESENT: "HARMONIZED",
        LISTEN: "SYNTHESIZE",
        DEEPLY: "FULLY",
        OBSERVE: "FUSE",
        "&": "→",
        FEEL: "UNIFY",
        S: "STYLE",
        I: "INTEGRATE",
        M: "MERGE",
        P: "PARTNER",
        L: "LINK",
        C: "COMBINE",
        T: "TRANSITION",
        Y: "YOURS",
        "IS THE KEY": "CREATES SYNERGY"
      },
      heritage: {
        BE: "HONOR",
        PRESENT: "ROOTED",
        LISTEN: "PRESERVE",
        DEEPLY: "REVERENTLY",
        OBSERVE: "CHERISH",
        "&": "=",
        FEEL: "VALUE",
        S: "SUSTAIN",
        I: "INHERIT",
        M: "MAINTAIN",
        P: "PROTECT",
        L: "LEGACY",
        C: "CULTIVATE",
        T: "TRADITION",
        Y: "YES",
        "IS THE KEY": "PRESERVES ROOTS"
      }
    };

    backgroundTextItems.forEach((item) => {
      item.dataset.originalText = item.textContent;
      item.dataset.text = item.textContent;
      gsap.set(item, { opacity: 0 });
    });

    const typeLines = document.querySelectorAll(".type-line");
    typeLines.forEach((line, index) => {
      if (index % 2 === 0) line.classList.add("odd");
      else line.classList.add("even");
    });

    const oddLines = document.querySelectorAll(".type-line.odd");
    const evenLines = document.querySelectorAll(".type-line.even");
    const TYPE_LINE_OPACITY = 0.02;

    const state = {
      activeRowId: null,
      kineticAnimationActive: false,
      activeKineticAnimation: null,
      textRevealAnimation: null,
      transitionInProgress: false
    };

    const textRows = document.querySelectorAll(".text-row");
    const splitTexts = {};

    textRows.forEach((row, index) => {
      const textElement = row.querySelector(".text-content");
      const text = textElement.dataset.text;
      const rowId = row.dataset.rowId;
      row.style.setProperty('--card-index', index);

      splitTexts[rowId] = new SplitText(textElement, {
        type: "chars",
        charsClass: "char",
        mask: true,
        reduceWhiteSpace: false,
        propIndex: true
      });

      textElement.style.visibility = "visible";

      if (window.innerWidth >= 768 && !prefersReducedMotion) {
        row.addEventListener('mousemove', (e) => {
          const rect = row.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const tiltX = -(y / rect.height) * 8;
          const tiltY = (x / rect.width) * 8;
          row.style.setProperty('--tilt-x', `${tiltX}deg`);
          row.style.setProperty('--tilt-y', `${tiltY}deg`);
        });

        row.addEventListener('mouseleave', () => {
          row.style.setProperty('--tilt-x', '0deg');
          row.style.setProperty('--tilt-y', '0deg');
        });
      }

      row.addEventListener('click', () => {
        row.classList.toggle('flipped');
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Space') {
          e.preventDefault();
          row.classList.toggle('flipped');
        }
      });
    });

    function updateCharacterWidths() {
      const isMobile = window.innerWidth < 1024;

      textRows.forEach((row) => {
        const rowId = row.dataset.rowId;
        const textElement = row.querySelector(".text-content");
        const computedStyle = window.getComputedStyle(textElement);
        const currentFontSize = computedStyle.fontSize;
        const chars = splitTexts[rowId].chars;

        chars.forEach((char, i) => {
          const charText = char.textContent || (char.querySelector(".char-inner") ? char.querySelector(".char-inner").textContent : "");
          if (!charText && i === 0) return;

          let charWidth;

          if (isMobile) {
            const fontSizeValue = parseFloat(currentFontSize);
            charWidth = fontSizeValue * 0.55;

            if (!char.querySelector(".char-inner") && charText) {
              char.textContent = "";
              const innerSpan = document.createElement("span");
              innerSpan.className = "char-inner";
              innerSpan.textContent = charText;
              char.appendChild(innerSpan);
              innerSpan.style.transform = "translate3d(0, 0, 0)";
            }

            char.style.width = `${charWidth}px`;
            char.style.maxWidth = `${charWidth}px`;
            char.dataset.charWidth = charWidth;
            char.dataset.hoverWidth = charWidth;
          } else {
            const tempSpan = document.createElement("span");
            tempSpan.style.position = "absolute";
            tempSpan.style.visibility = "hidden";
            tempSpan.style.fontSize = currentFontSize;
            tempSpan.style.fontFamily = "Longsile, sans-serif";
            tempSpan.textContent = charText;
            document.body.appendChild(tempSpan);

            const actualWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);

            const fontSizeValue = parseFloat(currentFontSize);
            const fontSizeRatio = fontSizeValue / 160;
            const padding = 8 * fontSizeRatio;

            charWidth = Math.max(actualWidth + padding, 25 * fontSizeRatio);

            if (!char.querySelector(".char-inner") && charText) {
              char.textContent = "";
              const innerSpan = document.createElement("span");
              innerSpan.className = "char-inner";
              innerSpan.textContent = charText;
              char.appendChild(innerSpan);
              innerSpan.style.transform = "translate3d(0, 0, 0)";
            }

            char.style.width = `${charWidth}px`;
            char.style.maxWidth = `${charWidth}px`;
            char.dataset.charWidth = charWidth;

            const hoverWidth = Math.max(charWidth * 1.6, 70 * fontSizeRatio);
            char.dataset.hoverWidth = hoverWidth;
          }

          char.style.setProperty("--char-index", i);
        });
      });
    }

    updateCharacterWidths();

    window.addEventListener("resize", function () {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(function () {
        updateCharacterWidths();
      }, 200);
    });

    textRows.forEach((row, rowIndex) => {
      const rowId = row.dataset.rowId;
      const chars = splitTexts[rowId].chars;

      gsap.set(chars, {
        opacity: 0,
        filter: "blur(10px)"
      });

      if (!prefersReducedMotion) {
        gsap.to(chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.07,
          ease: "customEase",
          delay: 0.1 * rowIndex
        });
      } else {
        gsap.set(chars, { opacity: 1, filter: "blur(0px)" });
      }
    });

    function forceResetKineticAnimation() {
      if (state.activeKineticAnimation) {
        state.activeKineticAnimation.kill();
        state.activeKineticAnimation = null;
      }

      const kineticType = document.getElementById("kinetic-type");
      gsap.killTweensOf([kineticType, typeLines, oddLines, evenLines]);

      gsap.set(kineticType, {
        display: "grid",
        scale: 1,
        rotation: 0,
        opacity: 1,
        visibility: "visible"
      });

      gsap.set(typeLines, {
        opacity: TYPE_LINE_OPACITY,
        x: "0%"
      });

      state.kineticAnimationActive = false;
    }

    function startKineticAnimation(text) {
      if (prefersReducedMotion) return; // Skip for reduced motion
      forceResetKineticAnimation();

      const kineticType = document.getElementById("kinetic-type");

      kineticType.style.display = "grid";
      kineticType.style.opacity = "1";
      kineticType.style.visibility = "visible";

      const repeatedText = `${text} ${text} ${text}`;

      typeLines.forEach((line) => {
        line.textContent = repeatedText;
      });

      setTimeout(() => {
        const timeline = gsap.timeline({
          onComplete: () => {
            state.kineticAnimationActive = false;
          }
        });

        timeline.to(kineticType, {
          duration: 1.2,
          ease: "customEase",
          scale: 2.5,
          rotation: -90
        });

        timeline.to(
          oddLines,
          {
            keyframes: [
              { x: "15%", duration: 0.8, ease: "customEase" },
              { x: "-180%", duration: 1.2, ease: "customEase" }
            ],
            stagger: 0.06
          },
          0
        );

        timeline.to(
          evenLines,
          {
            keyframes: [
              { x: "-15%", duration: 0.8, ease: "customEase" },
              { x: "180%", duration: 1.2, ease: "customEase" }
            ],
            stagger: 0.06
          },
          0
        );

        timeline.to(
          typeLines,
          {
            keyframes: [
              { opacity: 0.8, duration: 0.8, ease: "customEase" },
              { opacity: 0, duration: 1.2, ease: "customEase" }
            ],
            stagger: 0.04
          },
          0
        );

        state.kineticAnimationActive = true;
        state.activeKineticAnimation = timeline;
      }, 20);
    }

    function fadeOutKineticAnimation() {
      if (!state.kineticAnimationActive) return;

      if (state.activeKineticAnimation) {
        state.activeKineticAnimation.kill();
        state.activeKineticAnimation = null;
      }

      const kineticType = document.getElementById("kinetic-type");

      const fadeOutTimeline = gsap.timeline({
        onComplete: () => {
          gsap.set(kineticType, {
            scale: 1,
            rotation: 0,
            opacity: 1
          });

          gsap.set(typeLines, {
            opacity: TYPE_LINE_OPACITY,
            x: "0%"
          });

          state.kineticAnimationActive = false;
        }
      });

      fadeOutTimeline.to(kineticType, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "customEase"
      });
    }

    function transitionBetweenRows(fromRow, toRow) {
      if (state.transitionInProgress || prefersReducedMotion) return;

      state.transitionInProgress = true;

      const fromRowId = fromRow.dataset.rowId;
      const toRowId = toRow.dataset.rowId;

      fromRow.classList.remove("active");
      const fromChars = splitTexts[fromRowId].chars;
      const fromInners = fromRow.querySelectorAll(".char-inner");

      gsap.killTweensOf(fromChars);
      gsap.killTweensOf(fromInners);

      toRow.classList.add("active");
      state.activeRowId = toRowId;

      const toText = toRow.querySelector(".text-content").dataset.text;
      const toChars = splitTexts[toRowId].chars;
      const toInners = toRow.querySelectorAll(".char-inner");

      forceResetKineticAnimation();

      switchBackgroundImage(toRowId);

      startKineticAnimation(toText);

      if (state.textRevealAnimation) {
        state.textRevealAnimation.kill();
      }
      state.textRevealAnimation = createTextRevealAnimation(toRowId);

      gsap.set(fromChars, {
        maxWidth: (i, target) => parseFloat(target.dataset.charWidth)
      });

      gsap.set(fromInners, {
        x: 0
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          state.transitionInProgress = false;
        }
      });

      timeline.to(
        toChars,
        {
          maxWidth: (i, target) => parseFloat(target.dataset.hoverWidth),
          duration: 0.5,
          stagger: 0.03,
          ease: "customEase"
        },
        0
      );

      timeline.to(
        toInners,
        {
          x: -30,
          duration: 0.5,
          stagger: 0.03,
          ease: "customEase"
        },
        0.05
      );
    }

    function createTextRevealAnimation(rowId) {
      if (prefersReducedMotion) return gsap.timeline();
      const timeline = gsap.timeline();

      timeline.to(backgroundTextItems, {
        opacity: 0.4,
        duration: 0.4,
        ease: "customEase"
      });

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.add("highlight");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            const originalText = item.dataset.text;
            if (
              alternativeTexts[rowId] &&
              alternativeTexts[rowId][originalText]
            ) {
              item.textContent = alternativeTexts[rowId][originalText];
            }
          });
        },
        null,
        "+=0.4"
      );

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.remove("highlight");
          item.classList.add("highlight-reverse");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            item.classList.remove("highlight-reverse");
          });
        },
        null,
        "+=0.4"
      );

      return timeline;
    }

    function resetBackgroundTextWithAnimation() {
      if (prefersReducedMotion) return gsap.timeline();
      const timeline = gsap.timeline();

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.add("highlight");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            item.textContent = item.dataset.originalText;
          });
        },
        null,
        "+=0.4"
      );

      timeline.call(() => {
        backgroundTextItems.forEach((item) => {
          item.classList.remove("highlight");
          item.classList.add("highlight-reverse");
        });
      });

      timeline.call(
        () => {
          backgroundTextItems.forEach((item) => {
            item.classList.remove("highlight-reverse");
          });
        },
        null,
        "+=0.4"
      );

      timeline.to(backgroundTextItems, {
        opacity: 0.85,
        duration: 0.4,
        ease: "customEase"
      });

      return timeline;
    }

    function activateRow(row) {
      const rowId = row.dataset.rowId;

      if (state.activeRowId === rowId || state.transitionInProgress) return;

      const activeRow = document.querySelector(".text-row.active");

      if (activeRow) {
        transitionBetweenRows(activeRow, row);
      } else {
        row.classList.add("active");
        state.activeRowId = rowId;

        const text = row.querySelector(".text-content").dataset.text;
        const chars = splitTexts[rowId].chars;
        const innerSpans = row.querySelectorAll(".char-inner");

        switchBackgroundImage(rowId);
        startKineticAnimation(text);

        if (state.textRevealAnimation) {
          state.textRevealAnimation.kill();
        }
        state.textRevealAnimation = createTextRevealAnimation(rowId);

        const timeline = gsap.timeline();

        timeline.to(
          chars,
          {
            maxWidth: (i, target) => parseFloat(target.dataset.hoverWidth),
            duration: 0.5,
            stagger: 0.03,
            ease: "customEase"
          },
          0
        );

        timeline.to(
          innerSpans,
          {
            x: -30,
            duration: 0.5,
            stagger: 0.03,
            ease: "customEase"
          },
          0.05
        );
      }
    }

    function deactivateRow(row) {
      const rowId = row.dataset.rowId;

      if (state.activeRowId !== rowId || state.transitionInProgress) return;

      state.activeRowId = null;
      row.classList.remove("active");

      switchBackgroundImage("default");
      fadeOutKineticAnimation();

      if (state.textRevealAnimation) {
        state.textRevealAnimation.kill();
      }
      state.textRevealAnimation = resetBackgroundTextWithAnimation();

      const chars = splitTexts[rowId].chars;
      const innerSpans = row.querySelectorAll(".char-inner");

      const timeline = gsap.timeline();

      timeline.to(
        innerSpans,
        {
          x: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: "customEase"
        },
        0
      );

      timeline.to(
        chars,
        {
          maxWidth: (i, target) => parseFloat(target.dataset.charWidth),
          duration: 0.5,
          stagger: 0.02,
          ease: "customEase"
        },
        0.05
      );
    }

    function initializeParallax() {
      if (prefersReducedMotion) return; // Skip for reduced motion
      const container = document.querySelector("body");
      const backgroundElements = [
        ...document.querySelectorAll("[id$='-bg']"),
        document.querySelector(".text-background")
      ];

      const parallaxLayers = [0.015, 0.025, 0.035, 0.045];
      backgroundElements.forEach((el, index) => {
        el.dataset.parallaxSpeed = parallaxLayers[index % parallaxLayers.length];

        gsap.set(el, {
          transformOrigin: "center center",
          force3D: true
        });
      });

      let lastParallaxTime = 0;
      const throttleParallax = 15;

      container.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastParallaxTime < throttleParallax) return;
        lastParallaxTime = now;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = (e.clientX - centerX) / centerX;
        const offsetY = (e.clientY - centerY) / centerY;

        backgroundElements.forEach((el) => {
          const speed = parseFloat(el.dataset.parallaxSpeed);

          if (el.id && el.id.endsWith("-bg") && el.style.opacity === "0") {
            return;
          }

          const moveX = offsetX * 80 * speed;
          const moveY = offsetY * 40 * speed;

          gsap.to(el, {
            x: moveX,
            y: moveY,
            duration: 0.8,
            ease: "mouseEase",
            overwrite: "auto"
          });
        });
      });

      container.addEventListener("mouseleave", () => {
        backgroundElements.forEach((el) => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "customEase"
          });
        });
      });

      backgroundElements.forEach((el, index) => {
        const delay = index * 0.15;
        const floatAmount = 4 + (index % 3) * 1.5;

        gsap.to(el, {
          y: `+=${floatAmount}`,
          duration: 2.5 + (index % 2),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: delay
        });
      });
    }

    textRows.forEach((row) => {
      const interactiveArea = row.querySelector(".interactive-area");

      interactiveArea.addEventListener("mouseenter", () => {
        activateRow(row);
      });

      interactiveArea.addEventListener("mouseleave", () => {
        if (state.activeRowId === row.dataset.rowId) {
          deactivateRow(row);
        }
      });

      // Add focus/blur for keyboard accessibility
      interactiveArea.addEventListener("focus", () => {
        activateRow(row);
      });
      interactiveArea.addEventListener("blur", () => {
        if (state.activeRowId === row.dataset.rowId) {
          deactivateRow(row);
        }
      });
    });

    function scrambleRandomText() {
      if (prefersReducedMotion) return;
      const randomIndex = Math.floor(Math.random() * backgroundTextItems.length);
      const randomItem = backgroundTextItems[randomIndex];
      const originalText = randomItem.dataset.text;

      gsap.to(randomItem, {
        duration: 0.8,
        scrambleText: {
          text: originalText,
          chars: "■▪▌▐▬",
          revealDelay: 0.4,
          speed: 0.25
        },
        ease: "none"
      });

      const delay = 0.4 + Math.random() * 1.5;
      setTimeout(scrambleRandomText, delay * 1000);
    }

    if (!prefersReducedMotion) {
      setTimeout(scrambleRandomText, 800);
    }

    const simplicity = document.querySelector('.text-item[data-text="IS THE KEY"]');
    if (simplicity) {
      const splitSimplicity = new SplitText(simplicity, {
        type: "chars",
        charsClass: "simplicity-char"
      });

      if (!prefersReducedMotion) {
        gsap.from(splitSimplicity.chars, {
          opacity: 0,
          scale: 0.6,
          duration: 0.8,
          stagger: 0.012,
          ease: "customEase",
          delay: 0.8
        });
      } else {
        gsap.set(splitSimplicity.chars, { opacity: 1, scale: 1 });
      }
    }

    backgroundTextItems.forEach((item, index) => {
      if (prefersReducedMotion) {
        gsap.set(item, { opacity: 0.8 });
        return;
      }
      const delay = index * 0.08;
      gsap.to(item, {
        opacity: 0.8,
        duration: 1.5 + (index % 3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay
      });
    });

    initializeParallax();

    const style = document.createElement("style");
    style.textContent = `
      #kinetic-type {
        z-index: 200 !important;
        display: grid !important;
        visibility: visible !important;
        opacity: 1;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  // Card Flip for Skills Section
  document.querySelectorAll('.card-container').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === 'Space') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // Optimize Scroll Event Listener
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        lastScroll = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Prevent Double Tap Zoom on Mobile
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
});
