(function () {
  var KEY = "fraimous-soon-order";
  var THRESH = 8;
  document.body.classList.add("soon-sort");

  function slugOf(piece) {
    var f = piece.querySelector("[data-slug]");
    if (f && f.getAttribute("data-slug")) return f.getAttribute("data-slug");
    var a = piece.querySelector("a[href*='works/']");
    if (!a) return "";
    var m = a.getAttribute("href").match(/works\/([^./]+)/);
    return m ? m[1] : "";
  }

  function sections() {
    return Array.prototype.slice.call(
      document.querySelectorAll("section.works--soon, section.breakout--soon")
    ).filter(function (sec) {
      return sec.id !== "stock";
    });
  }

  function snapshot() {
    return {
      t: Date.now(),
      sections: sections().map(function (sec) {
        var titleEl = sec.querySelector(".section-title, .hero-title");
        return {
          aria: sec.getAttribute("aria-label") || "",
          title: titleEl ? titleEl.textContent.trim() : "",
          slugs: Array.prototype.map.call(sec.querySelectorAll(".piece"), slugOf).filter(Boolean)
        };
      })
    };
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(snapshot())); } catch (err) {}
  }

  function findSection(aria, title) {
    var list = sections();
    var i, sec, t;
    for (i = 0; i < list.length; i++) {
      sec = list[i];
      if (aria && sec.getAttribute("aria-label") === aria) return sec;
    }
    for (i = 0; i < list.length; i++) {
      t = list[i].querySelector(".section-title, .hero-title");
      if (t && t.textContent.trim() === title) return list[i];
    }
    return null;
  }

  function applySaved() {
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (err) { return; }
    if (!raw) return;
    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    if (!data || !data.sections) return;
    var map = {};
    Array.prototype.forEach.call(document.querySelectorAll(".piece"), function (p) {
      var s = slugOf(p);
      if (s) map[s] = p;
    });
    var anchor = document.getElementById("stock");
    data.sections.forEach(function (row) {
      var sec = findSection(row.aria, row.title);
      if (!sec) return;
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(sec, anchor.nextSibling);
        anchor = sec;
      }
      var grid = sec.querySelector(".grid--shop");
      if (!grid || !row.slugs) return;
      row.slugs.forEach(function (slug) {
        if (map[slug]) grid.appendChild(map[slug]);
      });
    });
  }

  applySaved();

  Array.prototype.forEach.call(document.querySelectorAll("section.works--soon .works-head"), function (head) {
    var sec = head.closest("section");
    if (!sec || sec.id === "stock") return;
    head.classList.add("soon-section-handle");
  });

  function skipTarget(el) {
    return !!(el && el.closest && el.closest("input, button, textarea, select, label, .notify-form, .soon-lock"));
  }

  function grids() {
    return Array.prototype.slice.call(document.querySelectorAll("section.works--soon .grid--shop"));
  }

  function insertPieceAtPoint(piece, x, y) {
    var bestGrid = null;
    var bestScore = Infinity;
    grids().forEach(function (grid) {
      var r = grid.getBoundingClientRect();
      var dx = 0;
      var dy = 0;
      if (x < r.left) dx = r.left - x;
      else if (x > r.right) dx = x - r.right;
      if (y < r.top) dy = r.top - y;
      else if (y > r.bottom) dy = y - r.bottom;
      var score = dx + dy;
      if (score < bestScore) {
        bestScore = score;
        bestGrid = grid;
      }
    });
    if (!bestGrid) return;
    var cards = Array.prototype.filter.call(bestGrid.children, function (p) {
      return p.classList && p.classList.contains("piece") && p !== piece;
    });
    var after = null;
    for (var i = 0; i < cards.length; i++) {
      var r = cards[i].getBoundingClientRect();
      if (y >= r.top && y < r.bottom) {
        if (x < r.left + r.width / 2) {
          after = cards[i];
          break;
        }
      } else if (y < r.top) {
        after = cards[i];
        break;
      }
    }
    if (after) bestGrid.insertBefore(piece, after);
    else bestGrid.appendChild(piece);
  }

  function insertSectionAtPoint(sec, y) {
    var list = sections();
    var after = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] === sec) continue;
      var r = list[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) {
        after = list[i];
        break;
      }
    }
    var parent = sec.parentNode;
    if (!parent) return;
    if (after) parent.insertBefore(sec, after);
    else {
      var foot = document.querySelector(".site-foot");
      if (foot && foot.parentNode === parent) parent.insertBefore(sec, foot);
      else parent.appendChild(sec);
    }
  }

  function swallowClick() {
    var kill = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      document.removeEventListener("click", kill, true);
    };
    document.addEventListener("click", kill, true);
    setTimeout(function () {
      document.removeEventListener("click", kill, true);
    }, 450);
  }

  var drag = null;

  function onMove(e) {
    if (!drag) return;
    var x = e.clientX;
    var y = e.clientY;
    if (!drag.live) {
      if (Math.abs(x - drag.x) < THRESH && Math.abs(y - drag.y) < THRESH) return;
      drag.live = true;
      drag.el.classList.add("is-dragging");
      document.body.classList.add("soon-dragging");
    }
    e.preventDefault();
    if (drag.kind === "piece") insertPieceAtPoint(drag.el, x, y);
    else insertSectionAtPoint(drag.el, y);
  }

  function onUp() {
    if (!drag) return;
    document.removeEventListener("pointermove", onMove, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("pointercancel", onUp, true);
    if (drag.live) {
      drag.el.classList.remove("is-dragging");
      document.body.classList.remove("soon-dragging");
      persist();
      swallowClick();
    }
    drag = null;
  }

  document.addEventListener("pointerdown", function (e) {
    if (e.button) return;
    if (skipTarget(e.target)) return;
    var piece = e.target.closest && e.target.closest(".grid--shop .piece");
    var head = e.target.closest && e.target.closest("section.works--soon .works-head");
    if (piece) {
      drag = { el: piece, x: e.clientX, y: e.clientY, live: false, kind: "piece" };
    } else if (head) {
      var sec = head.closest("section");
      if (!sec || sec.id === "stock") return;
      drag = { el: sec, x: e.clientX, y: e.clientY, live: false, kind: "section" };
    } else {
      return;
    }
    document.addEventListener("pointermove", onMove, { capture: true, passive: false });
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("pointercancel", onUp, true);
  }, true);

  var head = document.querySelector("#stock .works-head");
  if (head) {
    var bar = document.createElement("div");
    bar.className = "soon-lock";
    bar.innerHTML = '<p class="soon-lock-note mono" data-font="mono">Drag a work or a heading. Lock in when it is right.</p><button type="button" class="soon-lock-btn" id="soon-lock-btn">Lock in</button>';
    head.appendChild(bar);
    document.getElementById("soon-lock-btn").addEventListener("click", function () {
      persist();
      var data = snapshot();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "soon-order.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.textContent = "Locked";
      this.disabled = true;
    });
  }
})();
