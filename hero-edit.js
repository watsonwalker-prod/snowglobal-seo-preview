(() => {
  const defaults = { z: 1, x: 0, y: 0 };
  const wraps = document.querySelectorAll(".hero-media, .breakout-media");
  if (!wraps.length) return;

  const params = new URLSearchParams(location.search);
  const wantEdit = params.has("edit") || localStorage.getItem("fraimous-edit") === "1";

  const load = (key) => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; }
    catch { return { ...defaults }; }
  };

  const bind = (wrap, i) => {
    const media = wrap.querySelector("video, img");
    if (!media) return;
    const section = wrap.closest("section");
    const id = (section && section.getAttribute("aria-label")) || wrap.getAttribute("href") || "hero-" + i;
    const key = "fraimous-hero:" + id.toLowerCase().replace(/\s+/g, "-");
    let state = load(key);
    const apply = (s) => {
      media.style.transformOrigin = "center center";
      media.style.transform = "translate(" + s.x + "px," + s.y + "px) scale(" + s.z + ")";
    };
    apply(state);
    if (!wantEdit) return;

    wrap.classList.add("is-editing");
    media.style.cursor = "grab";
    media.style.willChange = "transform";

    let drag = null;
    wrap.addEventListener("click", (e) => e.preventDefault());
    media.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      drag = { x: e.clientX, y: e.clientY, sx: state.x, sy: state.y };
      media.setPointerCapture(e.pointerId);
      media.style.cursor = "grabbing";
    });
    media.addEventListener("pointermove", (e) => {
      if (!drag) return;
      state.x = drag.sx + (e.clientX - drag.x);
      state.y = drag.sy + (e.clientY - drag.y);
      apply(state);
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      media.style.cursor = "grab";
      localStorage.setItem(key, JSON.stringify(state));
    };
    media.addEventListener("pointerup", end);
    media.addEventListener("pointercancel", end);

    wrap.addEventListener("wheel", (e) => {
      e.preventDefault();
      state.z = Math.min(3, Math.max(0.4, +(state.z + (e.deltaY > 0 ? -0.06 : 0.06)).toFixed(3)));
      apply(state);
      localStorage.setItem(key, JSON.stringify(state));
      const z = bar.querySelector("[data-zoom-read]");
      if (z) z.textContent = Math.round(state.z * 100) + "%";
    }, { passive: false });

    const bar = document.createElement("div");
    bar.className = "hero-edit";
    bar.innerHTML =
      "<span>" + id + " · drag · scroll · <b data-zoom-read>" + Math.round(state.z * 100) + "%</b></span>" +
      '<button type="button" data-reset>Reset</button>' +
      '<button type="button" data-done>Done</button>';
    section.appendChild(bar);
    bar.querySelector("[data-reset]").addEventListener("click", () => {
      state = { ...defaults };
      apply(state);
      localStorage.setItem(key, JSON.stringify(state));
      bar.querySelector("[data-zoom-read]").textContent = "100%";
    });
    bar.querySelector("[data-done]").addEventListener("click", () => {
      localStorage.removeItem("fraimous-edit");
      location.href = location.pathname + (location.hash || "");
    });
  };

  if (wantEdit) localStorage.setItem("fraimous-edit", "1");
  wraps.forEach(bind);
})();
