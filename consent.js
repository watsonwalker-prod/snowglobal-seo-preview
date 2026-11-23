/* FRAIMOUS cookie consent v1 — . No ad/analytics tags are loaded by this file.
   Future tags MUST check window.fraimousConsent.allowed() or listen for "fraimous:consent". */
(function () {
  var KEY = 'fraimous_cookie_consent_v1';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(choice) {
    var v = { v: 1, choice: choice, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('fraimous:consent', { detail: v })); } catch (e) {}
  }
  window.fraimousConsent = {
    get: read,
    allowed: function () { var v = read(); return !!(v && v.choice === 'all'); },
    open: function () { show(); }
  };
  var css = '#fc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:[phone removed];max-width:560px;margin:0 auto;background:#241812;color:#f8f1e8;border:1px solid #5a4030;border-radius:2px;padding:18px 20px;font:14px/1.5 "Instrument Sans","Helvetica Neue",system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35)}'
    + '#fc-banner h2{margin:0 0 6px;font-size:16px;font-weight:600;color:#fff;font-family:Syne,system-ui,sans-serif}#fc-banner p{margin:0 0 14px}#fc-banner a{color:#d4a574;text-decoration:underline}'
    + '#fc-banner .fc-row{display:flex;gap:10px;flex-wrap:wrap}#fc-banner button{flex:1 1 140px;min-height:44px;padding:10px 14px;border-radius:2px;border:1px solid #d4a574;background:transparent;color:#f8f1e8;font:500 12px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}'
    + '#fc-banner button:focus-visible{outline:3px solid #c9a96e;outline-offset:2px}#fc-banner .fc-legal{margin:10px 0 0;font-size:12px;opacity:.8}'
    + '@media (max-width:560px){#fc-banner{left:0;right:0;bottom:0;border-radius:0;border-width:1px 0 0;padding:14px 16px}#fc-banner p{margin:0 0 10px;font-size:13px}#fc-banner button{min-height:44px}}';
  function show() {
    if (document.getElementById('fc-banner')) return;
    if (!document.getElementById('fc-style')) { var s = document.createElement('style'); s.id = 'fc-style'; s.textContent = css; document.head.appendChild(s); }
    var d = document.createElement('div');
    d.id = 'fc-banner'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'false');
    d.setAttribute('aria-labelledby', 'fc-title'); d.setAttribute('aria-describedby', 'fc-body');
    d.innerHTML = '<h2 id="fc-title">We Value Your Privacy</h2>'
      + '<p id="fc-body">FRAIMOUS™ uses cookies and similar storage for essential site functions (like your cart). With your permission, we may also use analytics and third-party advertising tags to measure and personalize ads. You can change your choice anytime via “Cookie preferences” in the footer. See our <a href="https://fraimous.com/privacy">Privacy Policy</a> and <a href="https://fraimous.com/legal">Legal</a>.</p>'
      + '<div class="fc-row"><button type="button" data-c="all">Accept all</button><button type="button" data-c="essential">Essential only</button></div>'
      + '<p class="fc-legal">fraimous.com is operated by FRAIMOUS.</p>';
    d.addEventListener('click', function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute('data-c');
      if (c) { save(c); d.parentNode && d.parentNode.removeChild(d); }
    });
    document.body.appendChild(d);
  }
  function addFooterLink() {
    if (document.getElementById('fc-pref')) return;
    var anchor = document.querySelector('a[href="/any-likeness"],a[href="https://fraimous.com/any-likeness"]');
    if (!anchor || !anchor.parentNode) return;
    var a = document.createElement('a');
    a.id = 'fc-pref'; a.href = '#cookie-preferences'; a.textContent = 'Cookie preferences';
    a.className = anchor.className;
    a.addEventListener('click', function (e) { e.preventDefault(); show(); });
    anchor.parentNode.insertBefore(document.createTextNode(' · '), anchor.nextSibling);
    anchor.parentNode.insertBefore(a, anchor.nextSibling.nextSibling);
  }
  function init() { addFooterLink(); if (!read() || location.hash === '#cookie-preferences') show(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
