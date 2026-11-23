(() => {
  const KEY = "fraimous-notify";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const asRecord = (x) => {
    if (!x || typeof x !== "object") return null;
    const slug = String(x.slug || "").trim();
    const email = String(x.email || "").trim().toLowerCase();
    if (!slug || !EMAIL_RE.test(email)) return null;
    return { email, slug, title: String(x.title || ""), t: Number(x.t) || 0 };
  };

  const read = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) return raw.map(asRecord).filter(Boolean);
      if (raw && typeof raw === "object") {
        return Object.keys(raw)
          .map((slug) => asRecord({ slug, email: raw[slug] }))
          .filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const write = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
  };

  const hasEmailFor = (slug) => {
    if (!slug) return false;
    return read().some((x) => x.slug === slug);
  };

  const markDone = (form) => {
    form.classList.add("is-done");
    form.setAttribute("aria-live", "polite");
    form.innerHTML = `<p class="notify-done">${form.dataset.done || "You're on the list."}</p>`;
  };

  const save = (email, slug, title) => {
    if (!slug || !EMAIL_RE.test(email)) return;
    const items = read();
    if (items.some((x) => x.email === email && x.slug === slug)) return;
    items.push({ email, slug, title, t: Date.now() });
    write(items);
  };

  document.addEventListener("submit", (event) => {
    const form = event.target.closest(".notify-form");
    if (!form) return;
    event.preventDefault();

    const input = form.querySelector('input[type="email"]');
    const email = (input && input.value ? input.value : "").trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      if (input) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
      }
      return;
    }
    if (input) input.removeAttribute("aria-invalid");

    const slug = form.dataset.slug || "";
    const title = form.dataset.title || "";
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    const old = form.querySelector(".notify-retry");
    if (old) old.remove();
    fetch("/api/inquire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "notify", email, slug, title, source: location.pathname }),
    })
      .then((r) => r.status === 200)
      .catch(() => false)
      .then((ok) => {
        if (btn) btn.disabled = false;
        if (!ok) {
          form.insertAdjacentHTML("beforeend", '<p class="notify-retry" role="alert">Couldn’t save that just now. Please try again.</p>');
          return;
        }
        save(email, slug, title);
        document.querySelectorAll(".notify-form").forEach((el) => {
          if (el.dataset.slug === slug) markDone(el);
        });
      });
  });

  const ready = () => {
    const clean = read();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && raw !== JSON.stringify(clean)) write(clean);
    } catch { /* ignore */ }

    document.querySelectorAll(".notify-form").forEach((form) => {
      const slug = form.dataset.slug || "";
      if (slug && hasEmailFor(slug)) markDone(form);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
