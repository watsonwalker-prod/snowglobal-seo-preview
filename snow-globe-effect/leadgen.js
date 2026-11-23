// Lead-gen popover, repurposed from the members join.js layer. Posts {kind:'join'} to /api/inquire; code shows only on ok:true.
(() => {
  const CODE = "5N0W84LL3FFCT", KEY = "fraimous-holiday-lg";
  const RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const html = `
<div class="lg-layer" id="lg-layer" hidden>
  <div class="lg-scrim" data-lg-close></div>
  <div class="lg-card" role="dialog" aria-modal="true" aria-labelledby="lg-title">
    <button class="lg-close" type="button" data-lg-close>Close</button>
    <figure class="lg-art"><a href="/works/the-set" data-lg-set aria-label="See The Set" style="display:block;height:100%"><img src="/snow-globe-effect/images/lg-pair-SGE-greenlodge-960.jpg?v=sge11" width="960" height="1200" alt="The Point and The Embrace as a pair over a fireplace in a green lodge" /></a></figure>
    <div class="lg-copy" id="lg-copy">
      <p class="eyebrow tag mono" data-font="mono">Snow Globe Effect</p>
      <h2 class="lg-title" id="lg-title">An Old-World Winter&nbsp;Offer</h2>
      <p class="lg-lede">The Point and The Embrace together, 46% off. Edition of 25. The Set&nbsp;only.</p>
      <form id="lg-form" novalidate>
        <label class="sr-only" for="lg-email">Email</label>
        <div class="lg-row"><input id="lg-email" type="email" required placeholder="Email" autocomplete="email" /><button type="submit">Reveal My&nbsp;Code</button></div>
      </form>
      <p class="lg-fine">One email with your code. Unsubscribe&nbsp;anytime.</p>
    </div>
  </div>
</div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  const layer = document.getElementById("lg-layer");
  window.HX_SET_URL = window.HX_SET_URL || "/works/the-set";
  const JOIN_SEEN = "fraimous-join-seen";
  const open = () => { layer.hidden = false; };
  const close = () => { if (layer.hidden) return; layer.hidden = true; try { if (localStorage.getItem(KEY) !== "1") localStorage.setItem(KEY, "dismissed"); sessionStorage.setItem(KEY, "seen"); sessionStorage.setItem(JOIN_SEEN, "1"); } catch {} };
  layer.querySelectorAll("[data-lg-close]").forEach(b => b.addEventListener("click", close));
  const setLink = layer.querySelector("[data-lg-set]"); if (setLink) setLink.addEventListener("click", () => close());
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  document.querySelectorAll("[data-lg-open]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(); }));
  document.getElementById("lg-form").addEventListener("submit", e => {
    e.preventDefault();
    const v = document.getElementById("lg-email").value.trim();
    if (!RE.test(v)) { document.getElementById("lg-email").focus(); return; }
    const btn = e.target.querySelector("button[type=submit]"); btn.disabled = true;
    fetch("/api/inquire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "join", email: v, source: "snow-globe-effect" }) })
      .then(r => r.json().catch(() => ({}))).then(d => {
        if (!d || d.ok !== true) throw new Error("not ok");
        try { localStorage.setItem(KEY, "1"); } catch {}
        document.getElementById("lg-copy").innerHTML = `<div class="lg-done"><p class="eyebrow tag mono" data-font="mono">You're In</p>
      <h2 class="lg-title">Your Code</h2><div class="lg-codebox">${CODE}</div>
      <p class="lg-lede">46% off The Set at checkout. We also sent it to your&nbsp;inbox.</p>
      <a class="hx-buy" href="${window.HX_SET_URL || '#'}">Claim The&nbsp;Set</a></div>`;
      }).catch(() => { btn.disabled = false; let m = document.getElementById("lg-err"); if (!m) { m = document.createElement("p"); m.id = "lg-err"; m.className = "lg-fine"; m.setAttribute("role", "alert"); e.target.after(m); } m.textContent = "Something went wrong. Please try&nbsp;again.".replace("&nbsp;", "\u00a0"); });
  });
  // Stay closed until someone taps "46% Off". The code is already on the page, and an auto popup was covering Buy Now.
})();
