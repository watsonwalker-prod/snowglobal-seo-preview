(() => {
  const art = (el) =>
    !!(el && el.closest && el.closest("img, video, canvas, .hero-media, .piece-media, .pdp-stage, .pdp-thumb, .breakout"));

  document.addEventListener(
    "contextmenu",
    (e) => {
      if (art(e.target)) e.preventDefault();
    },
    true
  );

  document.addEventListener(
    "dragstart",
    (e) => {
      if (art(e.target)) e.preventDefault();
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    // Autofill / IME keydown events can arrive without a key string.
    const k = typeof e.key === "string" ? e.key.toLowerCase() : "";
    if ((e.metaKey || e.ctrlKey) && k === "s") e.preventDefault();
  });

  // Standing rule: every <video> autoplays muted loop, no controls / play button.
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const armed = typeof WeakSet === "function" ? new WeakSet() : null;

  const startVideo = (v) => {
    if (!(v instanceof HTMLVideoElement)) return;
    if (v.hidden || (v.closest && v.closest("[hidden]"))) return;
    if (reduceMotion()) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  let io = null;
  if (typeof IntersectionObserver === "function") {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) startVideo(e.target);
        }
      },
      { threshold: 0.2, rootMargin: "8% 0px" }
    );
  }

  const armVideo = (v) => {
    if (!(v instanceof HTMLVideoElement)) return;
    v.controls = false;
    v.removeAttribute("controls");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    ["muted", "loop", "autoplay", "playsinline", "webkit-playsinline", "disablepictureinpicture"].forEach((a) => {
      v.setAttribute(a, "");
    });
    v.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback noplaybackrate");
    if (reduceMotion()) {
      v.removeAttribute("autoplay");
      try { v.pause(); } catch (_) {}
      return;
    }
    if (armed && armed.has(v)) {
      startVideo(v);
      return;
    }
    if (armed) armed.add(v);
    startVideo(v);
    v.addEventListener("canplay", () => startVideo(v));
    v.addEventListener("loadeddata", () => startVideo(v));
    v.addEventListener("pause", () => {
      if (document.hidden) return;
      startVideo(v);
    });
    if (io) {
      try { io.observe(v); } catch (_) {}
    }
  };

  const armAll = () => document.querySelectorAll("video").forEach(armVideo);
  armAll();
  if (typeof MutationObserver === "function") {
    new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (!n || n.nodeType !== 1) return;
          if (n.matches && n.matches("video")) armVideo(n);
          if (n.querySelectorAll) n.querySelectorAll("video").forEach(armVideo);
        });
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) armAll();
  });
  // First user gesture unlocks autoplay on strict browsers (Safari / low-power).
  // Include wheel/scroll — homepage breakouts sit below the fold.
  const gestureArm = () => armAll();
  ["touchstart", "click", "keydown", "wheel", "scroll"].forEach((ev) => {
    document.addEventListener(ev, gestureArm, { once: true, passive: true, capture: true });
  });
})();
