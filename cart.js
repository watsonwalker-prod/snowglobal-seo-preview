(() => {
  const KEY = "fraimous-cart";
  const INQUIRY_KEY = "fraimous-inquiry";
  const FRAME_LABEL = { black: "Black", white: "White", oak: "Red Oak", none: "No frame" };
  const FINISH_LABEL = { luster: "Luster", mat: "Mat", canvas: "Canvas" };
  const SIZE_LABEL = {
    "16×20": "Medium 16×20",
    "18×24": "Large 18×24",
    "24×36": "Gallery 24×36",
    "18×12": "Medium 18×12",
    "24×18": "Large 24×18",
    "36×24": "Gallery 36×24",
    "40×55": "Large 40×55",
    "40×60": "Gallery 40×60",
    "55×40": "Large 55×40",
    "60×40": "Gallery 60×40",
  };
  // Canvas Medium is 24×36; framed 24×36 stays Gallery.
  const CANVAS_SIZE_LABEL = {
    "24×36": "Medium 24×36",
    "36×24": "Medium 36×24",
    "40×55": "Large 40×55",
    "55×40": "Large 55×40",
    "40×60": "Gallery 40×60",
    "60×40": "Gallery 60×40",
  };

  // US Standard framed-poster rates after fulfillment (Aug 2026 table).
  // Bands: medium 16×20 / 18×24; large 24×36. First of each band + extras.
  const SHIP = {
    medium: { first: 1399, extra: 495 },
    large: { first: 2999, extra: 1495 },
  };
  const LARGE_SIZES = new Set(["24×36", "36×24", "24x36", "36x24", "40×55", "40×60", "40x55", "40x60", "55×40", "60×40", "55x40", "60x40"]);

  const read = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  };

  const write = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    paintCount();
  };

  const add = ({ slug, title, frame, size, finish = "luster", qty = 1 }) => {
    if (!slug || !title) return;
    const items = read();
    const i = items.findIndex(
      (x) => x.slug === slug && x.frame === frame && x.size === size && (x.finish || "luster") === finish
    );
    if (i >= 0) items[i].qty = (items[i].qty || 1) + (qty || 1);
    else items.push({ slug, title, frame, size, finish, qty: qty || 1 });
    write(items);
  };

  const remove = (index) => {
    const items = read();
    items.splice(index, 1);
    write(items);
  };

  const setQty = (index, qty) => {
    const items = read();
    if (!items[index]) return;
    const n = Math.max(1, parseInt(qty, 10) || 1);
    items[index].qty = n;
    write(items);
  };

  const clear = () => write([]);

  const count = () => read().reduce((n, x) => n + (x.qty || 0), 0);

  const frameLabel = (frame) => FRAME_LABEL[frame] || frame || "Black";
  const sizeLabel = (size, finish) => {
    const key = String(size || "").replace(/[xX]/g, "×");
    const fin = String(finish || "luster").toLowerCase();
    if (fin === "canvas") {
      return CANVAS_SIZE_LABEL[key] || size || "24×36";
    }
    return SIZE_LABEL[key] || SIZE_LABEL[size] || size || "16×20";
  };
  const titleLabel = (item) => {
    if (!item) return "Work";
    if (item.slug === "orbit-paper" || item.slug === "star-port") return "Orbis";
    if (String(item.title || "") === "Sidus") return "Orbis";
    if (item.slug === "thyrsus" || item.slug === "floral-rifle") return "Thyrsus";
    if (String(item.title || "") === "Floral Rifle") return "Thyrsus";
    if (item.slug === "cabin-seven") return "Vesper";
    if (String(item.title || "") === "Cabin Seven") return "Vesper";
    if (item.slug === "ring-seven") return "Cestus";
    if (String(item.title || "") === "Ring Seven") return "Cestus";
    if (item.slug === "desert-seven") return "Harena";
    if (String(item.title || "") === "Desert Seven") return "Harena";
    if (item.slug === "orbital-library") return "Athenaeum";
    if (String(item.title || "") === "Orbital Library") return "Athenaeum";
    if (item.slug === "collar") return "Torquis";
    if (String(item.title || "") === "Collar") return "Torquis";
    if (item.slug === "doll-pilot") return "Pupa";
    if (String(item.title || "") === "Doll Pilot") return "Pupa";
    if (item.slug === "lunar-walk") return "Lunaris";
    if (String(item.title || "") === "Lunar Walk") return "Lunaris";
    if (item.slug === "cubes") return "Tessera";
    if (String(item.title || "") === "Cubes") return "Tessera";
    if (item.slug === "grid-ascent") return "Ascensus";
    if (String(item.title || "") === "Grid Ascent") return "Ascensus";
    if (item.slug === "daisy-iron") return "Bellis";
    if (String(item.title || "") === "Daisy Iron") return "Bellis";
    if (item.slug === "something-to-love") return "Spes";
    if (String(item.title || "") === "Something to Love") return "Spes";
    return item.title || "Work";
  };

  const sizeFile = (size) => String(size || "16×20").replace("×", "x");

  // Bump with pdp.js ASSET_V when cutouts are regenerated (cache bust for cart/checkout/thanks thumbs).
  const CUTOUT_V = "20261005f";
  const cutoutSrc = (slug, frame, prefix = "", size, finish = "luster") => {
    const sf = sizeFile(size);
    const f = finish || "luster";
    if (f === "canvas") return `${prefix}library/mocks/cutouts/${slug}_canvas_${sf}.png?v=${CUTOUT_V}`;
    if (f === "mat") return `${prefix}library/mocks/cutouts/${slug}_mat_${frame || "black"}_${sf}.png?v=${CUTOUT_V}`;
    return `${prefix}library/mocks/cutouts/${slug}_${frame || "black"}_${sf}.png?v=${CUTOUT_V}`;
  };

  const paintCount = () => {
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n ? String(n) : "";
      if (n) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
  };

  const saveInquiry = (inquiry) => {
    sessionStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiry));
  };

  const readInquiry = () => {
    try {
      return JSON.parse(sessionStorage.getItem(INQUIRY_KEY) || "null");
    } catch {
      return null;
    }
  };

  const money = (n) => `$${(Math.round(Number(n) * 100) / 100).toFixed(2)}`;

  const moneyCents = (cents) => money((cents || 0) / 100);

  // Medium $250, then +15% each step. Gallery is 287.50 × 1.15 = 330.625 → $330.63.
  const PRICE_BY_SIZE = {
    "16×20": 250,
    "18×12": 250,
    "18×24": 287.5,
    "24×18": 287.5,
    "24×36": 330.63,
    "36×24": 330.63,
  };

  const normSize = (size) => String(size || "").replace(/[xX]/g, "×");

  const CANVAS_PRICE = { "16×20": 265, "18×12": 265, "18×24": 304.75, "24×18": 304.75, "24×36": 265, "36×24": 265, "40×55": 304.75, "40×60": 350.46, "55×40": 304.75, "60×40": 350.46 };
  // Scala only: 6× the $250-floor tiers (Shea 2026-10-06). Other works keep PRICE_BY_SIZE / CANVAS_PRICE.
  const SCALA_PRICE_BY_SIZE = {
    "16×20": 1500,
    "18×12": 1500,
    "18×24": 1725,
    "24×18": 1725,
    "24×36": 1983.78,
    "36×24": 1983.78,
  };
  const SCALA_CANVAS_PRICE = {
    "16×20": 1590, "18×12": 1590,
    "18×24": 1828.5, "24×18": 1828.5,
    "24×36": 1590, "36×24": 1590,
    "40×55": 1828.5, "55×40": 1828.5,
    "40×60": 2102.76, "60×40": 2102.76,
  };
  const finishLabel = (finish) => FINISH_LABEL[finish] || "Luster";

  // Shea 2026-10-06: public bump = 0.10 * (25 - left) / 24, clamped [0, 0.10]. Members keep original.
  const EDITION_SIZE = 25;
  const publicBump = (left) => {
    const n = Math.max(0, Math.floor(Number(left)));
    if (n <= 0 || n >= EDITION_SIZE) return 0;
    const b = 0.10 * (EDITION_SIZE - n) / (EDITION_SIZE - 1);
    return Math.max(0, Math.min(0.10, b));
  };
  const isMember = () => {
    try {
      if (window.FraimousJoin && typeof window.FraimousJoin.isMember === "function") {
        return !!window.FraimousJoin.isMember();
      }
      return localStorage.getItem("fraimous-join") === "1" && !!localStorage.getItem("fraimous-member-email");
    } catch {
      return false;
    }
  };
  const memberEmail = () => {
    try {
      if (window.FraimousJoin && typeof window.FraimousJoin.email === "function") return window.FraimousJoin.email() || "";
      return localStorage.getItem("fraimous-member-email") || "";
    } catch {
      return "";
    }
  };
  // Original (no bump) dollars — Stripe catalog stays here.
  // The Set (the-set) = 2 prints: list is exactly 2x the single standard price (matches api/checkout.js SGE_MULT).
  // Automatic 46% off for everyone (no code). Charged amount = round(list cents * 0.54), same as the server.
  const SET_MULT = { "the-set": 2 };
  const SET_SALE_OFF = 0.46;
  const isSetSale = (slug) => String(slug || "").toLowerCase() === "the-set";
  const saleOf = (listDollars) => Math.round(Math.round(Number(listDollars) * 100) * (1 - SET_SALE_OFF)) / 100;
  const originalPriceForSize = (size, finish, slug) => {
    const m = SET_MULT[String(slug || "").toLowerCase()];
    if (m) return Math.round(originalPriceForSize(size, finish, "") * m * 100) / 100;
    const key = normSize(size);
    const isScala = String(slug || "").toLowerCase() === "scala";
    if ((finish || "luster") === "canvas") {
      const table = isScala ? SCALA_CANVAS_PRICE : CANVAS_PRICE;
      const n = table[key];
      return n == null ? (isScala ? 1590 : 265) : n;
    }
    const table = isScala ? SCALA_PRICE_BY_SIZE : PRICE_BY_SIZE;
    const n = table[key];
    return n == null ? (isScala ? 1500 : 250) : n;
  };
  // Ask price: public = original * (1+bump); member / member25 callers pass pricing.
  // left from FraimousEditions when available; missing left => treat as 25 (no bump).
  // The Set: sale price (54% of list), no edition bump / member pricing, codes do not stack.
  const priceForSize = (size, finish, slug, opts) => {
    const o = opts || {};
    const orig = originalPriceForSize(size, finish, slug);
    if (isSetSale(slug)) return saleOf(orig);
    const mode = String(o.pricing || (isMember() ? "member" : "public")).toLowerCase();
    if (mode === "member25") return Math.round(orig * 0.75 * 100) / 100;
    if (mode === "member") return orig;
    let left = o.left;
    if (left == null && window.FraimousEditions && typeof window.FraimousEditions.get === "function") {
      const e = window.FraimousEditions.get(slug);
      if (e && Number.isFinite(e.left)) left = e.left;
    }
    if (left == null) left = EDITION_SIZE;
    const bump = publicBump(left);
    return Math.round(orig * (1 + bump) * 100) / 100;
  };

  const lineListTotal = (item, opts) => originalPriceForSize(item && item.size, item && item.finish, item && item.slug) * Math.max(1, parseInt(item && item.qty, 10) || 1);
  const lineTotal = (item, opts) => priceForSize(item && item.size, item && item.finish, item && item.slug, opts) * Math.max(1, parseInt(item && item.qty, 10) || 1);
  const listTotal = (items) => (items || []).reduce((n, item) => n + lineListTotal(item), 0);
  const priceHTML = (list, sale) => {
    if (sale != null && list != null && sale < list - 0.0001) {
      return `<s class="price-was">${money(list)}</s><span class="price-now">${money(sale)}</span>`;
    }
    return money(sale != null ? sale : list);
  };
  const linePriceHTML = (item, opts) => priceHTML(lineListTotal(item, opts), lineTotal(item, opts));
  const totalPriceHTML = (items, opts) => priceHTML(listTotal(items), printTotal(items, opts));

  const printTotal = (items, opts) => (items || []).reduce((n, item) => n + lineTotal(item, opts), 0);

  const shipBand = (size) => (LARGE_SIZES.has(String(size || "")) ? "large" : "medium");

  const shipRateForSize = (size) => SHIP[shipBand(size)].first / 100;

  const shipEstimate = (items) => {
    let medium = 0;
    let large = 0;
    (items || []).forEach((item) => {
      const q = Math.max(0, parseInt(item.qty, 10) || 1);
      if (shipBand(item.size) === "large") large += q;
      else medium += q;
    });
    let cents = 0;
    if (medium) cents += SHIP.medium.first + SHIP.medium.extra * (medium - 1);
    if (large) cents += SHIP.large.first + SHIP.large.extra * (large - 1);
    return { medium, large, cents, total: cents / 100 };
  };


  const US_TRANSIT = {
    east: [3, 4],
    se: [3, 4],
    mw: [3, 4],
    sw: [3, 5],
    mt: [4, 5],
    west: [4, 6],
    akhi: [6, 10],
  };

  const zipRegion = (zip) => {
    const z = String(zip || "").replace(/\D/g, "");
    if (z.length < 5) return null;
    const n3 = parseInt(z.slice(0, 3), 10);
    if (n3 >= 995 && n3 <= 999) return "akhi";
    if (n3 >= 967 && n3 <= 968) return "akhi";
    const d = parseInt(z[0], 10);
    if (d <= 2) return "east";
    if (d === 3) return "se";
    if (d <= 6) return "mw";
    if (d === 7) return "sw";
    if (d === 8) return "mt";
    return "west";
  };

  const isUSCountry = (country) => /united states|^usa$|^us$|^u\.s/i.test(String(country || "").trim());
  const isCanada = (country) => /canada|^ca$/i.test(String(country || "").trim());

  const shipSpeed = ({ zip, country } = {}) => {
    const print = [2, 5];
    if (country && !isUSCountry(country) && isCanada(country)) {
      return { print, transit: [3, 4], door: [5, 9], where: "Canada" };
    }
    if (country && !isUSCountry(country) && !isCanada(country)) {
      return { print, transit: [5, 20], door: [7, 25], where: "intl" };
    }
    const region = zipRegion(zip);
    if (!region) return { print, transit: [3, 4], door: [5, 9], where: "US" };
    const transit = US_TRANSIT[region];
    return { print, transit, door: [print[0] + transit[0], print[1] + transit[1]], where: region };
  };

  const zipShipLine = ({ zip, country, items } = {}) => {
    const est = shipEstimate(items || []);
    const speed = shipSpeed({ zip, country });
    const moneyBit = est.cents ? `Ship ${moneyCents(est.cents)}. ` : "";
    const z = String(zip || "").replace(/\D/g, "").slice(0, 5);
    if (speed.where === "intl") {
      return `${moneyBit}Fraimous: 2–5 days to make, then 5–20 days in transit. Estimate, not a guarantee. Customs may apply. No wooden frames to Australia.`;
    }
    if (speed.where === "Canada") {
      return `${moneyBit}Fraimous Standard to Canada: 2–5 days to make, then 3–4 days in transit. Usually 5–9 business days to the door.`;
    }
    if (z.length === 5) {
      return `${moneyBit}Fraimous Standard to ${z}: 2–5 days to make, then ${speed.transit[0]}–${speed.transit[1]} days in transit. Usually ${speed.door[0]}–${speed.door[1]} business days to the door. Estimate, not a guarantee.`;
    }
    return `${moneyBit}Fraimous Standard: 2–5 days to make, then 3–4 days in transit in the US. ZIP tightens the window.`;
  };

  const cartShipLine = (items) => {
    const est = shipEstimate(items);
    if (!est.medium && !est.large) return "";
    return `US ship estimate ${moneyCents(est.cents)} · made 2–5 business days, then ships.`;
  };

  const checkoutShipLine = (items) => {
    const est = shipEstimate(items);
    if (!est.medium && !est.large) return "";
    return `Estimated US shipping (Standard, after production): ${moneyCents(est.cents)}.`;
  };

  const pdpShipLine = (size, finish) => {
    const rate = money(shipRateForSize(size));
    const unit = (finish || "luster") === "canvas" ? "canvas" : "frame";
    return `Made on demand. 2–5 business days to make, then ships. US Standard after production: ${rate} for this ${size}. Each ${unit} ships alone. US after fulfillment: 3–4 business days. We cannot ship wooden frames to Australia. Customs may apply outside the fulfill region.`;
  };

  const linesText = (items) =>
    (items || [])
      .map((item) => {
        const q = item.qty || 1;
        return [
          titleLabel(item),
          `Finish: ${finishLabel(item.finish)}`,
          `Frame: ${(item.finish || "luster") === "canvas" ? "Gallery wrap" : frameLabel(item.frame)}`,
          `Size: ${sizeLabel(item.size, item.finish)}`,
          `Qty: ${q}`,
          `Price: ${money(priceForSize(item.size, item.finish, item.slug))}`,
        ].join("\n");
      })
      .join("\n\n");

  const frameMail = (frame) => (frame === "oak" ? "red oak" : String(frameLabel(frame)).toLowerCase());

  const mailtoHref = (inquiry) => {
    const items = (inquiry && inquiry.items) || read();
    const subject = items.length === 1
      ? `${titleLabel(items[0])} — ${items[0].size || "16×20"}, ${frameMail(items[0].frame)}`
      : items.map(titleLabel).join(", ") || "piece request";
    const wantLines = items.map((item) => {
      const q = item.qty || 1;
      const line = `${titleLabel(item).toLowerCase()} — ${frameMail(item.frame)}, ${sizeLabel(item.size, item.finish)}`;
      return q > 1 ? `${line} ×${q}` : line;
    });
    const ship = inquiry
      ? [
          inquiry.name,
          inquiry.address,
          inquiry.apt,
          [inquiry.city, inquiry.state, inquiry.zip].filter(Boolean).join(", "),
          inquiry.country,
        ].filter(Boolean)
      : [];
    const saw = items.length === 1
      ? `hi — saw ${titleLabel(items[0]).toLowerCase()} on x and came through the site.`
      : "hi — saw these on x and came through the site.";
    const print = printTotal(items);
    const want = items.length === 1
      ? `i want it in ${frameMail(items[0].frame)}, ${items[0].size || "16×20"}. ${money(print)}.`
      : `i want\n${wantLines.join("\n")}\n${money(print)}.`;
    const body = [
      saw,
      "",
      want,
      "",
      ship.length ? "ship to" : "",
      ...ship,
      "",
      inquiry && inquiry.email ? `write me at ${inquiry.email}` : "",
    ]
      .filter((line, i, a) => !(line === "" && (i === 0 || a[i - 1] === "")))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return `/#inquire`;
  };

  window.FraimousCart = {
    KEY,
    INQUIRY_KEY,
    FRAME_LABEL,
    SIZE_LABEL,
    CANVAS_SIZE_LABEL,
    read,
    write,
    add,
    remove,
    setQty,
    clear,
    count,
    frameLabel,
    sizeLabel,
    finishLabel,
    titleLabel,
    cutoutSrc,
    paintCount,
    saveInquiry,
    readInquiry,
    mailtoHref,
    linesText,
    money,
    publicBump,
    isMember,
    memberEmail,
    originalPriceForSize,
    priceForSize,
    isSetSale,
    saleOf,
    SET_SALE_OFF,
    lineListTotal,
    lineTotal,
    listTotal,
    printTotal,
    priceHTML,
    linePriceHTML,
    totalPriceHTML,
    shipBand,
    shipRateForSize,
    shipEstimate,
    cartShipLine,
    checkoutShipLine,
    pdpShipLine,
    zipRegion,
    shipSpeed,
    zipShipLine,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paintCount);
  } else {
    paintCount();
  }
})();
