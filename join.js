(() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const KEY = "fraimous-join";
  const EMAIL_KEY = "fraimous-member-email";

  const markup = `
<div class="join-layer" id="join-layer" hidden>
  <div class="join-scrim" data-join-close aria-hidden="true"></div>
  <div class="join-card" role="dialog" aria-modal="true" aria-labelledby="join-title">
    <button class="join-close" type="button" data-join-close aria-label="Close">Close</button>
    <figure class="join-art">
      <video src="/library/web/join-tiger.mp4?v=20260821d" poster="/library/web/join-tiger.jpg?v=20260821d" width="720" height="1280" autoplay muted loop playsinline webkit-playsinline disablepictureinpicture controlslist="nodownload nofullscreen noremoteplayback noplaybackrate" aria-label="Salon tiger"></video>
    </figure>
    <div class="join-copy">
      <p class="eyebrow tag mono" data-font="mono">VIP club</p>
      <h2 class="join-title" id="join-title" data-font="display">MEMBERS<br>HANG<br>FIRST</h2>
      <p class="join-lede" id="join-lede">First dibs on the drop. The shop can wait.</p>
      <form class="join-form" id="join-form" data-mode="signup" novalidate>
        <label class="sr-only" for="join-email">Email</label>
        <div class="join-row">
          <input id="join-email" name="email" type="email" autocomplete="email" required placeholder="Email" />
          <button type="submit" id="join-submit" data-font="mono">I'm in</button>
        </div>
      </form>
      <p class="join-switch mono" data-font="mono">
        <button type="button" class="join-switch-btn" id="join-switch" data-join-switch>Already a member? Log in</button>
      </p>
      <p class="join-or" data-font="mono"><span>or walk in</span></p>
      <div class="join-social">
        <a class="join-social-btn" href="/api/auth?provider=x" data-join-provider="x">
          X
        </a>
        <a class="join-social-btn" href="/api/auth?provider=google" data-join-provider="google">
          Google
        </a>
        <a class="join-social-btn" href="/api/auth?provider=facebook" data-join-provider="facebook">
          Facebook
        </a>
      </div>
      <p class="join-note" id="join-note" hidden></p>
    </div>
  </div>
</div>`.trim();

  const already = () => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  };

  const remember = (email) => {
    try {
      localStorage.setItem(KEY, "1");
      if (email) localStorage.setItem(EMAIL_KEY, String(email).trim().toLowerCase());
    } catch { /* ignore */ }
  };

  const email = () => {
    try { return localStorage.getItem(EMAIL_KEY) || ""; } catch { return ""; }
  };

  const isMember = () => already() && !!email();

  // Server member list (/api/v1/member). The browser flag is only a hint; prices come from the server at checkout.
  // Log-in never confirms membership (privacy, 2026-10-10): the server answers the same for every email, and
  // this page just remembers the email so checkout can price it.
  const SYNC_KEY = "fraimous-member-synced";
  const synced = () => { try { return localStorage.getItem(SYNC_KEY) || ""; } catch { return ""; } };
  const markSynced = (em) => { try { localStorage.setItem(SYNC_KEY, String(em || "").toLowerCase()); } catch { /* ignore */ } };
  const memberApi = (action, em, source) =>
    fetch("/api/v1/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: em, source }),
    })
      .then((r) => r.json().then((j) => Object.assign({ status: r.status }, j)).catch(() => ({ ok: false, status: r.status })))
      .catch(() => ({ ok: false, status: 0 }));
  // Browsers that joined before the server list existed: register them once, quietly.
  const resync = () => {
    const em = email();
    if (!isMember() || !em || synced() === em) return;
    memberApi("join", em, "resync").then((out) => { if (out && out.ok) markSynced(em); });
  };

  const layer = () => document.getElementById("join-layer");

  const ensure = () => {
    if (layer()) return layer();
    document.body.insertAdjacentHTML("beforeend", markup);
    return layer();
  };

  const note = (text) => {
    const el = document.getElementById("join-note");
    if (!el) return;
    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = text;
  };

  const modeOf = () => {
    const form = document.getElementById("join-form");
    return (form && form.getAttribute("data-mode")) || "signup";
  };

  const setMode = (mode) => {
    const form = document.getElementById("join-form");
    const title = document.getElementById("join-title");
    const lede = document.getElementById("join-lede");
    const submit = document.getElementById("join-submit");
    const sw = document.getElementById("join-switch");
    const root = layer();
    if (!form) return;
    const login = mode === "login";
    form.setAttribute("data-mode", login ? "login" : "signup");
    form.classList.remove("is-done");
    if (root) root.dataset.mode = login ? "login" : "signup";
    if (title) title.innerHTML = login ? "WELCOME<br>BACK" : "MEMBERS<br>HANG<br>FIRST";
    if (lede) lede.textContent = login
      ? "Log in for member pricing. Same email you joined with."
      : "First dibs on the drop. The shop can wait.";
    // Restore form fields if we had swapped to done state.
    if (!form.querySelector("#join-email")) {
      form.innerHTML =
        `<label class="sr-only" for="join-email">Email</label>` +
        `<div class="join-row">` +
        `<input id="join-email" name="email" type="email" autocomplete="email" required placeholder="Email" />` +
        `<button type="submit" id="join-submit" data-font="mono">${login ? "Log in" : "I'm in"}</button>` +
        `</div>`;
    } else if (submit) {
      submit.textContent = login ? "Log in" : "I'm in";
    }
    if (sw) sw.textContent = login ? "New here? Join the list" : "Already a member? Log in";
    note("");
  };

  const markDone = (msg) => {
    const form = document.getElementById("join-form");
    if (!form) return;
    form.classList.add("is-done");
    form.setAttribute("aria-live", "polite");
    form.innerHTML = `<p class="join-done">${msg || "You're on the list."}</p>`;
    note("");
    const sw = document.getElementById("join-switch");
    if (sw) sw.hidden = true;
  };

  let lastFocus = null;

  const isPayPath = () => /\/(cart|checkout)(\.html)?\/?$/.test(location.pathname || "");
  const payFlowActive = () => {
    if (isPayPath()) return true;
    const pe = document.getElementById("payment-element");
    if (pe && pe.childElementCount > 0) return true;
    if (document.body && document.body.classList.contains("pay-flow")) return true;
    return false;
  };

  const open = (opts) => {
    if (!isJoinPage() && (isPayPath() || payFlowActive())) return;
    const root = ensure();
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add("is-join-open");
    root.classList.remove("is-in");
    void root.offsetWidth;
    root.classList.add("is-in");
    window.setTimeout(() => root.classList.remove("is-in"), 780);
    const wantLogin = opts && opts.mode === "login";
    setMode(wantLogin ? "login" : "signup");
    const sw = document.getElementById("join-switch");
    if (sw) sw.hidden = false;
    if (already() && isMember() && !wantLogin) {
      markDone("You're in. Member pricing is on.");
    } else if (already() && !wantLogin && !isMember()) {
      // Joined before email was stored — nudge to log in once.
      setMode("login");
      note("Log in with your email to unlock member pricing.");
    }
    const vid = root.querySelector(".join-art video");
    if (vid) {
      vid.muted = true;
      vid.controls = false;
      vid.removeAttribute("controls");
      const p = vid.play();
      if (p && p.catch) p.catch(() => {});
    }
    const input = document.getElementById("join-email");
    if (input) {
      if (email()) input.value = email();
      requestAnimationFrame(() => input.focus());
    }
  };

  const close = () => {
    const root = layer();
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove("is-join-open");
    markSeen();
    note("");
    if (lastFocus && typeof lastFocus.focus === "function") {
      try { lastFocus.focus(); } catch { /* ignore */ }
    }
  };

  const isJoinPage = () => /\/join(\.html)?\/?$/.test(location.pathname || "");

  const announceMember = () => {
    try {
      window.dispatchEvent(new CustomEvent("fraimous:member", { detail: { email: email(), member: isMember() } }));
    } catch { /* ignore */ }
  };

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest("[data-join-open]");
    if (openBtn) {
      // Never open the overlay over cart/checkout or an active pay flow; follow /join instead.
      if (isPayPath() || payFlowActive()) return;
      event.preventDefault();
      const mode = openBtn.getAttribute("data-join-open") === "login" ? "login" : "signup";
      open({ mode });
      return;
    }
    const switcher = event.target.closest("[data-join-switch], #join-switch");
    if (switcher) {
      event.preventDefault();
      setMode(modeOf() === "login" ? "signup" : "login");
      const input = document.getElementById("join-email");
      if (input) requestAnimationFrame(() => input.focus());
      return;
    }
    const closer = event.target.closest("[data-join-close]");
    if (closer) {
      event.preventDefault();
      close();
      return;
    }
    const social = event.target.closest("[data-join-provider]");
    if (!social) return;
    event.preventDefault();
    const provider = social.getAttribute("data-join-provider") || "";
    const href = social.getAttribute("href") || ("/api/auth?provider=" + provider);
    note("");
    fetch("/api/auth?provider=" + encodeURIComponent(provider) + "&probe=1", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json().catch(() => ({})))
      .then((out) => {
        if (out && out.wired) {
          window.location.href = href;
          return;
        }
        note("Social login isn’t connected yet — use your email above.");
      })
      .catch(() => {
        note("Social login isn’t connected yet — use your email above.");
      });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-join-open")) {
      event.preventDefault();
      close();
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("#join-form");
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const value = (input && input.value ? input.value : "").trim().toLowerCase();
    if (!value || !EMAIL_RE.test(value)) {
      if (input) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
      }
      return;
    }
    if (input) input.removeAttribute("aria-invalid");
    const login = modeOf() === "login";
    const submit = form.querySelector("button[type=submit]");
    if (submit) submit.disabled = true;
    note("");
    memberApi(login ? "login" : "join", value, "popup").then((out) => {
      if (submit) submit.disabled = false;
      if (!out || !out.ok) {
        note((out && out.message) || "Couldn’t reach the club right now. Try again in a minute.");
        return;
      }
      if (!login) {
        if (out.status !== 200) { note("Couldn’t save that just now. Please try again."); return; }
        // Nothing is written to this browser until both the member call and /api/inquire return 200.
        if (submit) submit.disabled = true;
        fetch("/api/inquire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "join", email: value, source: "popup" }),
        })
          .then((r) => r.status === 200)
          .catch(() => false)
          .then((ok) => {
            if (submit) submit.disabled = false;
            if (!ok) { note("Couldn’t save that just now. Please try again."); return; }
            remember(value);
            markSynced(value);
            markDone("You're On the List. Member pricing is on.");
            announceMember();
          });
      } else {
        remember(value);
        markSynced(value);
        markDone("Saved. If this email joined, member pricing applies at checkout.");
        announceMember();
      }
    });
  });

  const SEEN = "fraimous-join-seen";
  const DELAY = 6000;
  const seen = () => {
    try { return sessionStorage.getItem(SEEN) === "1"; } catch { return false; }
  };
  const markSeen = () => {
    try { sessionStorage.setItem(SEEN, "1"); } catch { /* ignore */ }
  };

  const ready = () => {
    ensure();
    resync();
    const q = new URLSearchParams(location.search || "");
    if (q.get("joined") === "1") {
      // OAuth return: mark joined; email may arrive later via list — still open login if no email stored.
      remember(email() || "");
      markSeen();
      if (!isPayPath() && !payFlowActive()) open({ mode: email() ? "signup" : "login" });
      if (email()) markDone("You're in. Member pricing is on.");
      else note("Add the email for this account to unlock member pricing.");
      announceMember();
      return;
    }
    if (isPayPath() || payFlowActive()) return;
    if (q.get("need") === "email") {
      open({ mode: "login" });
      note("That door didn't hand over an email. Use the field.");
      return;
    }
    if (q.get("door") === "later") {
      open();
      note("That door isn't wired yet. The field still works.");
      return;
    }
    if (isJoinPage()) {
      open();
      return;
    }
    if (already() || seen()) return;
    window.setTimeout(() => {
      if (already() || seen() || isPayPath() || payFlowActive()) return;
      markSeen();
      open();
    }, DELAY);
  };

  window.FraimousJoin = {
    open: () => open(),
    openLogin: () => open({ mode: "login" }),
    close,
    isMember,
    email,
    already,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
