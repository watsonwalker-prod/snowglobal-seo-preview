/* SGE PDPs only (the-point, the-embrace, the-set): live "see it at scale" view.
   Draws the selected size at true scale on a dark wall above an 84" sofa, using the existing
   PDP cutouts (library/mocks/cutouts). The Set draws The Point + The Embrace side by side.
   Loaded only by works/the-point|the-embrace|the-set.html; no editions.js. */
(function () {
  var fig = document.querySelector("[data-sge-scale]");
  var root = document.querySelector("[data-pdp]");
  if (!fig || !root) return;
  var slug = root.dataset.slug;
  var PIECES = slug === "the-set" ? ["the-point", "the-embrace"] : [slug];
  var V = "20261006d";
  var NAME = { "16x20": "Medium", "18x24": "Large", "24x36": "Gallery", "40x55": "Large", "40x60": "Gallery" };
  var W = 132, H = 96, FLOOR = 92, SOFA_W = 84, SOFA_H = 32, GAP = 4, ABOVE = 9;
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  svg.setAttribute("role", "img");
  var sx = (W - SOFA_W) / 2, sy = FLOOR - SOFA_H;
  svg.innerHTML =
    '<rect class="sgs-wall" x="0" y="0" width="' + W + '" height="' + FLOOR + '"/>' +
    '<rect class="sgs-floor" x="0" y="' + FLOOR + '" width="' + W + '" height="' + (H - FLOOR) + '"/>' +
    '<g class="sgs-sofa">' +
    '<rect x="' + sx + '" y="' + (sy + 4) + '" width="' + SOFA_W + '" height="' + (SOFA_H - 8) + '" rx="3"/>' +
    '<rect x="' + (sx - 4) + '" y="' + (sy + 12) + '" width="8" height="' + (SOFA_H - 14) + '" rx="2.5"/>' +
    '<rect x="' + (sx + SOFA_W - 4) + '" y="' + (sy + 12) + '" width="8" height="' + (SOFA_H - 14) + '" rx="2.5"/>' +
    '<rect x="' + (sx + 4) + '" y="' + (sy + 16) + '" width="' + (SOFA_W - 8) + '" height="7" rx="1.5" class="sgs-seat"/>' +
    '<rect x="' + (sx + 6) + '" y="' + (FLOOR - 4) + '" width="2" height="4"/><rect x="' + (sx + SOFA_W - 8) + '" y="' + (FLOOR - 4) + '" width="2" height="4"/>' +
    "</g>" +
    '<text class="sgs-note" x="' + (W / 2) + '" y="' + (FLOOR + 3.2) + '">SOFA ≈ 84″</text>' +
    '<g class="sgs-art"></g>';
  var art = svg.querySelector(".sgs-art");
  var cap = document.createElement("figcaption");
  cap.className = "sgs-cap";
  fig.innerHTML = "";
  fig.appendChild(svg);
  fig.appendChild(cap);

  var q = function (s) { return document.querySelector(s); };
  function state() {
    var fin = ((q(".pdp-info [data-finish].is-on") || {}).dataset || {}).finish || "luster";
    var fr = ((q(".swatch.is-on") || {}).dataset || {}).frame || "black";
    var g = q('[data-size-group="' + (fin === "canvas" ? "canvas" : "framed") + '"] .chip.is-on');
    var sz = String((g && g.dataset.size) || "24×36").replace("×", "x");
    return { fin: fin, fr: fr, size: sz };
  }
  var last = "";
  function draw() {
    var s = state(), key = s.fin + s.fr + s.size;
    if (key === last) return;
    last = key;
    var d = s.size.split("x").map(Number), canvas = s.fin === "canvas";
    var add = canvas ? 0 : 1.5; // .75" frame each side
    var w = Math.min(d[0], d[1]) + add, h = Math.max(d[0], d[1]) + add;
    var total = PIECES.length * w + (PIECES.length - 1) * GAP;
    var x0 = (W - total) / 2, y = Math.max(2, sy - ABOVE - h);
    var file = canvas ? "canvas_" + s.size : (s.fin === "mat" ? "mat_" : "") + s.fr + "_" + s.size;
    art.innerHTML = "";
    PIECES.forEach(function (p, i) {
      var im = document.createElementNS(NS, "image");
      im.setAttribute("href", "../library/mocks/cutouts/" + p + "_" + file + ".png?v=" + V);
      im.setAttribute("x", (x0 + i * (w + GAP)).toFixed(2));
      im.setAttribute("y", y.toFixed(2));
      im.setAttribute("width", w.toFixed(2));
      im.setAttribute("height", h.toFixed(2));
      im.setAttribute("preserveAspectRatio", "none");
      art.appendChild(im);
    });
    var label = (canvas ? "Canvas " : (NAME[s.size] || "") + " ") + s.size.replace("x", "×") + (canvas ? "" : " framed") + (PIECES.length > 1 ? " · pair" : "");
    var dims = PIECES.length > 1 ? " · about " + Math.round(total) + "″ wide together" : "";
    cap.textContent = "Shown to scale: " + label + dims + " over an 84″ sofa.";
    svg.setAttribute("aria-label", cap.textContent);
  }
  document.addEventListener("click", function () { setTimeout(draw, 60); }, true);
  window.addEventListener("load", draw);
  draw();
})();
