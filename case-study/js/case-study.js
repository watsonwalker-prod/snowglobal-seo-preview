(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll reveal
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }

  // bots accordion
  document.querySelectorAll('.bot-head').forEach(function(btn){
    btn.addEventListener('click', function(){
      var li = btn.closest('.bot'), open = !li.classList.contains('open');
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // mark build
  var stage = document.querySelector('.mark-stage');
  if (stage){
    var steps = [
      ['01 · The brief · Aug 17','FRAME + AI + MOUS. The Greek Muse, and the end of\u00a0famous.'],
      ['02 · Five words','Nostalgic, eclectic, elevated, collected, luxe. Hangers and blackletter\u00a0killed.'],
      ['03 · Two frames','Fifty frames in a grid. Two overlapping squares\u00a0survived.'],
      ['04 · The O · Aug 18','Letter-width, overlap filled solid. Locked just after\u00a0midnight.']
    ];
    var k = stage.querySelector('.mark-k'), t = stage.querySelector('.mark-t');
    var tabs = stage.querySelectorAll('.step'), timer = null, cur = 0, played = false;
    function go(i){
      cur = i; stage.setAttribute('data-step', i);
      k.textContent = steps[i][0]; t.textContent = steps[i][1];
      tabs.forEach(function(b,j){ b.setAttribute('aria-selected', j===i ? 'true':'false'); });
    }
    tabs.forEach(function(b){ b.addEventListener('click', function(){ clearInterval(timer); go(+b.dataset.go); }); });
    function autoplay(){
      if (played) return; played = true;
      if (reduce){ go(3); return; }
      timer = setInterval(function(){ if (cur < 3) go(cur+1); else clearInterval(timer); }, 2200);
    }
    if ('IntersectionObserver' in window){
      var mo = new IntersectionObserver(function(en){ if(en[0].isIntersecting){ autoplay(); mo.disconnect(); } }, {threshold:0.5});
      mo.observe(stage);
    } else { go(3); }
  }

  // timeline fill
  var tl = document.querySelector('.tl');
  if (tl){
    var items = tl.querySelectorAll('.tl-i');
    function fill(){
      var r = tl.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      tl.style.setProperty('--fill', (p*100).toFixed(1) + '%');
      items.forEach(function(it){ it.classList.toggle('lit', it.getBoundingClientRect().top < mid); });
    }
    window.addEventListener('scroll', fill, {passive:true}); window.addEventListener('resize', fill); fill();
  }

  // count-up
  var nums = document.querySelectorAll('.num[data-count]');
  function fmt(el, v){ el.textContent = (el.dataset.prefix || '') + Math.round(v).toLocaleString('en-US'); }
  if ('IntersectionObserver' in window && !reduce){
    nums.forEach(function(el){ fmt(el, 0); });
    var co = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if (!e.isIntersecting) return; co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, t0 = null, dur = 1200;
        function tick(ts){ if(!t0) t0 = ts; var p = Math.min(1,(ts-t0)/dur); fmt(el, end*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(tick); }
        requestAnimationFrame(tick);
      });
    }, {threshold:0.6});
    nums.forEach(function(el){ co.observe(el); });
  }

  // edition curve (framed 16x20: original $250, public rises linearly to +10% at the last print)
  var r = document.getElementById('soldRange');
  if (r){
    var sold = document.getElementById('sold'), pub = document.getElementById('pub'), mem = document.getElementById('mem');
    var money = function(v){ return '$' + v.toFixed(2); };
    var upd = function(){ var s = +r.value; sold.textContent = s; pub.textContent = money(250*(1+0.10*s/24)); mem.textContent = money(250); };
    r.addEventListener('input', upd); upd();
  }

  // gallery buttons
  var gal = document.querySelector('.gal');
  document.querySelectorAll('.gal-btn').forEach(function(b){
    b.addEventListener('click', function(){ gal.scrollBy({left: (+b.dataset.dir) * gal.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth'}); });
  });

  // lightbox
  var lb = document.getElementById('lb');
  if (lb && lb.showModal){
    var img = lb.querySelector('.lb-img'), cap = lb.querySelector('.lb-cap'), last = null;
    document.querySelectorAll('.zoom').forEach(function(z){
      z.addEventListener('click', function(){
        last = z; img.src = z.dataset.full; img.alt = z.dataset.cap; cap.textContent = z.dataset.cap;
        lb.showModal(); document.body.style.overflow = 'hidden';
      });
    });
    function close(){ lb.close(); }
    lb.addEventListener('close', function(){ document.body.style.overflow = ''; if (last) last.focus(); });
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.addEventListener('click', function(e){ if (e.target === lb || e.target === img) close(); });
  } else {
    document.querySelectorAll('.zoom').forEach(function(z){ z.addEventListener('click', function(){ window.open(z.dataset.full, '_blank'); }); });
  }
})();
