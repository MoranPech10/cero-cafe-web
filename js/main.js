(function () {
  const state = {
    menuCategories: [],
    bestSellerItems: [],
    activeMenuId: "",
    programmaticMenuTarget: "",
    menuScrollCleanup: null,
    menuScrollUnlockTimer: null,
    revealObserver: null,
    reservationsSlider: null,
  };

  const menuPlaceholderLogo = "assets/logos/Sublogo vertical_negro.svg";
  const defaultBestSellerNames = [
    "Avocado Toast",
    "Mbejú Guaraní XL",
    "French Banana Toast",
    "Croissant a la Reina",
    "Iced Americano",
    "Pistacchio Latte (XL)",
  ];

  const selectors = {
    body: document.body,
    navToggle: document.querySelector("[data-nav-toggle]"),
    nav: document.querySelector("[data-nav]"),
    menuTabs: document.querySelector("[data-menu-tabs]") || document.getElementById("menu-tabs"),
    menuPanel: document.querySelector("[data-menu-panel]") || document.getElementById("menu-content"),
    menuStatus: document.querySelector("[data-menu-status]"),
    whatsappLinks: document.querySelectorAll("[data-whatsapp-link]"),
    address: document.querySelector("[data-address]"),
    hours: document.querySelector("[data-hours]"),
    directionsLinks: document.querySelectorAll("[data-directions-link]"),
    contactCopy: document.querySelector("[data-contact-copy]"),
    header: document.querySelector("[data-header]"),
    menuTabsTrack: document.querySelector("[data-menu-tabs-track]"),
    heroReviews: document.querySelector("[data-hero-reviews]"),
  };

  initHeader();
  initNavigation();
  initFallbackImages();
  initFallbackVideos();
  initLazyVideos();
  initMenuTabsScroller();
  initMenuImageLightbox();
  initProductFilters();
  initCoffeeOriginCards();
  initSpaceStrip();
  initSpaceVideoLightbox();
  initScrollAnimations();
  loadContent();

  function initHeader() {
    if (!selectors.header) return;

    if (selectors.header.classList.contains("products-page-header")) {
      selectors.header.classList.add("is-scrolled");
      return;
    }

    const updateHeader = () => {
      selectors.header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    window.requestAnimationFrame(updateHeader);
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initNavigation() {
    if (!selectors.navToggle || !selectors.nav) return;

    selectors.navToggle.addEventListener("click", () => {
      const isOpen = selectors.body.classList.toggle("nav-open");
      selectors.navToggle.setAttribute("aria-expanded", String(isOpen));
      selectors.navToggle.setAttribute("aria-label", isOpen ? "Cerrar navegacion" : "Abrir navegacion");
    });

    selectors.nav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        selectors.body.classList.remove("nav-open");
        selectors.navToggle.setAttribute("aria-expanded", "false");
        selectors.navToggle.setAttribute("aria-label", "Abrir navegacion");
      }
    });
  }

  function initFallbackImages() {
    document.querySelectorAll("[data-fallback-image]").forEach((image) => {
      if (image.complete && image.naturalWidth === 0) {
        markImageMissing(image);
        return;
      }

      image.addEventListener("error", () => markImageMissing(image), { once: true });
    });
  }

  function markImageMissing(image) {
    image.classList.add("is-missing");
    image.parentElement?.classList.add("has-missing-image");
    image.closest(".hero")?.classList.add("is-fallback");
  }

  function initFallbackVideos() {
    document.querySelectorAll("[data-fallback-video]").forEach((video) => {
      video.playbackRate = 0.72;

      const markMissing = () => {
        if (video.poster) {
          video.classList.add("has-playback-error");
          return;
        }

        video.classList.add("is-missing");
        video.parentElement?.classList.add("has-missing-video");
      };

      video.addEventListener("error", markMissing, { once: true });
      video.querySelectorAll("source").forEach((source) => {
        source.addEventListener("error", markMissing, { once: true });
      });
    });
  }

  function initLazyVideos() {
    const videos = Array.from(document.querySelectorAll("[data-autoplay-video]"));
    if (!videos.length) return;

    const loadVideo = (video) => {
      if (video.dataset.videoLoaded === "true") return;

      if (video.dataset.poster) {
        video.poster = video.dataset.poster;
      }

      video.querySelectorAll("source[data-src]").forEach((source) => {
        source.src = source.dataset.src;
      });

      video.dataset.videoLoaded = "true";
      video.load();
    };

    const playVideo = (video) => {
      loadVideo(video);
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          video.classList.add("has-playback-error");
        });
      }
    };

    if (!("IntersectionObserver" in window)) {
      videos.forEach(playVideo);
      return;
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isApproachingFromBelow = entry.boundingClientRect.top >= 0;
        const isSubstantiallyVisible = entry.intersectionRatio >= 0.2;

        if (entry.isIntersecting && (isApproachingFromBelow || isSubstantiallyVisible)) {
          playVideo(entry.target);
        } else if (entry.target.dataset.videoLoaded === "true") {
          entry.target.pause();
        }
      });
    }, {
      rootMargin: "0px 250px 100px",
      threshold: [0.01, 0.2],
    });

    videos.forEach((video) => videoObserver.observe(video));
  }

  function initReservationsSlider(config) {
    const section = document.querySelector("[data-reservations-slider]");
    const stage = section?.querySelector("[data-reservations-stage]");
    const resources = Array.isArray(config?.recursos)
      ? config.recursos.filter((item) => item?.src && item.tipo === "video").slice(0, 6)
      : [];

    if (!section || !stage || !resources.length || state.reservationsSlider) return;

    stage.innerHTML = "";
    const slides = resources.map((resource, index) => {
      const slide = document.createElement("figure");
      slide.className = `reservations-slide${index === 0 ? " is-active" : ""}`;
      slide.dataset.reservationsSlide = String(index);
      slide.dataset.mediaType = resource.tipo;
      slide.style.setProperty("--reservation-position", resource.posicion || "center");
      slide.style.setProperty("--reservation-position-mobile", resource.posicion_movil || resource.posicion || "center");

      const ambient = document.createElement("div");
      ambient.className = "reservations-video-ambient";
      ambient.setAttribute("aria-hidden", "true");

      const ambientPoster = document.createElement("img");
      ambientPoster.className = "reservations-video-ambient__poster";
      ambientPoster.alt = "";
      ambientPoster.decoding = "async";
      ambientPoster.loading = "lazy";
      ambientPoster.dataset.src = resource.poster || "";
      ambient.appendChild(ambientPoster);

      const phone = document.createElement("div");
      phone.className = "reservations-phone";
      phone.setAttribute("aria-hidden", "true");

      const video = document.createElement("video");
      video.className = "reservations-video-main";
      video.muted = true;
      video.defaultMuted = true;
      video.controls = false;
      video.loop = false;
      video.playsInline = true;
      video.preload = "none";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("tabindex", "-1");
      video.removeAttribute("controls");
      video.removeAttribute("loop");
      video.dataset.poster = resource.poster || "";
      video.dataset.ambientSrc = resource.src;

      const source = document.createElement("source");
      source.dataset.src = resource.src;
      source.type = "video/mp4";
      video.appendChild(source);
      phone.appendChild(video);
      slide.append(ambient, phone);

      stage.appendChild(slide);
      return slide;
    });

    const slider = {
      section,
      slides,
      index: 0,
      inView: false,
      pageVisible: !document.hidden,
      frameRatio: "",
      failedSlides: new Set(),
      scheduleToken: 0,
    };
    state.reservationsSlider = slider;

    const getVideo = (slide) => slide?.querySelector(".reservations-video-main") || null;
    const getAmbientVideo = (slide) => slide?.querySelector(".reservations-video-ambient__video") || null;

    const shouldPlay = () => slider.inView && slider.pageVisible;

    const canPlayAmbientVideo = () => {
      const hasRoom = window.matchMedia("(min-width: 768px)").matches;
      const savesData = Boolean(navigator.connection?.saveData);
      const deviceMemory = Number(navigator.deviceMemory);
      const isLowMemoryDevice = Number.isFinite(deviceMemory) && deviceMemory <= 4;
      return hasRoom && !savesData && !isLowMemoryDevice;
    };

    const pauseSlideVideos = (slide) => {
      getVideo(slide)?.pause();
      getAmbientVideo(slide)?.pause();
    };

    const syncAmbientTime = (slide, force = false) => {
      const video = getVideo(slide);
      const ambientVideo = getAmbientVideo(slide);
      if (!video || !ambientVideo || ambientVideo.readyState < 1 || !Number.isFinite(video.currentTime)) return;

      if (force || Math.abs(ambientVideo.currentTime - video.currentTime) > 0.22) {
        try {
          ambientVideo.currentTime = video.currentTime;
        } catch (error) {
          // El siguiente evento de reproduccion vuelve a intentar la sincronizacion.
        }
      }
      ambientVideo.playbackRate = video.playbackRate;
    };

    const playAmbientVideo = (slide) => {
      const video = getVideo(slide);
      const ambientVideo = getAmbientVideo(slide);
      if (!video || !ambientVideo || video.paused || !slide.classList.contains("is-active") || !shouldPlay()) return;

      const beginPlayback = () => {
        if (video.paused || !slide.classList.contains("is-active") || !shouldPlay()) return;
        syncAmbientTime(slide, true);
        const playPromise = ambientVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => slide.classList.add("uses-ambient-poster"));
        }
      };

      if (ambientVideo.readyState >= 2) {
        beginPlayback();
      } else if (ambientVideo.dataset.waitingToPlay !== "true") {
        ambientVideo.dataset.waitingToPlay = "true";
        ambientVideo.addEventListener("canplay", () => {
          delete ambientVideo.dataset.waitingToPlay;
          beginPlayback();
        }, { once: true });
      }
    };

    const ensureAmbientVideo = (slide) => {
      if (!slide?.classList.contains("is-vertical-video") || !canPlayAmbientVideo()) return null;

      let ambientVideo = getAmbientVideo(slide);
      if (ambientVideo) return ambientVideo;

      const video = getVideo(slide);
      const ambient = slide.querySelector(".reservations-video-ambient");
      if (!video || !ambient || !video.dataset.ambientSrc) return null;

      ambientVideo = document.createElement("video");
      ambientVideo.className = "reservations-video-ambient__video";
      ambientVideo.muted = true;
      ambientVideo.defaultMuted = true;
      ambientVideo.controls = false;
      ambientVideo.loop = false;
      ambientVideo.playsInline = true;
      ambientVideo.preload = "none";
      ambientVideo.setAttribute("muted", "");
      ambientVideo.setAttribute("playsinline", "");
      ambientVideo.setAttribute("aria-hidden", "true");
      ambientVideo.setAttribute("tabindex", "-1");
      ambientVideo.removeAttribute("controls");
      ambientVideo.removeAttribute("loop");

      const source = document.createElement("source");
      source.src = video.dataset.ambientSrc;
      source.type = "video/mp4";
      ambientVideo.appendChild(source);
      ambientVideo.addEventListener("playing", () => slide.classList.add("is-ambient-playing"));
      ambientVideo.addEventListener("pause", () => slide.classList.remove("is-ambient-playing"));
      ambientVideo.addEventListener("error", () => {
        ambientVideo.pause();
        slide.classList.add("uses-ambient-poster");
      }, { once: true });
      ambient.appendChild(ambientVideo);
      ambientVideo.load();
      return ambientVideo;
    };

    const applyVideoOrientation = (slide, width, height) => {
      if (!slide || !width || !height) return;

      const isVertical = height > width;
      if (isVertical && !slider.frameRatio) {
        slider.frameRatio = `${width} / ${height}`;
        slider.slides.forEach((item) => {
          item.querySelector(".reservations-phone")?.style.setProperty("--reservation-video-ratio", slider.frameRatio);
        });
      }
      slide.classList.toggle("is-vertical-video", isVertical);
      slide.dataset.videoOrientation = isVertical ? "vertical" : "horizontal";
      if (slide.classList.contains("is-active")) {
        section.classList.toggle("has-active-vertical-video", isVertical);
      }

      if (isVertical && slide.classList.contains("is-active") && shouldPlay()) {
        ensureAmbientVideo(slide);
        playAmbientVideo(slide);
      }
    };

    const updateVideoOrientation = (slide) => {
      const video = getVideo(slide);
      if (!video) return;
      applyVideoOrientation(slide, video.videoWidth, video.videoHeight);
    };

    const markVideoError = (slide) => {
      if (!slide || slide.dataset.mediaFailed === "true") return;
      slide.dataset.mediaFailed = "true";
      slider.failedSlides.add(slide);
      pauseSlideVideos(slide);
      const video = getVideo(slide);
      video?.removeAttribute("autoplay");
      video?.classList.add("has-playback-error");

      if (slide.classList.contains("is-active") && shouldPlay() && slider.failedSlides.size < slider.slides.length) {
        window.requestAnimationFrame(showNext);
      }
    };

    const loadSlide = (index) => {
      const slide = slider.slides[index];
      if (!slide || slide.dataset.mediaLoaded === "true") return;

      const video = getVideo(slide);
      if (video) {
        if (video.dataset.poster) video.poster = video.dataset.poster;
        const ambientPoster = slide.querySelector(".reservations-video-ambient__poster[data-src]");
        if (ambientPoster?.dataset.src) {
          ambientPoster.addEventListener("load", () => {
            applyVideoOrientation(slide, ambientPoster.naturalWidth, ambientPoster.naturalHeight);
          }, { once: true });
          ambientPoster.src = ambientPoster.dataset.src;
          ambientPoster.removeAttribute("data-src");
        }
        video.querySelectorAll("source[data-src]").forEach((source) => {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
          source.addEventListener("error", () => markVideoError(slide), { once: true });
        });
        video.addEventListener("error", () => markVideoError(slide), { once: true });
        video.addEventListener("loadedmetadata", () => updateVideoOrientation(slide));
        video.addEventListener("playing", () => {
          ensureAmbientVideo(slide);
          playAmbientVideo(slide);
        });
        video.addEventListener("pause", () => getAmbientVideo(slide)?.pause());
        video.addEventListener("seeking", () => syncAmbientTime(slide, true));
        video.addEventListener("ratechange", () => syncAmbientTime(slide));
        video.addEventListener("timeupdate", () => syncAmbientTime(slide));
        video.addEventListener("ended", () => {
          if (slide.classList.contains("is-active") && shouldPlay()) showNext();
        });
        video.preload = "metadata";
        video.load();
      }

      slide.dataset.mediaLoaded = "true";
    };

    const prepareNextSlide = () => {
      const nextIndex = (slider.index + 1) % slider.slides.length;
      loadSlide(nextIndex);
      const nextVideo = getVideo(slider.slides[nextIndex]);
      if (!nextVideo || nextVideo.dataset.prepared === "true") return;

      nextVideo.preload = "auto";
      nextVideo.dataset.prepared = "true";
      nextVideo.load();
    };

    const pauseActiveMedia = () => {
      const activeSlide = slider.slides[slider.index];
      const video = getVideo(activeSlide);
      pauseSlideVideos(activeSlide);
      video?.removeAttribute("autoplay");
    };

    const scheduleActiveSlide = () => {
      pauseActiveMedia();
      slider.scheduleToken += 1;
      const scheduleToken = slider.scheduleToken;
      if (!shouldPlay()) return;

      const slide = slider.slides[slider.index];
      const video = getVideo(slide);

      if (!video || slide.dataset.mediaFailed === "true") {
        if (slider.failedSlides.size < slider.slides.length) window.requestAnimationFrame(showNext);
        return;
      }

      const startVideo = () => {
        if (slider.scheduleToken !== scheduleToken || slider.slides[slider.index] !== slide || !shouldPlay()) return;

        video.autoplay = true;
        video.setAttribute("autoplay", "");
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => markVideoError(slide));
        }
      };

      if (video.readyState >= 2) {
        startVideo();
      } else {
        video.addEventListener("canplay", startVideo, { once: true });
      }
    };

    const showSlide = (nextIndex) => {
      const normalizedIndex = (nextIndex + slider.slides.length) % slider.slides.length;
      const currentSlide = slider.slides[slider.index];
      const nextSlide = slider.slides[normalizedIndex];

      pauseActiveMedia();
      const currentVideo = getVideo(currentSlide);
      if (currentVideo && currentVideo.readyState >= 1) {
        try {
          currentVideo.currentTime = 0;
          const ambientVideo = getAmbientVideo(currentSlide);
          if (ambientVideo?.readyState >= 1) ambientVideo.currentTime = 0;
        } catch (error) {
          // El reinicio se completa cuando el video vuelve a estar listo.
        }
      }
      currentSlide?.classList.remove("is-active");
      nextSlide.classList.add("is-active");
      slider.index = normalizedIndex;
      section.classList.toggle("has-active-vertical-video", nextSlide.classList.contains("is-vertical-video"));

      loadSlide(slider.index);
      prepareNextSlide();
      scheduleActiveSlide();
    };

    function showNext() {
      showSlide(slider.index + 1);
    }

    loadSlide(0);

    document.addEventListener("visibilitychange", () => {
      slider.pageVisible = !document.hidden;
      scheduleActiveSlide();
    });

    if (!("IntersectionObserver" in window)) {
      slider.inView = true;
      prepareNextSlide();
      scheduleActiveSlide();
      return;
    }

    const preloadObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      loadSlide(0);
      prepareNextSlide();
      observer.disconnect();
    }, { rootMargin: "400px 0px", threshold: 0.01 });

    const visibilityObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      slider.inView = Boolean(entry?.isIntersecting);
      scheduleActiveSlide();
    }, { threshold: [0, 0.01, 0.5] });

    preloadObserver.observe(section);
    visibilityObserver.observe(section);

    window.addEventListener("resize", () => {
      const activeSlide = slider.slides[slider.index];
      const ambientVideo = getAmbientVideo(activeSlide);
      if (!canPlayAmbientVideo()) {
        ambientVideo?.pause();
        return;
      }
      ensureAmbientVideo(activeSlide);
      playAmbientVideo(activeSlide);
    }, { passive: true });
  }

  function initMenuImageLightbox() {
    if (!selectors.menuPanel) return;
    const interactionRoot = selectors.menuPanel.closest(".menu-section") || selectors.menuPanel;

    let lightbox = null;
    let lightboxImage = null;
    let lightboxCaption = null;
    let lightboxClose = null;
    let lastFocusedElement = null;

    const ensureLightbox = () => {
      if (lightbox) return;

      lightbox = document.createElement("div");
      lightbox.className = "menu-image-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "Foto completa del producto");
      lightbox.hidden = true;

      const backdrop = document.createElement("button");
      backdrop.className = "menu-lightbox-backdrop";
      backdrop.type = "button";
      backdrop.setAttribute("aria-label", "Cerrar foto");

      const card = document.createElement("div");
      card.className = "menu-lightbox-card";

      lightboxClose = document.createElement("button");
      lightboxClose.className = "menu-lightbox-close";
      lightboxClose.type = "button";
      lightboxClose.setAttribute("aria-label", "Cerrar foto");
      lightboxClose.textContent = "Cerrar";

      lightboxImage = document.createElement("img");
      lightboxImage.alt = "";

      lightboxCaption = document.createElement("p");
      lightboxCaption.className = "menu-lightbox-caption";

      card.append(lightboxClose, lightboxImage, lightboxCaption);
      lightbox.append(backdrop, card);
      document.body.appendChild(lightbox);

      backdrop.addEventListener("click", closeLightbox);
      lightboxClose.addEventListener("click", closeLightbox);
    };

    const openLightbox = (button) => {
      const image = button.querySelector("img");
      if (!image) return;

      ensureLightbox();
      lastFocusedElement = document.activeElement;
      lightboxImage.src = button.dataset.fullImage || image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = button.dataset.productName || image.alt || "";
      lightbox.hidden = false;
      selectors.body.classList.add("lightbox-open");
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      if (!lightbox || lightbox.hidden) return;

      lightbox.hidden = true;
      lightboxImage.removeAttribute("src");
      selectors.body.classList.remove("lightbox-open");

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    };

    interactionRoot.addEventListener("click", (event) => {
      const button = event.target.closest("[data-menu-image-open]");
      if (!button) return;
      openLightbox(button);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function initProductFilters() {
    const filterButtons = Array.from(document.querySelectorAll("[data-product-filter]"));
    const productCards = Array.from(document.querySelectorAll("[data-product-category]"));
    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeFilter = button.dataset.productFilter || "all";

        filterButtons.forEach((filterButton) => {
          filterButton.classList.toggle("is-active", filterButton === button);
        });

        productCards.forEach((card) => {
          const isVisible = activeFilter === "all" || card.dataset.productCategory === activeFilter;
          card.classList.toggle("is-hidden", !isVisible);
        });
      });
    });
  }

  function initCoffeeOriginCards() {
    const coffeeCards = Array.from(document.querySelectorAll("[data-coffee-origin]"));
    if (!coffeeCards.length) return;

    const updateView = (card, showLabel) => {
      const packaging = card.querySelector("[data-coffee-packaging]");
      const label = card.querySelector("[data-coffee-label]");
      const media = card.querySelector("[data-coffee-media]");
      if (!packaging || !label || !media) return;

      const origin = card.dataset.coffeeOriginName || "este café";
      packaging.setAttribute("aria-hidden", String(showLabel));
      label.setAttribute("aria-hidden", String(!showLabel));
      media.setAttribute("aria-pressed", String(showLabel));
      media.setAttribute("aria-label", showLabel ? `Mostrar packaging de ${origin}` : `Mostrar etiqueta de ${origin}`);
      media.classList.toggle("is-showing-label", showLabel);
    };

    coffeeCards.forEach((card) => {
      const media = card.querySelector("[data-coffee-media]");
      if (!media) return;
      let activePointerId = null;

      const finishPress = (event) => {
        if (activePointerId === null) return;
        if (typeof event.pointerId === "number" && event.pointerId !== activePointerId) return;

        activePointerId = null;
        updateView(card, false);
      };

      media.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

        activePointerId = event.pointerId;
        updateView(card, true);
      }, { passive: true });

      media.addEventListener("pointerup", finishPress, { passive: true });
      media.addEventListener("pointercancel", finishPress, { passive: true });
      window.addEventListener("pointerup", finishPress, { passive: true });
      window.addEventListener("pointercancel", finishPress, { passive: true });

      media.addEventListener("click", (event) => {
        if (event.detail !== 0) return;

        const showLabel = media.getAttribute("aria-pressed") !== "true";
        updateView(card, showLabel);
      });
    });
  }

  function initSpaceStrip() {
    const track = document.querySelector("[data-space-strip-track]");
    const prevButton = document.querySelector("[data-space-strip-prev]");
    const nextButton = document.querySelector("[data-space-strip-next]");
    if (!track || !prevButton || !nextButton) return;

    const getStep = () => {
      const firstCard = track.querySelector(".space-strip__card");
      if (!firstCard) return Math.max(track.clientWidth * 0.8, 240);

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const hasOverflow = maxScroll > 4;
      prevButton.hidden = !hasOverflow;
      nextButton.hidden = !hasOverflow;
      prevButton.disabled = !hasOverflow;
      nextButton.disabled = !hasOverflow;
    };

    prevButton.addEventListener("click", () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const isAtStart = track.scrollLeft <= 4;
      track.scrollTo({
        left: isAtStart ? maxScroll : Math.max(track.scrollLeft - getStep(), 0),
        behavior: "smooth",
      });
    });

    nextButton.addEventListener("click", () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const isAtEnd = track.scrollLeft >= maxScroll - 4;
      track.scrollTo({
        left: isAtEnd ? 0 : Math.min(track.scrollLeft + getStep(), maxScroll),
        behavior: "smooth",
      });
    });

    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons, { passive: true });
    updateButtons();
  }

  function initSpaceVideoLightbox() {
    const videoCards = Array.from(document.querySelectorAll("[data-space-video]"));
    if (!videoCards.length) return;

    let lightbox = null;
    let lightboxVideo = null;
    let lightboxCaption = null;
    let lightboxClose = null;
    let lastFocusedElement = null;

    const ensureLightbox = () => {
      if (lightbox) return;

      lightbox = document.createElement("div");
      lightbox.className = "menu-image-lightbox space-video-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "Video de Cero Cafe de Origen");
      lightbox.hidden = true;

      const backdrop = document.createElement("button");
      backdrop.className = "menu-lightbox-backdrop";
      backdrop.type = "button";
      backdrop.setAttribute("aria-label", "Cerrar video");

      const card = document.createElement("div");
      card.className = "menu-lightbox-card";

      lightboxClose = document.createElement("button");
      lightboxClose.className = "menu-lightbox-close";
      lightboxClose.type = "button";
      lightboxClose.setAttribute("aria-label", "Cerrar video");
      lightboxClose.textContent = "Cerrar";

      lightboxVideo = document.createElement("video");
      lightboxVideo.controls = true;
      lightboxVideo.playsInline = true;
      lightboxVideo.preload = "metadata";

      lightboxCaption = document.createElement("p");
      lightboxCaption.className = "menu-lightbox-caption";

      card.append(lightboxClose, lightboxVideo, lightboxCaption);
      lightbox.append(backdrop, card);
      document.body.appendChild(lightbox);

      backdrop.addEventListener("click", closeLightbox);
      lightboxClose.addEventListener("click", closeLightbox);
    };

    const openLightbox = (card) => {
      const videoSrc = card.dataset.videoSrc;
      if (!videoSrc) return;

      ensureLightbox();
      lastFocusedElement = document.activeElement;
      lightboxVideo.src = videoSrc;
      lightboxVideo.poster = card.dataset.videoPoster || "";
      lightboxCaption.textContent = card.dataset.videoTitle || card.querySelector("figcaption")?.textContent || "Video Cero";
      lightbox.hidden = false;
      selectors.body.classList.add("lightbox-open");
      lightboxClose.focus();

      const playPromise = lightboxVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    function closeLightbox() {
      if (!lightbox || lightbox.hidden) return;

      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.removeAttribute("poster");
      lightboxVideo.load();
      lightbox.hidden = true;
      selectors.body.classList.remove("lightbox-open");

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }

    videoCards.forEach((card) => {
      card.addEventListener("click", () => openLightbox(card));
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openLightbox(card);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      state.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          clearRevealDelay(entry.target);
          state.revealObserver.unobserve(entry.target);
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      });
    }

    enhanceMotion(document);
  }

  function enhanceMotion(scope) {
    const hashId = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    const initialTarget = hashId ? document.getElementById(hashId) : null;
    const revealTargets = Array.from(scope.querySelectorAll([
      ".menu-group-heading",
      ".reservations-content",
      ".menu-product-card",
      ".cero-product-card",
      ".event-type-card",
      ".events-main-media",
      ".events-photo-row img",
      ".events-photo-row video",
      ".space-strip__card",
    ].join(",")));

    revealTargets.forEach((element, index) => {
      if (element.dataset.revealReady === "true") return;

      element.dataset.revealReady = "true";
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${(index % 8) * 60}ms`);

      if (initialTarget?.contains(element)) {
        element.classList.add("is-visible");
        element.style.setProperty("--reveal-delay", "0ms");
        return;
      }

      if (state.revealObserver) {
        state.revealObserver.observe(element);
      } else {
        element.classList.add("is-visible");
        element.style.setProperty("--reveal-delay", "0ms");
      }
    });
  }

  function clearRevealDelay(element) {
    const delay = Number.parseFloat(element.style.getPropertyValue("--reveal-delay")) || 0;
    window.setTimeout(() => {
      element.style.setProperty("--reveal-delay", "0ms");
    }, delay + 760);
  }

  async function loadContent() {
    const bundledData = window.CERO_CONTENIDO;
    if (bundledData && Object.keys(bundledData).length) {
      applySiteContent(bundledData);
      applyMenuContent(bundledData);
      return;
    }

    try {
      const data = await fetchJson("./data/contenido.json");

      applySiteContent(data);
      applyMenuContent(data);
    } catch (error) {
      console.error("No se pudo cargar el contenido del sitio.", error);
      const fallbackData = window.CERO_CONTENIDO || {};
      applySiteContent(fallbackData);
      applyMenuContent(fallbackData);
    }
  }

  function applyMenuContent(data) {
    const menu = normalizeMenu(data);
    state.menuCategories = menu.groups;
    state.bestSellerItems = menu.bestSellers;
    renderMenu();
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar data/contenido.json");

    const rawText = await response.text();
    return rawText.trim() ? JSON.parse(rawText) : {};
  }

  function applySiteContent(data) {
    const contact = data.contacto || data.contact || {};
    const location = data.ubicacion || data.location || {};
    renderHeroReviews(data?.hero?.valoraciones);
    initReservationsSlider(data?.reservas);

    const whatsapp = contact.whatsapp_link || contact.whatsappLink || contact.whatsapp || data.whatsapp_link || data.whatsapp || "";
    const whatsappUrl = buildWhatsappUrl(whatsapp);
    if (whatsappUrl) {
      selectors.whatsappLinks.forEach((link) => {
        const message = link.dataset.whatsappMessage;
        link.href = message ? `${whatsappUrl}?text=${encodeURIComponent(message)}` : whatsappUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });
    }

    if (selectors.contactCopy && whatsappUrl) {
      selectors.contactCopy.textContent = "Escribinos por WhatsApp para hacer una consulta.";
    }

    const address = normalizeAddress(location.direccion || location.address || data.direccion || selectors.address?.textContent.trim() || "");
    if (selectors.address && address) {
      selectors.address.textContent = address;
    }

    const hours = location.horarios || location.hours || data.horarios || "";
    if (selectors.hours && hours) {
      selectors.hours.innerHTML = "";
      normalizeTextList(hours).forEach((line) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        selectors.hours.appendChild(paragraph);
      });
    }

    const directionsUrl =
      location.comoLlegar ||
      location.directions ||
      location.googleMapsUrl ||
      location.mapsUrl ||
      location.google_maps ||
      "";

    if (directionsUrl) {
      selectors.directionsLinks.forEach((link) => {
        link.href = directionsUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.hidden = false;
      });
    }
  }

  function renderHeroReviews(reviews) {
    if (!selectors.heroReviews || !reviews) return;

    const score = Number(reviews.puntuacion);
    const total = Number(reviews.total_opiniones);
    const source = cleanText(reviews.fuente || "Google");
    const link = cleanText(reviews.enlace_google || "");
    const disclaimer = cleanText(reviews.aclaracion || "Distribución aproximada según Google");
    const distribution = Array.isArray(reviews.distribucion_aproximada)
      ? reviews.distribucion_aproximada
      : [];

    if (!Number.isFinite(score) || !Number.isFinite(total) || !distribution.length) return;

    const summary = document.createElement("div");
    summary.className = "hero-reviews-summary";

    const scoreElement = document.createElement("strong");
    scoreElement.className = "hero-reviews-score";
    scoreElement.textContent = score.toFixed(1);

    const stars = document.createElement("span");
    stars.className = "hero-reviews-stars";
    stars.textContent = "★★★★★";
    stars.setAttribute("aria-hidden", "true");

    const countLink = document.createElement("a");
    countLink.className = "hero-reviews-count";
    countLink.textContent = `+${total} opiniones`;
    countLink.href = link;
    countLink.target = "_blank";
    countLink.rel = "noopener noreferrer";
    countLink.setAttribute("aria-label", `Más de ${total} opiniones en ${source} (abre en una pestaña nueva)`);

    const sourceElement = document.createElement("span");
    sourceElement.className = "hero-reviews-source";
    sourceElement.textContent = source;

    summary.append(scoreElement, stars, countLink, sourceElement);

    const bars = document.createElement("div");
    bars.className = "hero-reviews-bars";
    bars.setAttribute("role", "img");
    bars.setAttribute("aria-label", disclaimer);

    distribution.forEach((item) => {
      const starsCount = Math.min(5, Math.max(1, Number(item?.estrellas) || 1));
      const visualLevel = Math.min(100, Math.max(0, Number(item?.nivel_visual) || 0));
      const row = document.createElement("div");
      row.className = "hero-reviews-row";

      const label = document.createElement("span");
      label.className = "hero-reviews-row-label";
      label.textContent = String(starsCount);

      const track = document.createElement("span");
      track.className = "hero-reviews-track";
      track.setAttribute("aria-hidden", "true");

      const fill = document.createElement("span");
      fill.className = "hero-reviews-fill";
      fill.style.setProperty("--review-level", `${visualLevel}%`);
      track.appendChild(fill);
      row.append(label, track);
      bars.appendChild(row);
    });

    const note = document.createElement("p");
    note.className = "hero-reviews-note";
    note.textContent = disclaimer;

    const reviewSummary = reviews.resumen || {};
    const reviewSummaryTitle = cleanText(reviewSummary.titulo || "");
    const reviewSummaryText = cleanText(reviewSummary.texto || "");
    const reviewSummaryNote = cleanText(reviewSummary.aclaracion || "");
    const reviewBubble = document.createElement("aside");
    reviewBubble.className = "hero-reviews-bubble";
    reviewBubble.setAttribute("aria-labelledby", "hero-reviews-bubble-title");

    const reviewBubbleTitle = document.createElement("h2");
    reviewBubbleTitle.id = "hero-reviews-bubble-title";
    reviewBubbleTitle.textContent = reviewSummaryTitle;

    const reviewBubbleText = document.createElement("p");
    reviewBubbleText.className = "hero-reviews-bubble-text";
    reviewBubbleText.textContent = reviewSummaryText;

    const reviewBubbleNote = document.createElement("p");
    reviewBubbleNote.className = "hero-reviews-bubble-note";
    reviewBubbleNote.textContent = reviewSummaryNote;

    reviewBubble.append(reviewBubbleTitle, reviewBubbleText, reviewBubbleNote);
    reviewBubble.hidden = !reviewSummaryTitle || !reviewSummaryText;

    selectors.heroReviews.replaceChildren(summary, bars, note, reviewBubble);
    selectors.heroReviews.setAttribute(
      "aria-label",
      `Valoración de ${source}: ${score.toFixed(1)} de 5, basada en más de ${total} opiniones. ${disclaimer}.`,
    );
  }

  function normalizeMenu(data) {
    const categories = data?.menu?.categorias;
    if (!Array.isArray(categories)) return { groups: [], bestSellers: [] };

    const normalizedCategories = categories
      .map(normalizeCategory)
      .filter((category) => category.name && category.items.length);

    return {
      groups: groupMenuCategories(normalizedCategories),
      bestSellers: createBestSellerItems(data?.menu?.mas_vendidos, normalizedCategories),
    };
  }

  function normalizeCategory(category) {
    const name = cleanText(category?.nombre || "");
    const id = category?.id ? String(category.id) : slugify(name);
    const note = cleanText(category?.nota || "");
    const groupNote = cleanText(category?.nota_grupo || "");
    const items = Array.isArray(category?.items)
      ? category.items.map(normalizeMenuItem).filter((item) => item.name)
      : [];

    return { id, name, note, groupNote, items };
  }

  function normalizeMenuItem(item) {
    return {
      name: cleanText(item?.nombre || ""),
      description: cleanText(item?.descripcion || ""),
      price: formatPrice(item?.precio),
      image: cleanText(item?.imagen || ""),
      originalImage: cleanText(item?.imagen_original || item?.imagen || ""),
      badge: cleanText(item?.etiqueta || ""),
      photoStatus: cleanText(item?.estado_foto || ""),
      imageTreatment: cleanText(item?.ajuste_imagen || ""),
      imagePosition: cleanText(item?.posicion_imagen || ""),
    };
  }

  function createBestSellerItems(bestSellerReferences, categories) {
    const menuItems = categories.flatMap((category) => category.items);
    const findItem = (name) => menuItems.find((item) => normalizeKey(item.name) === normalizeKey(name));
    const references = Array.isArray(bestSellerReferences) && bestSellerReferences.length
      ? bestSellerReferences
      : defaultBestSellerNames.map((name) => ({ producto: name }));

    return references
      .map((reference) => findItem(typeof reference === "string" ? reference : reference?.producto))
      .filter(Boolean)
      .map((item) => ({ ...item }));
  }

  function groupMenuCategories(categories) {
    const groups = [
      {
        id: "hot-drinks",
        name: "Hot Drinks",
        categoryNames: ["Solo Café", "Café con Leche", "Bebidas Calientes"],
      },
      {
        id: "cold-drinks",
        name: "Cold Drinks",
        categoryNames: ["Café Frío", "Bebidas Frías", "Winter Drinks"],
      },
      {
        id: "todo-el-dia",
        name: "Todo el Día",
        categoryNames: ["Todo el Día"],
      },
      {
        id: "combos-brunch",
        name: "Combos / Brunch",
        categoryNames: ["Combos / Brunch"],
      },
      {
        id: "menu-mediodia",
        name: "Menú Mediodía",
        categoryNames: ["Menú Mediodía"],
      },
      {
        id: "mostrador",
        name: "Mostrador",
        categoryNames: ["Pastries", "Cakes"],
      },
    ];

    const usedCategoryIds = new Set();

    const menuGroups = groups
      .map((group) => {
        const groupKeys = group.categoryNames.map(normalizeKey);
        const matchedCategories = categories.filter((category) => {
          const isMatch = groupKeys.includes(normalizeKey(category.name));
          if (isMatch) usedCategoryIds.add(category.id);
          return isMatch;
        });

        return {
          id: group.id,
          name: group.name,
          note: matchedCategories.find((category) => category.groupNote)?.groupNote || "",
          categories: matchedCategories,
        };
      })
      .filter((group) => group.categories.length);

    categories.forEach((category) => {
      if (!usedCategoryIds.has(category.id)) {
        menuGroups.push({
          id: category.id,
          name: category.name,
          note: category.groupNote,
          categories: [category],
        });
      }
    });

    return menuGroups;
  }

  function renderMenu() {
    if (!selectors.menuTabs || !selectors.menuTabsTrack || !selectors.menuPanel) return;

    if (!state.menuCategories.length) {
      setMenuMessage("");
      selectors.menuTabsTrack.innerHTML = "";
      selectors.menuPanel.innerHTML = "";
      enhanceMotion(document);
      return;
    }

    setMenuMessage("");
    state.activeMenuId = state.menuCategories[0].id;
    renderMenuNavigation();
    renderAllMenuCategories();
    enhanceMotion(selectors.menuPanel);

    window.requestAnimationFrame(() => {
      initMenuScrollSpy();
      restoreHashPosition();
    });
  }

  function renderMenuNavigation() {
    selectors.menuTabsTrack.innerHTML = "";
    const navigationItems = state.menuCategories.map((group) => ({ id: group.id, name: group.name }));
    if (state.bestSellerItems.length) navigationItems.push({ id: "mas-vendidos", name: "Más vendidos" });

    navigationItems.forEach((item) => {
      const link = document.createElement("a");
      link.className = "menu-tab";
      link.href = `#${item.id}`;
      link.dataset.menuLink = item.id;
      link.textContent = item.name;
      if (item.id === state.activeMenuId) link.setAttribute("aria-current", "true");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigateToMenuCategory(item.id, { updateHistory: true });
      });
      selectors.menuTabsTrack.appendChild(link);
    });
  }

  function scrollMenuLinkIntoView(link) {
    if (!link || !selectors.menuTabs) return;

    const scrollerRect = selectors.menuTabs.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const targetLeft = selectors.menuTabs.scrollLeft
      + linkRect.left
      - scrollerRect.left
      - (selectors.menuTabs.clientWidth - linkRect.width) / 2;

    selectors.menuTabs.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function initMenuTabsScroller() {
    const scroller = selectors.menuTabs;
    if (!scroller) return;

    let pointerId = null;
    let pointerStartX = 0;
    let scrollStartLeft = 0;
    let isDragging = false;
    let suppressNextClick = false;
    const dragThreshold = 6;

    scroller.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      pointerId = event.pointerId;
      pointerStartX = event.clientX;
      scrollStartLeft = scroller.scrollLeft;
      isDragging = false;
    });

    scroller.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;

      const distance = event.clientX - pointerStartX;
      if (!isDragging && Math.abs(distance) < dragThreshold) return;

      if (!isDragging) {
        isDragging = true;
        suppressNextClick = true;
        scroller.classList.add("is-dragging");
        scroller.setPointerCapture(pointerId);
      }

      scroller.scrollLeft = scrollStartLeft - distance;
    });

    const stopDragging = (event) => {
      if (event.pointerId !== pointerId) return;

      if (scroller.hasPointerCapture(pointerId)) scroller.releasePointerCapture(pointerId);
      scroller.classList.remove("is-dragging");
      pointerId = null;
      isDragging = false;

      if (event.type === "pointercancel") {
        suppressNextClick = false;
      } else if (suppressNextClick) {
        window.setTimeout(() => {
          suppressNextClick = false;
        }, 0);
      }
    };

    scroller.addEventListener("pointerup", stopDragging);
    scroller.addEventListener("pointercancel", stopDragging);
    scroller.addEventListener("click", (event) => {
      if (!suppressNextClick) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      suppressNextClick = false;
    }, true);
  }

  function renderAllMenuCategories() {
    selectors.menuPanel.innerHTML = "";
    selectors.menuPanel.className = "menu-panel";
    selectors.menuPanel.removeAttribute("role");
    selectors.menuPanel.removeAttribute("aria-labelledby");

    state.menuCategories.forEach((group, index) => {
      selectors.menuPanel.appendChild(createMenuCategoryGroup(group, index));
    });

    if (state.bestSellerItems.length) {
      selectors.menuPanel.appendChild(createBestSellersGroup(state.bestSellerItems));
    }
  }

  function createMenuCategoryGroup(group, index) {
    const section = document.createElement("section");
    section.className = `menu-category-group is-${group.id}`;
    section.id = group.id;
    section.dataset.menuCategory = group.id;

    const heading = document.createElement("header");
    heading.className = "menu-group-heading";

    const eyebrow = document.createElement("p");
    eyebrow.className = "cero-eyebrow";
    eyebrow.textContent = `Carta ${String(index + 1).padStart(2, "0")}`;

    const title = document.createElement("h3");
    title.textContent = group.name;
    heading.append(eyebrow, title);
    section.appendChild(heading);

    if (group.note) {
      const groupNote = document.createElement("p");
      groupNote.className = "menu-group-note";
      groupNote.textContent = group.note;
      section.appendChild(groupNote);
    }

    const repeatsGroupName = group.categories.length === 1
      && normalizeKey(group.categories[0].name) === normalizeKey(group.name);
    group.categories.forEach((category) => {
      section.appendChild(createMenuSubcategory(category, group.id, !repeatsGroupName));
    });

    return section;
  }

  function createBestSellersGroup(items) {
    const section = document.createElement("section");
    section.className = "menu-category-group menu-bestsellers";
    section.id = "mas-vendidos";
    section.dataset.menuCategory = "mas-vendidos";

    const heading = document.createElement("header");
    heading.className = "menu-group-heading";

    const eyebrow = document.createElement("p");
    eyebrow.className = "cero-eyebrow";
    eyebrow.textContent = "Selección de Cero";

    const title = document.createElement("h3");
    title.textContent = "Más vendidos";
    heading.append(eyebrow, title);
    section.append(heading, createMenuProductGrid(items, { id: "mas-vendidos" }, "mas-vendidos"));
    return section;
  }

  function createMenuSubcategory(category, groupId, showHeading = true) {
    const section = document.createElement("section");
    section.className = "menu-subcategory";
    section.classList.add(`is-${category.id}`);

    if (showHeading || category.note) {
      const heading = document.createElement("div");
      heading.className = "menu-subcategory-heading";

      if (showHeading) {
        const title = document.createElement("h4");
        title.textContent = getCategoryDisplayName(category, groupId);
        heading.appendChild(title);
      }

      if (category.note) {
        const note = document.createElement("p");
        note.textContent = category.note;
        heading.appendChild(note);
      }

      section.appendChild(heading);
    }

    section.appendChild(createMenuProductGrid(category.items, category, groupId));
    return section;
  }

  function initMenuScrollSpy() {
    if (typeof state.menuScrollCleanup === "function") state.menuScrollCleanup();

    const sections = Array.from(selectors.menuPanel.querySelectorAll("[data-menu-category]"));
    if (!sections.length) return;

    let frameId = 0;
    const updateActiveCategory = () => {
      frameId = 0;
      const offset = getMenuScrollOffset();

      if (state.programmaticMenuTarget) {
        const lockedTarget = document.getElementById(state.programmaticMenuTarget);
        if (lockedTarget && Math.abs(lockedTarget.getBoundingClientRect().top - offset) <= 4) {
          clearProgrammaticMenuTarget();
        } else {
          return;
        }
      }

      let activeSection = sections[0];
      const marker = offset + 24;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) activeSection = section;
      });
      setActiveMenuCategory(activeSection.dataset.menuCategory);
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveCategory);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    state.menuScrollCleanup = () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
    requestUpdate();
  }

  function navigateToMenuCategory(id, { updateHistory = false, behavior } = {}) {
    const target = document.getElementById(id);
    if (!target) return;

    state.programmaticMenuTarget = id;
    setActiveMenuCategory(id);
    window.clearTimeout(state.menuScrollUnlockTimer);
    state.menuScrollUnlockTimer = window.setTimeout(clearProgrammaticMenuTarget, 1800);

    if (updateHistory && window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }

    const scrollBehavior = behavior || (prefersReducedMotion() ? "auto" : "smooth");
    const top = window.scrollY + target.getBoundingClientRect().top - getMenuScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior });
  }

  function restoreHashPosition() {
    const id = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    if (target.matches("[data-menu-category]")) {
      window.requestAnimationFrame(() => navigateToMenuCategory(id, { behavior: "instant" }));
      return;
    }

    window.requestAnimationFrame(() => {
      const headerHeight = selectors.header?.getBoundingClientRect().height || 0;
      const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    });
  }

  function clearProgrammaticMenuTarget() {
    window.clearTimeout(state.menuScrollUnlockTimer);
    state.programmaticMenuTarget = "";
    state.menuScrollUnlockTimer = null;
  }

  function setActiveMenuCategory(id) {
    if (!id || state.activeMenuId === id) return;
    state.activeMenuId = id;

    selectors.menuTabsTrack.querySelectorAll("[data-menu-link]").forEach((link) => {
      const isActive = link.dataset.menuLink === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
        scrollMenuLinkIntoView(link);
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getMenuScrollOffset() {
    const headerHeight = selectors.header?.getBoundingClientRect().height || 0;
    const menuNavigation = selectors.menuTabs?.closest(".menu-tabs");
    const navigationHeight = menuNavigation?.getBoundingClientRect().height || 0;
    return headerHeight + navigationHeight + 16;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function createMenuProductGrid(items, category, groupId) {
    const grid = document.createElement("div");
    grid.className = "menu-card-grid";

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "menu-product-card";
      if (item.isComposite) article.classList.add("is-composite");
      if (item.imageTreatment) article.classList.add(`image-${slugify(item.imageTreatment)}`);
      if (item.photoStatus) article.dataset.photoStatus = item.photoStatus;

      const imageWrap = document.createElement("figure");
      imageWrap.className = "menu-product-media";

      const imageSource = getMenuItemImage(item);
      if (imageSource) {
        const imageButton = document.createElement("button");
        imageButton.className = "menu-product-image-button";
        imageButton.type = "button";
        imageButton.dataset.menuImageOpen = "";
        imageButton.dataset.productName = item.name;
        imageButton.dataset.fullImage = item.originalImage || imageSource;
        imageButton.setAttribute("aria-label", `Ver foto completa de ${item.name}`);

        const image = document.createElement("img");
        image.src = imageSource;
        image.alt = `Foto de ${item.name}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 1200;
        image.height = 900;
        if (item.imagePosition) image.style.objectPosition = item.imagePosition;
        image.addEventListener("error", () => {
          article.classList.add("has-missing-image");
          imageButton.replaceChildren(createMenuPlaceholder());
          imageButton.disabled = true;
          imageButton.removeAttribute("data-menu-image-open");
          imageButton.removeAttribute("aria-label");
        }, { once: true });

        imageButton.appendChild(image);
        imageWrap.appendChild(imageButton);
      } else {
        article.classList.add("has-missing-image");
        imageWrap.appendChild(createMenuPlaceholder());
      }
      article.appendChild(imageWrap);

      const body = document.createElement("div");
      body.className = "menu-product-body";

      const header = document.createElement("div");
      header.className = "menu-product-header";

      const itemTitle = document.createElement("h4");
      itemTitle.textContent = item.name;
      header.appendChild(itemTitle);

      if (item.price) {
        const price = document.createElement("span");
        price.className = "menu-price";
        price.textContent = item.price;
        header.appendChild(price);
      }

      body.appendChild(header);

      if (item.description) {
        const description = document.createElement("p");
        description.className = "menu-product-description";
        description.textContent = item.description;
        body.appendChild(description);
      }

      const badge = getMenuItemBadge(item);
      if (badge) {
        const badgeElement = document.createElement("span");
        badgeElement.className = "menu-product-badge";
        badgeElement.textContent = badge;
        body.appendChild(badgeElement);
      }

      article.appendChild(body);
      grid.appendChild(article);
    });

    return grid;
  }

  function createMenuPlaceholder() {
    const placeholder = document.createElement("span");
    placeholder.className = "menu-product-placeholder";
    placeholder.setAttribute("aria-hidden", "true");

    const logo = document.createElement("img");
    logo.src = menuPlaceholderLogo;
    logo.alt = "";
    logo.width = 160;
    logo.height = 160;
    placeholder.appendChild(logo);
    return placeholder;
  }

  function getMenuItemImage(item) {
    if (!item.image) return "";
    return encodeURI(item.image);
  }

  function getMenuItemBadge(item) {
    if (item.badge) return item.badge;
    const text = normalizeKey(`${item.name} ${item.description}`);
    if (text.includes("vegano")) return "Opcional vegano";
    if (text.includes("sin tacc")) return "Sin TACC";
    if (text.includes("vegetariano")) return "Vegetariano";
    return "";
  }

  function getCategoryDisplayName(category, groupId) {
    return category.name;
  }

  function setMenuMessage(message) {
    if (selectors.menuStatus) selectors.menuStatus.textContent = message;
  }

  function normalizeTextList(value) {
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            const days = cleanText(item.dias || item.days || "");
            const time = cleanText(item.horario || item.hours || item.time || "");
            return formatHoursLine(days, time);
          }
          return cleanText(item);
        })
        .filter(Boolean);
    }
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).map(([day, time]) => `${cleanText(day)}: ${cleanText(time)}`);
    }
    return cleanText(value).split(/\n|;/).map((line) => line.trim()).filter(Boolean);
  }

  function cleanText(value) {
    const replacements = {
      "Ã¡": "á",
      "Ã©": "é",
      "Ã­": "í",
      "Ã³": "ó",
      "Ãº": "ú",
      "Ã±": "ñ",
      "Ã": "Á",
      "Ã‰": "É",
      "Ã": "Í",
      "Ã“": "Ó",
      "Ãš": "Ú",
      "Ã‘": "Ñ",
      "Â·": "·",
      "Â°": "°",
      "Â": "",
    };

    return String(value).replace(/Ã¡|Ã©|Ã­|Ã³|Ãº|Ã±|Ã|Ã‰|Ã|Ã“|Ãš|Ã‘|Â·|Â°|Â/g, (match) => replacements[match] || match);
  }

  function formatPrice(value) {
    if (value === undefined || value === null || value === "") return "";
    const text = cleanText(value).trim();
    if (!text || text.includes("$") || /consultar/i.test(text)) return text;
    return `$${text}`;
  }

  function normalizeAddress(value) {
    return cleanText(value).replace(/,\s*Buenos Aires$/i, "").trim();
  }

  function formatHoursLine(days, time) {
    const cleanDays = cleanText(days);
    const cleanTime = cleanText(time);
    const normalizedDays = normalizeKey(cleanDays);

    if (normalizedDays === "lunes a viernes") return `Lun a Vie ${cleanTime}`;
    if (normalizedDays === "sabados y domingos") return `Sáb y Dom ${cleanTime}`;

    return [cleanDays, cleanTime].filter(Boolean).join(" ");
  }

  function buildWhatsappUrl(value) {
    const digits = String(value).replace(/\D/g, "");
    if (!digits) return "";
    return `https://wa.me/${digits}`;
  }

  function slugify(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function normalizeKey(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
})();
