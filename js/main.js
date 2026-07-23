(function () {
  const state = {
    menuCategories: [],
    activeCategoryIndex: null,
    revealObserver: null,
  };

  function menuImage(fileName) {
    return encodeURI(`assets/imagenes/menu-drive/${fileName}`);
  }

  const menuDriveImageByKey = {
    espresso: "Espresso.webp",
    americano: "Americano 2.webp",
    filtrado: "Filtrado cafe de origen.webp",
    cortado: "Cortado 2.webp",
    moccacino: "Moccachino.webp",
    "pistacchio latte": "Pistacchio lattle.webp",
    "te en hebras": "Te negro 2.webp",
    "matcha vainilla latte": "Matcha latte.webp",
    "chocolatada belga": "Chocolatada belga 2.webp",
    "dirty chai latte": "Dirty Chai Latte.webp",
    "iced americano": "Iced Americano.webp",
    "iced latte": "Iced Latte.webp",
    gaseosas: "Gaseosa coca zero.webp",
    "agua de jamaica": "Agua de Jamaica.webp",
    "americano deluxe": "Americano Deluxe.webp",
    "tazon de granola": "Tazon de Granola 2.webp",
    "waffle cero": "Waffle CERO.webp",
    "bagel 3 amores": "Bagel 3 amores.webp",
    "chipa relleno": "Chipa relleno 2.webp",
    "french banana toast": "French Banana Toast 4.webp",
    "ensalada caesar": "Ensalada caesar.webp",
    "kebab de carnes braseadas": "Kebab de carnes.webp",
    "bowl cero": "Bowl CERO 2.webp",
    "wrap de pollo": "Wrap de pollo.webp",
    "focaccia labneh": "Focaccia labneh 8 .webp",
    "medialuna jyq": "Medialuna jyq.webp",
    "sandwich criollo": "Sandwich Criollo.webp",
    "mbeju guarani xl": "Mbeju guarani.webp",
    "arabe jyq": "Arabe jyq 2.webp",
    "scon mas queso": "Scon de queso.webp",
    "bagel de salmon": "Bagel salmon.webp",
    "medialuna de manteca": "Medialuna 2.webp",
    "cookie red velvet": "Cookie red velvet.webp",
    "cookie de vainilla y chips de chocolate semi amargo": "Cookie chips choco.webp",
    croissant: "Croissant.webp",
    "cookie rellena de pistacchio y chocolate blanco": "Cookie de pistacchio.webp",
    "roll de canela": "Roll de Canela.webp",
    "croissant a la reina": "Croissant a la reina 2.webp",
    "cheesecake de frutos rojos": "Torta Cheescake frutos rojos.webp",
    "key lime pie": "Torta Key Lime.webp",
    "pomelada con soda y romero": "Pomelada soda y romero.webp",
    "te verde con cordial de lima batido": "Te verde con cordial de lima 2.webp",
    "coffee collins": "Coffee Collins.webp",
    bumble: "Bumble 2.webp",
    "vermut la fuerza": "Vermut La Fuerza.webp",
    "aperol spritz": "Aperol Spritz 2.webp",
    "amarula iced flat": "Amarula Iced Flat.webp",
    "espresso martini": "Espresso Martini.webp",
  };

  const menuImageByKey = {
    americano: "espresso.webp",
    capuccino: "latte.webp",
    "flat white": "latte.webp",
    "latte piccolo": "latte.webp",
    "cafe con leche": "cafe-con-leche-xl.webp",
    "vainilla latte": "latte.webp",
    "caramel latte": "latte.webp",
    "pistacchio latte": "pistachio-latte-xl.webp",
    "te en hebras": "te.webp",
    "matcha vainilla latte": "chai-latte.webp",
    "dirty chai latte": "chai-latte.webp",
    "cold brew": "iced-americano.webp",
    "agua mineral agua con gas": "agua-mineral.webp",
    "agua de jamaica": "agua-jamaica.webp",
    "jugo de naranja exprimido": "jugo-naranja.webp",
    limonada: "limonada-menta-jengibre.webp",
    "licuado prote": "licuado-proteico.webp",
    "tazon de granola": "tazon-granola.webp",
    "waffle cero": "waffle-cero.webp",
    "french banana toast": "french-banana-toast.webp",
    "ensalada caesar": "avocado-toast.webp",
    "kebab de carnes braseadas": "sandwich-criollo.webp",
    "bowl cero": "tazon-granola.webp",
    "wrap de pollo": "sandwich-criollo.webp",
    "focaccia labneh": "arabe-jyo.webp",
    "tarta de puerros y pollo": "torta-dia.webp",
    "tarta capresse": "torta-dia.webp",
    "mbeju guarani xl": "mbeyu-guarani-xl.webp",
    "arabe jyq": "arabe-jyo.webp",
    "croissant de jamon crudo": "croissant-jamon-crudo.webp",
    "scon mas queso": "scon-queso.webp",
    "bagel de salmon": "bagel-salmon.webp",
    "alfajor de maicena": "alfajores.webp",
    "medialuna de manteca": "medialuna-manteca.webp",
    "cookie de vainilla y chips de chocolate semi amargo": "cookie-vainilla-chips.webp",
    "budin de limon amapolas y arandanos": "budin-limon-amapolas-arandanos.webp",
    "cookie rellena de pistacchio y chocolate blanco": "cookie-pistachio-chocolate-blanco.webp",
    "roll de canela": "roll-canela.webp",
    "croissant a la reina": "croissant-reina.webp",
    "cuadrados de brownie": "cuadrados-brownie.webp",
    "cheesecake de frutos rojos": "cheesecake-frutos-rojos.webp",
    "torta del dia": "torta-dia.webp",
    "budin de banana y nuez": "budin-banana-nuez.webp",
    "pomelada con soda y romero": "pomelada-soda-romero.webp",
    "te verde con cordial de lima batido": "te-verde-cordial-lima.webp",
    "vermut la fuerza": "vermut-la-fuerza.webp",
    "cervezas strange": "vermut-la-fuerza.webp",
  };

  const menuFallbackImageByGroup = {
    cafe: "espresso.webp",
    "bebidas-frias": "iced-latte.webp",
    brunch: "avocado-toast.webp",
    "menu-mediodia": "sandwich-criollo.webp",
    "all-day-food": "sandwich-criollo.webp",
    pasteleria: "croissant.webp",
    "summer-drinks": "pomelada-soda-romero.webp",
  };

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
  };

  initHeader();
  initNavigation();
  initFallbackImages();
  initFallbackVideos();
  initLazyVideos();
  initFeaturedMenuCarousel();
  initMenuImageLightbox();
  initProductFilters();
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

  function initFeaturedMenuCarousel() {
    const slider = document.querySelector("[data-featured-slider]");
    const slides = Array.from(document.querySelectorAll("[data-featured-slide]"));
    const dotsContainer = document.querySelector("[data-featured-dots]");
    if (!slider || slides.length <= 1) return;

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("span");
      dot.className = "menu-featured-dot";
      dot.classList.toggle("is-active", index === activeIndex);
      dotsContainer?.appendChild(dot);
      return dot;
    });

    const showSlide = (nextIndex) => {
      activeIndex = nextIndex % slides.length;
      const activeImage = slides[activeIndex].querySelector("img[data-src]");
      if (activeImage) {
        activeImage.src = activeImage.dataset.src;
        activeImage.removeAttribute("data-src");
      }
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    };

    const startCarousel = () => {
      window.setTimeout(() => {
        showSlide(activeIndex + 1);
        window.setInterval(() => {
          showSlide(activeIndex + 1);
        }, 4000);
      }, 8000);
    };

    if (document.readyState === "complete") {
      startCarousel();
    } else {
      window.addEventListener("load", startCarousel, { once: true });
    }
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
      return;
    }

    try {
      const data = await fetchJson("./data/contenido.json");

      applySiteContent(data);
      state.menuCategories = normalizeMenu(data);
      renderMenu();
    } catch (error) {
      console.error("No se pudo cargar el contenido del sitio.", error);
      const fallbackData = window.CERO_CONTENIDO || {};
      applySiteContent(fallbackData);
      state.menuCategories = normalizeMenu(fallbackData);
      renderMenu();
    }
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
        link.href = whatsappUrl;
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

    return groupMenuCategories(normalizedCategories);
  }

  function normalizeCategory(category) {
    const name = cleanText(category?.nombre || "");
    const id = category?.id ? String(category.id) : slugify(name);
    const note = cleanText(category?.nota || "");
    const items = Array.isArray(category?.items)
      ? category.items.map(normalizeMenuItem).filter((item) => item.name)
      : [];

    return { id, name, note, items };
  }

  function normalizeMenuItem(item) {
    return {
      name: cleanText(item?.nombre || ""),
      description: cleanText(item?.descripcion || ""),
      price: formatPrice(item?.precio),
    };
  }

  function groupMenuCategories(categories) {
    const groups = [
      {
        id: "cafe",
        name: "Café",
        categoryNames: ["Just Coffee", "Coffee with Milk", "Hot Drinks"],
      },
      {
        id: "bebidas-frias",
        name: "Bebidas frías",
        categoryNames: ["Iced Coffee Drinks", "Cold Drinks"],
      },
      {
        id: "brunch",
        name: "Brunch",
        categoryNames: ["Brunch / Combos"],
      },
      {
        id: "menu-mediodia",
        name: "Menú mediodía",
        categoryNames: ["Menú Mediodía"],
      },
      {
        id: "all-day-food",
        name: "All day food",
        categoryNames: ["All Day Food"],
      },
      {
        id: "pasteleria",
        name: "Pastelería",
        categoryNames: ["Pastries"],
      },
      {
        id: "summer-drinks",
        name: "Summer drinks",
        categoryNames: ["Summer Drinks"],
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
          categories: matchedCategories,
        };
      })
      .filter((group) => group.categories.length);

    categories.forEach((category) => {
      if (!usedCategoryIds.has(category.id)) {
        menuGroups.push({
          id: category.id,
          name: category.name,
          categories: [category],
        });
      }
    });

    return menuGroups;
  }

  function renderMenu() {
    if (!selectors.menuTabs || !selectors.menuPanel) return;

    if (!state.menuCategories.length) {
      setMenuMessage("");
      selectors.menuTabs.innerHTML = "";
      selectors.menuPanel.innerHTML = "";
      enhanceMotion(document);
      return;
    }

    if (state.activeCategoryIndex !== null && state.activeCategoryIndex >= state.menuCategories.length) {
      state.activeCategoryIndex = null;
    }

    setMenuMessage("");
    renderTabs();
    renderActiveCategory();
    enhanceMotion(document);
  }

  function renderTabs() {
    selectors.menuTabs.innerHTML = "";

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
        state.activeCategoryIndex = state.activeCategoryIndex === index ? null : index;
        renderTabs();
        renderActiveCategory();
      });
      selectors.menuTabs.appendChild(button);
    });
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

    group.categories.forEach((category) => {
      const section = createMenuSubcategory(category, group.id);
      selectors.menuPanel.appendChild(section);
    });

    enhanceMotion(selectors.menuPanel);
  }

  function createMenuSubcategory(category, groupId) {
    const section = document.createElement("section");
    section.className = "menu-subcategory";

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

      const imageWrap = document.createElement("figure");
      imageWrap.className = "menu-product-media";

      const imageButton = document.createElement("button");
      imageButton.className = "menu-product-image-button";
      imageButton.type = "button";
      imageButton.dataset.menuImageOpen = "";
      imageButton.dataset.productName = item.name;
      imageButton.setAttribute("aria-label", `Ver foto completa de ${item.name}`);

      const image = document.createElement("img");
      image.src = getMenuItemImage(item, category, groupId);
      image.alt = item.name;
      image.loading = "lazy";
      image.decoding = "async";
      image.width = 1200;
      image.height = 900;
      image.addEventListener("error", () => {
        article.classList.add("has-missing-image");
        image.src = `assets/imagenes/menu/${menuFallbackImageByGroup[groupId] || "croissant.webp"}`;
      }, { once: true });

      imageButton.appendChild(image);
      imageWrap.appendChild(imageButton);
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

  function getMenuItemImage(item, category, groupId) {
    const itemKey = normalizeKey(item.name);
    const driveImage = menuDriveImageByKey[itemKey];
    const mappedImage = menuImageByKey[itemKey];
    const slugImage = `${slugify(item.name)}.webp`;
    const fallbackImage = menuFallbackImageByGroup[groupId] || menuFallbackImageByGroup[category.id] || "croissant.webp";

    if (driveImage) return menuImage(driveImage);
    return `assets/imagenes/menu/${mappedImage || slugImage || fallbackImage}`;
  }

  function getMenuItemBadge(item) {
    const text = normalizeKey(`${item.name} ${item.description}`);
    if (text.includes("vegano")) return "Opcional vegano";
    if (text.includes("sin tacc")) return "Sin TACC";
    if (text.includes("vegetariano")) return "Vegetariano";
    return "";
  }

  function getCategoryDisplayName(category, groupId) {
    if (groupId === "pasteleria" && normalizeKey(category.name) === "pastries") {
      return "Pastelería";
    }

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
    return `$ ${text}`;
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
