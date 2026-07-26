(function () {
  const state = {
    menuCategories: [],
    activeCategoryIndex: null,
    revealObserver: null,
    featuredCarouselCleanup: null,
  };

  const menuPlaceholderLogo = "assets/logos/Sublogo vertical_negro.svg";

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

  function initFeaturedMenuCarousel(items) {
    const slider = document.querySelector("[data-featured-slider]");
    const dotsContainer = document.querySelector("[data-featured-dots]");
    const previousButton = document.querySelector("[data-featured-prev]");
    const nextButton = document.querySelector("[data-featured-next]");
    if (!slider || !dotsContainer || !previousButton || !nextButton || !Array.isArray(items) || !items.length) return;

    state.featuredCarouselCleanup?.();

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";
    slider.tabIndex = 0;
    slider.role = "region";
    slider.setAttribute("aria-label", "Carrusel Más vendidos");

    const eventController = new AbortController();
    const { signal } = eventController;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let autoplayTimer = null;
    let isHovered = false;
    let isTouching = false;

    const slides = items.map((item, index) => {
      const slide = document.createElement("div");
      slide.className = "menu-featured-slide";
      slide.classList.toggle("is-active", index === 0);
      slide.dataset.featuredSlide = "";
      slide.setAttribute("aria-hidden", String(index !== 0));

      const image = document.createElement("img");
      const imageSource = getMenuItemImage(item);
      if (index === 0) {
        image.src = imageSource;
      } else {
        image.dataset.src = imageSource;
      }
      image.alt = `Fotografía del producto destacado ${index + 1}`;
      image.width = 1200;
      image.height = 900;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.dataset.featuredImage = String(index + 1);

      slide.appendChild(image);
      slider.appendChild(slide);
      return slide;
    });

    const stopAutoplay = () => {
      if (autoplayTimer === null) return;
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    };

    const canAutoplay = () => (
      !reducedMotion.matches
      && !document.hidden
      && !isHovered
      && !isTouching
    );

    const scheduleAutoplay = () => {
      stopAutoplay();
      if (!canAutoplay()) return;

      autoplayTimer = window.setTimeout(() => {
        showSlide(activeIndex + 1);
        scheduleAutoplay();
      }, 4000);
    };

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.className = "menu-featured-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar imagen ${index + 1} de ${slides.length}`);
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", String(index === activeIndex));
      dot.addEventListener("click", () => {
        showSlide(index);
        scheduleAutoplay();
      }, { signal });
      dotsContainer.appendChild(dot);
      return dot;
    });

    const showSlide = (nextIndex) => {
      activeIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
      const activeImage = slides[activeIndex].querySelector("img[data-src]");
      if (activeImage) {
        activeImage.src = activeImage.dataset.src;
        activeImage.removeAttribute("data-src");
      }
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
        slide.setAttribute("aria-hidden", String(index !== activeIndex));
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
        dot.setAttribute("aria-current", String(index === activeIndex));
      });
    };

    previousButton.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      scheduleAutoplay();
    }, { signal });
    nextButton.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      scheduleAutoplay();
    }, { signal });
    slider.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      showSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }, { signal });

    const carousel = slider.closest(".menu-featured-card");
    carousel?.addEventListener("mouseenter", () => {
      isHovered = true;
      stopAutoplay();
    }, { signal });
    carousel?.addEventListener("mouseleave", () => {
      isHovered = false;
      scheduleAutoplay();
    }, { signal });
    carousel?.addEventListener("keydown", () => {
      stopAutoplay();
      scheduleAutoplay();
    }, { signal });
    carousel?.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      isTouching = true;
      stopAutoplay();
    }, { signal, passive: true });

    const finishTouchInteraction = (event) => {
      if (event.pointerType !== "touch") return;
      isTouching = false;
      scheduleAutoplay();
    };
    carousel?.addEventListener("pointerup", finishTouchInteraction, { signal, passive: true });
    carousel?.addEventListener("pointercancel", finishTouchInteraction, { signal, passive: true });

    document.addEventListener("visibilitychange", scheduleAutoplay, { signal });
    reducedMotion.addEventListener("change", scheduleAutoplay, { signal });

    state.featuredCarouselCleanup = () => {
      stopAutoplay();
      eventController.abort();
    };

    scheduleAutoplay();
  }

  function initMenuImageLightbox() {
    if (!selectors.menuPanel) return;

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
      lightboxImage.src = image.currentSrc || image.src;
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

    selectors.menuPanel.addEventListener("click", (event) => {
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
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

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
      media.dataset.touchHint = showLabel ? "Tocá para ver packaging" : "Tocá para ver etiqueta";
      media.classList.toggle("is-showing-label", showLabel);
    };

    coffeeCards.forEach((card) => {
      const media = card.querySelector("[data-coffee-media]");
      if (!media) return;

      media.addEventListener("click", (event) => {
        const isKeyboardActivation = event.detail === 0;
        if (hoverMedia.matches && !isKeyboardActivation) return;

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
      ".menu-featured-card",
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
      state.menuCategories = normalizeMenu(bundledData);
      renderMenu();
      initFeaturedMenuCarousel(getFeaturedMenuItems());
      return;
    }

    try {
      const data = await fetchJson("./data/contenido.json");

      applySiteContent(data);
      state.menuCategories = normalizeMenu(data);
      renderMenu();
      initFeaturedMenuCarousel(getFeaturedMenuItems());
    } catch (error) {
      console.error("No se pudo cargar el contenido del sitio.", error);
      const fallbackData = window.CERO_CONTENIDO || {};
      applySiteContent(fallbackData);
      state.menuCategories = normalizeMenu(fallbackData);
      renderMenu();
      initFeaturedMenuCarousel(getFeaturedMenuItems());
    }
  }

  function getFeaturedMenuItems() {
    const featuredGroup = state.menuCategories.find((group) => group.id === "destacados");
    return featuredGroup?.categories.flatMap((category) => category.items) || [];
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

  function normalizeMenu(data) {
    const categories = data?.menu?.categorias;
    if (!Array.isArray(categories)) return [];

    const normalizedCategories = categories
      .map(normalizeCategory)
      .filter((category) => category.name && category.items.length);

    const featuredCategory = createFeaturedCategory(data?.menu?.destacados, normalizedCategories);
    if (featuredCategory) normalizedCategories.push(featuredCategory);

    return groupMenuCategories(normalizedCategories);
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
      badge: cleanText(item?.etiqueta || ""),
      photoStatus: cleanText(item?.estado_foto || ""),
      imageTreatment: cleanText(item?.ajuste_imagen || ""),
    };
  }

  function createFeaturedCategory(featuredItems, categories) {
    if (!Array.isArray(featuredItems) || !featuredItems.length) return null;

    const menuItems = categories.flatMap((category) => category.items);
    const findItem = (name) => menuItems.find((item) => normalizeKey(item.name) === normalizeKey(name));
    const items = featuredItems.map((featured) => {
      if (featured?.productos) {
        const referencedItems = featured.productos.map(findItem).filter(Boolean);
        if (!referencedItems.length) return null;

        return {
          ...referencedItems[0],
          isComposite: true,
          name: cleanText(featured.nombre || referencedItems.map((item) => item.name).join(" / ")),
          description: cleanText(featured.descripcion || referencedItems.map((item) => item.description).filter(Boolean).join(" / ")),
          price: referencedItems.map((item) => `${item.name.replace(/\s*\([^)]*\)$/, "").replace("Té en hebras", "Té")} ${item.price}`).join(" / "),
          image: cleanText(featured.imagen || referencedItems[0].image),
          badge: "",
        };
      }

      const item = findItem(featured?.producto);
      return item ? { ...item, name: cleanText(featured.nombre || item.name) } : null;
    }).filter(Boolean);

    return items.length ? { id: "destacados", name: "Destacados", note: "", groupNote: "", items } : null;
  }

  function groupMenuCategories(categories) {
    const groups = [
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
        id: "mostrador",
        name: "Mostrador",
        categoryNames: ["Pastries", "Cakes"],
      },
      {
        id: "destacados",
        name: "Destacados",
        categoryNames: ["Destacados"],
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

    if (state.activeCategoryIndex === null || state.activeCategoryIndex >= state.menuCategories.length) {
      state.activeCategoryIndex = 0;
    }

    setMenuMessage("");
    renderTabs();
    renderActiveCategory();
    enhanceMotion(document);
  }

  function renderTabs() {
    selectors.menuTabsTrack.innerHTML = "";

    state.menuCategories.forEach((group, index) => {
      const button = document.createElement("button");
      button.className = "menu-tab";
      button.type = "button";
      button.role = "tab";
      button.id = `menu-tab-${group.id || index}`;
      button.setAttribute("aria-controls", "menu-panel");
      button.setAttribute("aria-selected", String(index === state.activeCategoryIndex));
      button.textContent = group.name;
      button.addEventListener("click", () => {
        state.activeCategoryIndex = index;
        renderTabs();
        renderActiveCategory();

        const activeTab = selectors.menuTabs.querySelector('[aria-selected="true"]');
        requestAnimationFrame(() => scrollMenuTabIntoView(activeTab));
      });
      selectors.menuTabsTrack.appendChild(button);
    });
  }

  function scrollMenuTabIntoView(tab) {
    if (!tab) return;

    tab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
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

    scroller.addEventListener("wheel", (event) => {
      if (scroller.scrollWidth <= scroller.clientWidth || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const deltaMultiplier = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? scroller.clientWidth
          : 1;
      const horizontalDelta = event.deltaY * deltaMultiplier;
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      const canScroll = horizontalDelta < 0
        ? scroller.scrollLeft > 0
        : scroller.scrollLeft < maxScrollLeft;

      if (!canScroll) return;

      event.preventDefault();
      scroller.scrollLeft += horizontalDelta;
    }, { passive: false });

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

  function renderActiveCategory() {
    selectors.menuPanel.innerHTML = "";
    selectors.menuPanel.className = "menu-panel";
    selectors.menuPanel.id = "menu-panel";
    selectors.menuPanel.role = "tabpanel";

    if (state.activeCategoryIndex === null) {
      selectors.menuPanel.removeAttribute("aria-labelledby");
      return;
    }

    const group = state.menuCategories[state.activeCategoryIndex];
    selectors.menuPanel.classList.add(`is-${group.id}`);
    selectors.menuPanel.setAttribute("aria-labelledby", `menu-tab-${group.id || state.activeCategoryIndex}`);

    if (group.note) {
      const groupNote = document.createElement("p");
      groupNote.className = "menu-group-note";
      groupNote.textContent = group.note;
      selectors.menuPanel.appendChild(groupNote);
    }

    group.categories.forEach((category) => {
      const section = createMenuSubcategory(category, group.id);
      selectors.menuPanel.appendChild(section);
    });

    enhanceMotion(selectors.menuPanel);
  }

  function createMenuSubcategory(category, groupId) {
    const section = document.createElement("section");
    section.className = "menu-subcategory";
    section.classList.add(`is-${category.id}`);

    const heading = document.createElement("div");
    heading.className = "menu-subcategory-heading";

    const title = document.createElement("h3");
    title.textContent = getCategoryDisplayName(category, groupId);
    heading.appendChild(title);

    if (category.note) {
      const note = document.createElement("p");
      note.textContent = category.note;
      heading.appendChild(note);
    }

    section.appendChild(heading);

    section.appendChild(createMenuProductGrid(category.items, category, groupId));
    return section;
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
        imageButton.setAttribute("aria-label", `Ver foto completa de ${item.name}`);

        const image = document.createElement("img");
        image.src = imageSource;
        image.alt = `Foto de ${item.name}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 1200;
        image.height = 900;
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
