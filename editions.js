// Limited-edition pills: one fetch of /api/v1/editions per page, shared by every pill.
// Real counts only. If the API fails, pills keep the static "Edition of 25" (no number, never a guess).
// Pills are in the HTML from first paint (<p class="ed-pill" data-edition="slug">), so no layout shift.
(() => {
  const EDITION = 25;
  const ALIAS = { "floral-rifle": "thyrsus", "equus": "horse-floor", "star-port": "orbit-paper" };
  const canon = (s) => { const k = String(s || "").trim().toLowerCase(); return ALIAS[k] || k; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let data = null;
  const ready = fetch("/api/v1/editions", { headers: { Accept: "application/json" }, credentials: "omit" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => { data = d && typeof d === "object" && d.ok !== false ? d : null; return data; })
    .catch(() => null);

  const get = (slug) => {
    const e = data && data[canon(slug)];
    return e && Number.isFinite(e.left) ? e : null;
  };

  const LOW_AT = 10; // warm pill + homepage LOW STOCK flag at 10 left or fewer

  // -> { kind: unknown | ok | low | last | out, text }
  const stateOf = (e) => {
    if (!e) return { kind: "unknown", text: `Edition of ${EDITION}` };
    const ed = Number(e.edition) || EDITION;
    const left = Math.max(0, Math.floor(e.left));
    if (left === 0) return { kind: "out", text: "Sold out" };
    if (left === 1) return { kind: "last", text: "Last one" };
    if (left <= LOW_AT) return { kind: "low", text: `${left} of ${ed} left` };
    return { kind: "ok", text: `Edition of ${ed} · ${left} left` };
  };

  const pillHtml = (st) => `<span class="ed-dot" aria-hidden="true"></span><span class="ed-txt">${esc(st.text)}</span>`;
  const paintPill = (el, st) => {
    el.dataset.state = st.kind;
    const txt = el.querySelector(".ed-txt");
    if (txt) txt.textContent = st.text;
    else el.innerHTML = pillHtml(st);
  };

  // Cards + PDP pills (static markup).
  const paintPills = () => {
    document.querySelectorAll(".ed-pill[data-edition]").forEach((el) => {
      const st = stateOf(get(el.dataset.edition));
      paintPill(el, st);
      const card = el.closest(".piece");
      if (card) {
        card.classList.toggle("piece--soldout", st.kind === "out");
        // Sold-out works stay exactly where they are; only the label changes.
        // Homepage cards: LOW STOCK at <= 10 left (real count only; hidden when sold out or no data).
        const low = st.kind === "low" || st.kind === "last";
        const eyebrow = card.querySelector(".piece-eyebrow");
        const flag = card.querySelector(".ed-flag");
        if (eyebrow) {
          // "For sale" cards already have an IN STOCK label: that label becomes LOW STOCK / SOLD OUT in place.
          if (!eyebrow.dataset.orig) eyebrow.dataset.orig = eyebrow.textContent;
          eyebrow.textContent = st.kind === "out" ? "SOLD OUT" : low ? "LOW STOCK" : eyebrow.dataset.orig;
          eyebrow.classList.toggle("is-low", low);
          if (flag) flag.hidden = true;
        } else if (flag) {
          flag.hidden = !low; // sits beside the pill, same line: no layout shift
        }
      }
    });
  };

  // PDP sold out: Notify (same pattern as /soon) in place of Add to cart.
  const paintPdp = () => {
    const pdp = document.querySelector("[data-pdp][data-slug]");
    const add = document.getElementById("pdp-add");
    if (!pdp || !add) return;
    if (stateOf(get(pdp.dataset.slug)).kind !== "out") return;
    add.hidden = true;
    add.disabled = true;
    if (document.getElementById("notify")) return;
    const slug = canon(pdp.dataset.slug);
    const title = pdp.dataset.title || "";
    add.insertAdjacentHTML("beforebegin",
      `<form class="notify-form notify-form--pdp" id="notify" data-slug="${esc(slug)}" data-title="${esc(title)}">` +
      `<label class="sr-only" for="notify-email">Email</label>` +
      `<input type="email" name="email" id="notify-email" required placeholder="Email" autocomplete="email" />` +
      `<button type="submit" class="btn btn--solid btn--lg" data-font="mono">Notify me when available</button>` +
      `</form><p class="notify-inquire tag mono" data-font="mono"><a id="pdp-inquire" href="/#inquire">Inquire</a></p>`);
    if (!document.querySelector('script[src*="notify.js"]')) {
      const sc = document.createElement("script");
      sc.src = "/notify.js?v=20260818aj";
      document.body.appendChild(sc);
    }
  };

  // Cart: pill per line; sold out / over the limit disables + and Checkout.
  const paintCart = () => {
    const list = document.getElementById("cart-list");
    const C = window.FraimousCart;
    if (!list || !C) return;
    const items = C.read();
    const wanted = {};
    items.forEach((it) => { const k = canon(it.slug); wanted[k] = (wanted[k] || 0) + (Number(it.qty) || 1); });
    let blocked = 0;
    list.querySelectorAll(".cart-line").forEach((li, i) => {
      const it = items[i];
      if (!it) return;
      const meta = li.querySelector(".cart-line-meta");
      let pill = li.querySelector(".ed-pill");
      if (!pill && meta) {
        pill = document.createElement("p");
        pill.className = "ed-pill ed-pill--cart mono";
        const opts = meta.querySelector(".cart-line-opts");
        if (opts) opts.after(pill); else meta.appendChild(pill);
      }
      const e = get(it.slug);
      let st = stateOf(e);
      const k = canon(it.slug);
      const over = e && wanted[k] > e.left;
      if (over && e.left > 0) st = { kind: e.left === 1 ? "last" : "low", text: `Only ${e.left} left` };
      if (pill) paintPill(pill, st);
      li.classList.toggle("cart-line--soldout", !!e && e.left === 0);
      const plus = li.querySelector('.qty-btn[data-delta="1"]');
      if (plus) plus.disabled = !!e && wanted[k] >= e.left;
      if (over) blocked++;
    });
    const go = document.querySelector('.cart-foot a[href="checkout.html"], .cart-foot a[href="/checkout.html"]');
    if (go) {
      go.classList.toggle("is-disabled", blocked > 0);
      if (blocked) go.setAttribute("aria-disabled", "true"); else go.removeAttribute("aria-disabled");
      let note = document.getElementById("ed-cart-note");
      if (blocked && !note) {
        note = document.createElement("p");
        note.id = "ed-cart-note";
        note.className = "chk-err";
        go.before(note);
      }
      if (note) {
        note.hidden = !blocked;
        note.textContent = blocked ? "Some works in your cart are sold out or over what’s left. Remove them or lower the quantity to check out." : "";
      }
    }
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[aria-disabled="true"]');
    if (a) e.preventDefault();
  }, true);

  // Card / breakout "From $X" — public sees bumped floor; logged-in members see original.
  const money = (cents) => {
    const n = Math.round(Number(cents) || 0);
    return (n / 100).toFixed(2);
  };
  // Match cart.js (always 2 decimals) except whole dollars, which stay like the existing "From $250" style.
  const moneyFloor = (cents) => {
    const n = Math.round(Number(cents) || 0);
    if (n % 100 === 0) return String(n / 100);
    return (n / 100).toFixed(2);
  };
  const isMember = () => {
    try {
      if (window.FraimousJoin && typeof window.FraimousJoin.isMember === "function") return !!window.FraimousJoin.isMember();
      return localStorage.getItem("fraimous-join") === "1" && !!localStorage.getItem("fraimous-member-email");
    } catch { return false; }
  };
  const paintPrices = () => {
    if (!data) return;
    const member = isMember();
    document.querySelectorAll(".piece").forEach((card) => {
      const pill = card.querySelector(".ed-pill[data-edition]");
      const slug = (pill && pill.dataset.edition) || card.dataset.slug || card.id || "";
      if (!slug) return;
      const e = get(slug);
      if (!e) return;
      const priceEl = card.querySelector(".piece-price");
      if (!priceEl) return;
      const cents = member
        ? (e.member && e.member.medium) || (e.original && e.original.medium)
        : (e.public && e.public.medium) || (e.original && e.original.medium);
      if (!cents) return;
      const prev = priceEl.textContent || "";
      const saleSuffix = /·\s*46%\s*off/i.test(prev) ? " · 46% off" : "";
      const st = stateOf(e);
      if (slug === "the-set") {
        const saleCents = Math.round(cents * 0.54);
        priceEl.innerHTML = 'From <s class="price-was">$' + money(cents) + '</s><span class="price-now">$' + money(saleCents) + '</span>' + saleSuffix;
      } else {
        const from = moneyFloor(cents);
        // Keep a compact "From $X · Edition of N · N left" line on hubs that have no separate pill.
        if (!pill && /edition of/i.test(prev)) priceEl.textContent = "From $" + from + " · " + st.text;
        else priceEl.textContent = "From $" + from;
      }
    });
    document.querySelectorAll('.mf-card[href*="the-set"] .mf-price').forEach((el) => {
      const e = get("the-set");
      const cents = e && ((member ? (e.member && e.member.medium) : (e.public && e.public.medium)) || (e.original && e.original.medium));
      if (!cents) return;
      const saleCents = Math.round(cents * 0.54);
      el.innerHTML = 'From <s class="price-was">$' + money(cents) + '</s><span class="price-now">$' + money(saleCents) + '</span>';
    });
    document.querySelectorAll(".hero-price").forEach((el) => {
      const wrap = el.closest(".breakout, .hero, section, article") || el.parentElement;
      const pill = wrap && wrap.querySelector(".ed-pill[data-edition]");
      const a = wrap && wrap.querySelector('a[href*="works/"]');
      let slug = (pill && pill.dataset.edition) || "";
      if (!slug && a) {
        const m = String(a.getAttribute("href") || "").match(/works\/([a-z0-9-]+)/i);
        if (m) slug = m[1];
      }
      if (!slug) return;
      const e = get(slug);
      if (!e) return;
      const cents = member
        ? (e.member && e.member.medium) || (e.original && e.original.medium)
        : (e.public && e.public.medium) || (e.original && e.original.medium);
      if (!cents) return;
      el.textContent = "from $" + moneyFloor(cents);
    });
    document.dispatchEvent(new CustomEvent("fraimous:editions", { detail: { member } }));
    // Refresh cart/checkout line money once left counts arrive (public bump / member original).
    const C = window.FraimousCart;
    if (C && typeof C.priceForSize === "function") {
      const items = C.read();
      document.querySelectorAll(".cart-line-price, .sum-price").forEach((el, i) => {
        const it = items[i];
        if (!it) return;
        if (C.linePriceHTML) el.innerHTML = C.linePriceHTML(it);
        else el.textContent = C.money(C.lineTotal(it));
      });
      const totalEl = document.querySelector(".cart-total");
      if (totalEl && items.length) {
        if (C.totalPriceHTML) totalEl.innerHTML = C.totalPriceHTML(items);
        else totalEl.textContent = C.money(C.printTotal(items));
      }
    }
  };

  // When a page has Product JSON-LD, rewrite Offer prices to the live public (or member) ask.
  // Canvas offers are derived from the same bump as cart.js; shipping rates are not touched.
  const offerSizeFinish = (name) => {
    const n = String(name || "");
    const m = n.match(/(\d+\s*[×x]\s*\d+)/i);
    if (!m) return null;
    const size = m[1].replace(/\s+/g, "").replace(/x/i, "×");
    const finish = /canvas/i.test(n) ? "canvas" : "luster";
    return { size, finish };
  };
  const dollarsFromCents = (cents) => (Math.round(Number(cents) || 0) / 100).toFixed(2);
  const liveOfferPrice = (slug, size, finish) => {
    // Always the public ask so a member session never rewrites Product JSON-LD.
    if (window.FraimousCart && typeof window.FraimousCart.priceForSize === "function") {
      const n = window.FraimousCart.priceForSize(size, finish, slug, { pricing: "public" });
      if (Number.isFinite(n)) return n.toFixed(2);
    }
    const e = get(slug);
    if (!e) return null;
    const key = (size === "16×20" || size === "16x20") ? "medium" : (size === "18×24" || size === "18x24") ? "large" : (size === "24×36" || size === "24x36") ? "gallery" : null;
    if (!key) return null;
    const pack = e.public || e.original;
    const cents = pack && pack[key];
    return cents ? dollarsFromCents(cents) : null;
  };
  const walkOffers = (node, slug) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach((x) => walkOffers(x, slug)); return; }
    const types = [].concat(node["@type"] || []);
    if (types.includes("Product") && node.offers) {
      const pslug = slug || (String(node.url || node["@id"] || "").match(/works\/([a-z0-9-]+)/i) || [])[1];
      const offers = Array.isArray(node.offers) ? node.offers : (node.offers.offers || [node.offers]);
      offers.forEach((off) => {
        const sf = offerSizeFinish(off && off.name);
        if (!sf || !pslug) return;
        const price = liveOfferPrice(pslug, sf.size, sf.finish);
        if (price) off.price = price;
      });
    }
    Object.keys(node).forEach((k) => {
      if (k === "@context") return;
      walkOffers(node[k], slug);
    });
  };
  const paintJsonLd = () => {
    if (!data) return;
    document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
      let obj;
      try { obj = JSON.parse(el.textContent); } catch { return; }
      const pdp = document.querySelector("[data-pdp][data-slug]");
      walkOffers(obj, pdp && pdp.dataset.slug);
      el.textContent = JSON.stringify(obj);
    });
  };

  const paintAll = () => { paintPills(); paintPdp(); paintCart(); paintPrices(); paintJsonLd(); };

  // Cart lines are re-rendered on every change: repaint them (childList only, so our own pills don't loop).
  const list = document.getElementById("cart-list");
  if (list && "MutationObserver" in window) new MutationObserver(paintCart).observe(list, { childList: true });
  paintCart(); // placeholder pills right away, before the count arrives
  ready.then(paintAll);
  window.addEventListener("fraimous:member", paintAll);

  window.FraimousEditions = { ready, get, stateOf, paintPrices, isMember };
})();
