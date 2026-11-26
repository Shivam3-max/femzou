/* FemZou theme behaviour. Vanilla, no dependencies. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FZ = window.FZ || { routes: {}, freeShip: 49900 };
  const money = (p) => `₹${Math.round(p / 100).toLocaleString('en-IN')}`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PH = '<div class="ph"><svg class="ph__i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.500" width="18" height="15" rx="1.500"/><circle cx="8.500" cy="9.500" r="1.600"/><path d="m3.500 17 5-4.600 3.400 3 3-2.500 5.600 4.600"/></svg></div>';

  /* ---- panels: cart, nav, search ---- */
  const scrim = $('[data-scrim]');
  let lastFocus = null;
  function toast(msg) {
    const t = $('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.hidden = true; }, 3200);
  }
  function openPanel(name) {
    const p = $(`[data-panel="${name}"]`);
    if (!p) return;
    if (!p.hidden && p.classList.contains('is-open')) return; /* already open: no flicker */
    closePanels();
    lastFocus = document.activeElement;
    p.hidden = false;
    scrim.hidden = false;
    void p.offsetWidth; /* commit the start position so the slide-in transition runs */
    p.classList.add('is-open');
    scrim.classList.add('is-on');
    document.body.classList.add('locked');
    document.body.dataset.openPanel = name; /* lets the sticky header rise above the scrim for the nav panel */
    (p.querySelector('[data-search-input]') || p.querySelector('[data-close]'))?.focus({ preventScroll: true });
  }
  function closePanels() {
    $$('[data-panel]').forEach((p) => {
      if (p.hidden) return;
      p.classList.remove('is-open');
      setTimeout(() => { if (!p.classList.contains('is-open')) p.hidden = true; }, 240);
    });
    scrim?.classList.remove('is-on');
    setTimeout(() => { if (!scrim?.classList.contains('is-on') && scrim) scrim.hidden = true; }, 240);
    document.body.classList.remove('locked');
    delete document.body.dataset.openPanel;
    lastFocus?.focus?.();
    lastFocus = null;
  }

  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) { e.preventDefault(); openPanel(open.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target.closest('[data-scrim]')) closePanels();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePanels(); closeMegas(); } });

  /* ---- mega menu ---- */
  const megas = $$('[data-mega]');
  function closeMegas(except) {
    megas.forEach((m) => { if (m !== except) { m.classList.remove('is-open'); m.querySelector('button').setAttribute('aria-expanded', 'false'); } });
  }
  megas.forEach((m) => {
    const b = m.querySelector('button');
    let t;
    const show = () => { clearTimeout(t); closeMegas(m); m.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); };
    const hide = () => { t = setTimeout(() => { m.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); }, 120); };
    /* hover opens for a mouse only; on tablets a tap toggles, so one tap never opens and closes */
    /* a mouse click on a menu the pointer already opened by hovering keeps it
       open (otherwise hover opens it and the click instantly shuts it) */
    let hovered = false;
    m.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovered = true; show(); } });
    m.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovered = false; hide(); } });
    b.addEventListener('click', () => {
      if (hovered && m.classList.contains('is-open')) return;
      m.classList.contains('is-open') ? hide() : show();
    });
    m.addEventListener('focusout', (e) => { if (e.relatedTarget && !m.contains(e.relatedTarget)) hide(); });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-mega]')) closeMegas(); });

  /* ---- announcement ---- */
  const annMsgs = $$('.ann__msg');
  if (annMsgs.length > 1) {
    let i = 0;
    setInterval(() => { annMsgs[i].classList.remove('is-on'); i = (i + 1) % annMsgs.length; annMsgs[i].classList.add('is-on'); }, 4500);
  }

  /* ---- hero ---- */
  $$('[data-hero]').forEach((h) => {
    const track = $('[data-hero-track]', h);
    const dots = $$('[data-hero-dot]', h);
    const n = track.children.length;
    if (n < 2) return;
    let i = 0, timer;
    const go = (k) => {
      i = (k + n) % n;
      track.style.transform = `translateX(${-100 * i}%)`;
      dots.forEach((d, x) => d.classList.toggle('is-on', x === i));
    };
    /* Reduced motion keeps the rotation but drops the slide animation. */
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) track.style.transition = 'none';
    /* One timer at most: every start clears the last. Touch never pauses on
       "hover" (phones fire a fake mouseenter on tap and no mouseleave), and a
       hidden tab pauses until it is shown again. */
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { stop(); if (!document.hidden) timer = setInterval(() => go(i + 1), 6000); };
    const restart = () => { if (timer) start(); };
    $('[data-hero-prev]', h)?.addEventListener('click', () => { go(i - 1); restart(); });
    $('[data-hero-next]', h)?.addEventListener('click', () => { go(i + 1); restart(); });
    dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.heroDot)); restart(); }));
    h.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stop(); });
    h.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') start(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    let x0 = null;
    h.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    const touchDone = (e) => {
      if (x0 !== null && e.changedTouches?.[0]) {
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }
      x0 = null; start();
    };
    h.addEventListener('touchend', touchDone);
    h.addEventListener('touchcancel', touchDone);
    start();
  });

  /* ---- rails ---- */
  function bindRail(r) {
    const t = $('[data-rail-track]', r);
    const prev = $('[data-rail-prev]', r), next = $('[data-rail-next]', r);
    const update = () => {
      const max = t.scrollWidth - t.clientWidth;
      prev.hidden = t.scrollLeft < 4;
      next.hidden = t.scrollLeft > max - 4 || max <= 4;
    };
    const step = () => (t.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    prev.addEventListener('click', () => t.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
    next.addEventListener('click', () => t.scrollBy({ left: step() * 2, behavior: 'smooth' }));
    t.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    r._update = update;
  }
  $$('[data-rail]').forEach(bindRail);

  /* ---- drag to move horizontal rows with a mouse ---- */
  $$('[data-drag]').forEach((el) => {
    let down = false, x = 0, start = 0, moved = false;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button) return; down = true; x = e.clientX; start = el.scrollLeft; moved = false; });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - x;
      if (Math.abs(dx) > 4) { moved = true; el.classList.add('is-drag'); }
      if (moved) el.scrollLeft = start - dx;
    });
    addEventListener('pointerup', () => { if (down) { down = false; el.classList.remove('is-drag'); } });
    el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', (e) => e.preventDefault());
  });

  /* ---- sticky category bar + back to top ---- */
  const catbar = $('[data-catbar]'), circles = $('[data-circles]'), hdr = $('[data-header]'), totop = $('[data-totop]');
  const onScroll = () => {
    if (catbar && circles && catbar.classList.contains('catbar--late')) {
      catbar.classList.toggle('is-shown', circles.getBoundingClientRect().bottom < hdr.getBoundingClientRect().bottom + 8);
    }
    if (totop) totop.hidden = scrollY < 900;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  totop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  const onCat = $('.catbar__i.is-on');
  if (onCat) {
    const t = onCat.parentElement;
    if (onCat.offsetLeft + onCat.offsetWidth > t.clientWidth - 48) t.scrollLeft = onCat.offsetLeft - 56;
  }

  /* ---- brand statement: typed headline ---- */
  $$('[data-type]').forEach((h) => {
    const sec = h.closest('.statement');
    const text = h.textContent.trim();
    if (!sec || !text) return;
    h.setAttribute('aria-label', text);
    h.textContent = '';
    const words = text.split(/\s+/);
    words.forEach((w, i) => {
      const word = document.createElement('span');
      word.className = `tw__w${i === words.length - 1 ? ' tw__w--last' : ''}`;
      word.setAttribute('aria-hidden', 'true');
      [...w].forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'tw__c';
        c.textContent = ch;
        word.append(c);
      });
      h.append(word);
      if (i < words.length - 1) h.append(' ');
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.Shopify?.designMode) {
      sec.classList.add('is-typed');
      return;
    }
    sec.classList.add('is-armed');
    const chars = $$('.tw__c', h);
    const last = $('.tw__w--last', h);
    let i = 0, started = false;
    const finish = () => {
      setTimeout(() => sec.classList.add('is-typed'), 120);
      setTimeout(() => last.classList.add('is-shine'), 320);
    };
    const tick = () => {
      chars[i - 1]?.classList.remove('is-cur');
      const c = chars[i++];
      c.classList.add('is-in', 'is-cur');
      if (i >= chars.length) { c.classList.replace('is-cur', 'is-end'); finish(); return; }
      setTimeout(tick, /[.!?,]/.test(c.textContent) ? 340 : 62 + Math.random() * 46);
    };
    const check = () => {
      if (started) return;
      const r = h.getBoundingClientRect();
      if (r.bottom < 0) { /* already scrolled past: show it finished */
        started = true;
        chars.forEach((c) => c.classList.add('is-in'));
        sec.classList.add('is-go', 'is-typed');
      } else if (r.top < innerHeight * 0.82) {
        started = true;
        sec.classList.add('is-go');
        setTimeout(tick, 420);
      }
      if (started) { removeEventListener('scroll', check); removeEventListener('resize', check); }
    };
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    check();
  });

  /* ---- tabs ---- */
  $$('[data-tabs]').forEach((w) => {
    const tabs = $$('[data-tab]', w), panels = $$('[data-tabpanel]', w);
    tabs.forEach((t) => t.addEventListener('click', () => {
      tabs.forEach((x) => { const on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      panels.forEach((p) => { p.hidden = p.dataset.tabpanel !== t.dataset.tab; if (!p.hidden) $$('[data-rail]', p).forEach((r) => r._update?.()); });
    }));
  });

  /* ---- product gallery: swipe track, thumbs, arrows, counter, full-screen zoom ---- */
  $$('[data-gallery]').forEach((g) => {
    const track = $('[data-gtrack]', g);
    const thumbs = $$('[data-thumb]', g), shots = $$('[data-shot]', g);
    const count = $('[data-gcount]', g);
    if (!track || !shots.length) return;
    let cur = 0;
    const mark = (i) => {
      cur = i;
      thumbs.forEach((x, k) => x.classList.toggle('is-on', k === i));
      shots.forEach((x, k) => x.classList.toggle('is-on', k === i));
      if (count) count.textContent = i + 1;
      thumbs[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    const go = (i, smooth = true) => {
      i = (i + shots.length) % shots.length;
      track.scrollTo({ left: shots[i].offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
      mark(i);
    };
    thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    $('[data-gprev]', g)?.addEventListener('click', () => go(cur - 1));
    $('[data-gnext]', g)?.addEventListener('click', () => go(cur + 1));
    let st;
    track.addEventListener('scroll', () => {
      clearTimeout(st);
      st = setTimeout(() => { const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); if (i !== cur) mark(i); }, 80);
    }, { passive: true });

    const lb = $('[data-lightbox]');
    const zoomable = shots.filter((s) => s.dataset.full);
    if (!lb || !zoomable.length) return;
    const img = $('[data-lb-img]', lb), lbCount = $('[data-lb-count]', lb);
    let li = 0;
    const show = (i) => {
      li = (i + zoomable.length) % zoomable.length;
      const s = zoomable[li];
      img.src = s.dataset.full;
      img.alt = s.querySelector('img')?.alt || '';
      lbCount.textContent = `${li + 1} / ${zoomable.length}`;
    };
    const open = (i) => { show(i); lb.hidden = false; document.body.classList.add('locked'); $('[data-lb-close]', lb).focus({ preventScroll: true }); };
    const close = () => {
      if (lb.hidden) return;
      lb.hidden = true;
      document.body.classList.remove('locked');
      go(shots.indexOf(zoomable[li]), false);
      zoomable[li]?.focus({ preventScroll: true });
    };
    zoomable.forEach((s, k) => s.addEventListener('click', () => open(k)));
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(li - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(li + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(li - 1);
      if (e.key === 'ArrowRight') show(li + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(li + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  });

  /* ---- product spotlight: thumbnails swap the large image ---- */
  $$('[data-spot]').forEach((s) => {
    const stage = $('[data-spot-stage] img', s);
    const thumbs = $$('[data-spot-src]', s);
    thumbs.forEach((b) => b.addEventListener('click', () => {
      if (!stage) return;
      stage.removeAttribute('srcset');
      stage.src = b.dataset.spotSrc;
      stage.alt = b.dataset.spotAlt || '';
      thumbs.forEach((x) => x.classList.toggle('is-on', x === b));
    }));
  });

  /* ---- quick view: loads the product through the Section Rendering API ---- */
  const qvBody = $('[data-qv-body]');
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-quickview]');
    if (!b || !qvBody) return;
    e.preventDefault();
    const url = b.dataset.quickview;
    qvBody.innerHTML = '<p class="modal__loading">Loading</p>';
    openPanel('quickview');
    try {
      const html = await (await fetch(`${url}${url.includes('?') ? '&' : '?'}section_id=quick-view`)).text();
      const qv = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-qv]');
      if (!qv) throw new Error('missing');
      qvBody.replaceChildren(document.importNode(qv, true));
      const t = $('[data-qv-track]', qvBody), dots = $$('[data-qv-dot]', qvBody);
      dots.forEach((d, k) => d.addEventListener('click', () => t.scrollTo({ left: t.clientWidth * k, behavior: 'smooth' })));
      t?.addEventListener('scroll', () => { const i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth)); dots.forEach((d, k) => d.classList.toggle('is-on', k === i)); }, { passive: true });
    } catch {
      qvBody.innerHTML = `<p class="modal__loading">Could not load this product. <a class="textlink" href="${esc(url)}">Open the product page</a></p>`;
    }
  });

  /* ---- recently viewed: kept in this browser only ---- */
  const RECENT = 'fz_recent';
  const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT)) || []; } catch { return []; } };
  const pdpEl = $('[data-recent-handle]');
  if (pdpEl) {
    try {
      const h = pdpEl.dataset.recentHandle;
      localStorage.setItem(RECENT, JSON.stringify([h, ...readRecent().filter((x) => x !== h)].slice(0, 12)));
    } catch { /* storage blocked: nothing to remember */ }
  }
  const recentCard = (p) => {
    const v = (p.variants || [])[0] || {};
    const img = p.featured_image ? `<img src="${esc(p.featured_image)}" alt="${esc(p.title)}" loading="lazy" width="1254" height="1254">` : PH;
    const off = p.compare_at_price > p.price ? Math.round(((p.compare_at_price - p.price) * 100) / p.compare_at_price) : 0;
    return `<div class="rail__item"><article class="pc">
      <div class="pc__media"><a class="pc__link" href="${esc(p.url)}" aria-label="${esc(p.title)}"><div class="slot slot--product">${img}</div></a>${off ? `<span class="pc__badge">${off}% off</span>` : ''}
        <button class="pc__qv" type="button" data-quickview="${esc(p.url)}" aria-label="Quick view ${esc(p.title)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><span>Quick view</span></button></div>
      <div class="pc__body"><h3 class="pc__name"><a href="${esc(p.url)}">${esc(p.title)}</a></h3><p class="pc__meta">${esc(p.type || '')}</p>
        <div class="pc__foot"><span class="price"><span class="price__now">${money(p.price)}</span>${off ? `<s class="price__was">${money(p.compare_at_price)}</s>` : ''}</span>
        ${v.available === false ? '<span class="pc__out">Sold out</span>' : `<button class="pc__add" type="button" data-add="${v.id}" aria-label="Add ${esc(p.title)} to cart">Add</button>`}</div></div>
    </article></div>`;
  };
  $$('[data-recent]').forEach(async (sec) => {
    const handles = readRecent().filter((h) => h !== pdpEl?.dataset.recentHandle).slice(0, 10);
    if (!handles.length) return;
    const list = (await Promise.all(handles.map((h) => fetch(`/products/${h}.js`).then((r) => (r.ok ? r.json() : null)).catch(() => null)))).filter(Boolean);
    if (!list.length) return;
    $('[data-recent-track]', sec).innerHTML = list.map(recentCard).join('');
    sec.hidden = false;
    $('[data-rail]', sec)?._update?.();
    $('[data-recent-clear]', sec)?.addEventListener('click', () => { try { localStorage.removeItem(RECENT); } catch { /* ignore */ } sec.hidden = true; });
  });

  /* ---- key ingredient chips ---- */
  $$('[data-keying]').forEach((k) => {
    const chips = $$('[data-ing]', k), notes = $$('[data-ing-d]', k);
    chips.forEach((c) => c.addEventListener('click', () => {
      chips.forEach((x) => x.classList.toggle('is-on', x === c));
      notes.forEach((n) => { n.hidden = n.dataset.ingD !== c.dataset.ing; });
    }));
  });

  /* ---- quantity ---- */
  $$('[data-qty]').forEach((q) => {
    const i = $('input', q);
    $('[data-qty-dec]', q).addEventListener('click', () => { i.value = Math.max(1, Number(i.value) - 1); });
    $('[data-qty-inc]', q).addEventListener('click', () => { i.value = Number(i.value) + 1; });
  });

  /* ---- collection filter + sort ---- */
  $$('[data-filter]').forEach((f) => {
    const pills = $$('[data-filter-type]', f), cards = $$('.pc', $('[data-filter-grid]', f));
    const count = $('[data-filter-count]', f), empty = $('[data-filter-empty]', f);
    const apply = (type) => {
      let shown = 0;
      cards.forEach((c) => { const on = !type || c.dataset.type === type; c.hidden = !on; if (on) shown++; });
      pills.forEach((p) => p.classList.toggle('is-on', p.dataset.filterType === type));
      count.textContent = shown;
      empty.hidden = shown > 0;
    };
    pills.forEach((p) => p.addEventListener('click', () => {
      apply(p.dataset.filterType);
      const u = new URL(location.href);
      if (p.dataset.filterType) u.searchParams.set('type', p.dataset.filterType); else u.searchParams.delete('type');
      history.replaceState(null, '', u);
    }));
    const initial = new URL(location.href).searchParams.get('type');
    if (initial && pills.some((p) => p.dataset.filterType === initial)) apply(initial);
    $('[data-sort]', f)?.addEventListener('change', (e) => {
      const u = new URL(location.href);
      u.searchParams.set('sort_by', e.target.value);
      location.href = u;
    });
  });

  /* ---- cart ---- */
  const headers = { 'content-type': 'application/json', accept: 'application/json' };
  async function getCart() { return (await fetch('/cart.js', { headers: { accept: 'application/json' } })).json(); }
  function lineHTML(l, i) {
    const img = l.image ? `<img src="${esc(l.image)}" alt="" loading="lazy" width="96" height="96">` : PH;
    return `<div class="line" data-line="${i + 1}">
      <a class="line__img slot slot--thumb" href="${esc(l.url)}" aria-label="${esc(l.product_title)}">${img}</a>
      <div class="line__body">
        <a class="line__t" href="${esc(l.url)}">${esc(l.product_title)}</a>
        <div class="line__row">
          <div class="qty qty--s">
            <button type="button" data-line-dec aria-label="Decrease quantity"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
            <span aria-live="polite">${l.quantity}</span>
            <button type="button" data-line-inc aria-label="Increase quantity"><svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <strong>${money(l.final_line_price)}</strong>
        </div>
        <button class="line__rm" type="button" data-line-rm>Remove</button>
      </div>
    </div>`;
  }
  function paint(cart) {
    $$('[data-cart-count]').forEach((n) => { n.textContent = cart.item_count; n.hidden = cart.item_count === 0; });
    $$('[data-cart-count-label]').forEach((n) => { n.textContent = cart.item_count ? `(${cart.item_count})` : ''; });
    $$('[data-cart-total]').forEach((n) => { n.textContent = money(cart.total_price); });
    $$('[data-cart-items]').forEach((b) => {
      b.innerHTML = cart.items.length
        ? cart.items.map(lineHTML).join('')
        : `<div class="empty"><p>Your cart is empty.</p><a class="btn" href="/collections/all">Shop all products</a></div>`;
    });
    $$('[data-cart-foot]').forEach((f) => { f.hidden = !cart.items.length; });
    /* "Pairs well with": up to three bestsellers that are not already in the cart */
    const inCart = new Set(cart.items.map((i) => String(i.variant_id)));
    $$('[data-ups]').forEach((u) => {
      let shown = 0;
      $$('[data-ups-item]', u).forEach((it) => { const on = cart.items.length > 0 && !inCart.has(it.dataset.upsItem) && shown < 3; it.hidden = !on; if (on) shown++; });
      u.hidden = shown === 0;
    });
    $$('[data-ship]').forEach((s) => {
      s.hidden = !cart.items.length;
      const gap = FZ.freeShip - cart.total_price;
      $('[data-ship-msg]', s).textContent = gap > 0 ? `Add ${money(gap)} more for free shipping` : 'You have unlocked free shipping';
      $('[data-ship-bar]', s).style.width = `${Math.min(100, (cart.total_price / FZ.freeShip) * 100)}%`;
    });
  }
  async function refresh() { paint(await getCart()); }
  async function addItems(items, btn) {
    const iconOnly = !!btn?.querySelector('svg') && !btn.textContent.trim();
    const label = btn?.textContent;
    if (btn) { btn.disabled = true; if (!iconOnly) btn.textContent = 'Adding'; }
    try {
      const r = await fetch(FZ.routes.add || '/cart/add.js', { method: 'POST', headers, body: JSON.stringify({ items }) });
      if (!r.ok) throw new Error((await r.json()).description || 'Could not add to cart');
      await refresh();
      openPanel('cart');
    } catch (err) {
      toast(err.message || 'Could not add to cart. Please try again.');
      if (btn && !iconOnly) { btn.textContent = 'Try again'; setTimeout(() => { btn.textContent = label; }, 1800); }
      return false;
    } finally {
      if (btn) { btn.disabled = false; if (!iconOnly && btn.textContent === 'Adding') btn.textContent = label; }
    }
    return true;
  }
  async function changeLine(line, quantity) {
    const r = await fetch(FZ.routes.change || '/cart/change.js', { method: 'POST', headers, body: JSON.stringify({ line, quantity }) });
    paint(await r.json());
  }

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) { e.preventDefault(); addItems([{ id: Number(add.dataset.add), quantity: 1 }], add); return; }
    const many = e.target.closest('[data-add-many]');
    if (many) { addItems(many.dataset.addMany.split(',').filter(Boolean).map((id) => ({ id: Number(id), quantity: 1 })), many); return; }
    const row = e.target.closest('[data-line]');
    if (row) {
      const line = Number(row.dataset.line);
      const q = Number($('.qty span', row).textContent);
      if (e.target.closest('[data-line-inc]')) changeLine(line, q + 1);
      else if (e.target.closest('[data-line-dec]')) changeLine(line, q - 1);
      else if (e.target.closest('[data-line-rm]')) changeLine(line, 0);
    }
  });

  $$('form.buy').forEach((form) => {
    const items = () => [{ id: Number(form.elements.id.value), quantity: Math.max(1, Number(form.elements.quantity.value) || 1) }];
    form.addEventListener('submit', (e) => { e.preventDefault(); addItems(items(), $('[data-add-form]', form)); });
    $('[data-buy-now]', form)?.addEventListener('click', async (e) => {
      const b = e.currentTarget;
      b.disabled = true;
      const r = await fetch(FZ.routes.add || '/cart/add.js', { method: 'POST', headers, body: JSON.stringify({ items: items() }) });
      if (r.ok) location.href = '/checkout'; else b.disabled = false;
    });
  });

  /* ---- sticky buy bar ---- */
  const bar = $('[data-stickybuy]'), buy = $('form.buy');
  if (bar && buy) {
    const check = () => { bar.hidden = buy.getBoundingClientRect().bottom > 0; };
    addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ---- predictive search ---- */
  const input = $('[data-search-input]'), results = $('[data-search-results]');
  if (input && results) {
    const initial = results.innerHTML;
    let t, seq = 0;
    input.addEventListener('input', () => {
      clearTimeout(t);
      const q = input.value.trim();
      if (!q) { results.innerHTML = initial; return; }
      t = setTimeout(async () => {
        const mine = ++seq;
        const u = `${FZ.routes.suggest || '/search/suggest.json'}?q=${encodeURIComponent(q)}&resources[type]=product,collection&resources[limit]=6`;
        const data = await (await fetch(u)).json();
        if (mine !== seq) return;
        const { products = [], collections = [] } = data.resources.results;
        if (!products.length && !collections.length) { results.innerHTML = `<p class="sov__none">No results for “${esc(q)}”.</p>`; return; }
        results.innerHTML = `
          ${collections.length ? `<p class="sov__label">Collections</p><div class="chips">${collections.map((c) => `<a class="chip" href="${esc(c.url)}">${esc(c.title)}</a>`).join('')}</div>` : ''}
          ${products.length ? `<p class="sov__label">Products</p><div class="sov__list">${products.map((p) => `<a class="sov__item" href="${esc(p.url)}"><span class="slot slot--thumb">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : PH}</span><span><strong>${esc(p.title)}</strong><em>₹${Math.round(Number(p.price)).toLocaleString('en-IN')}</em></span></a>`).join('')}</div>` : ''}
          <a class="textlink" href="/search?q=${encodeURIComponent(q)}&type=product">See all results</a>`;
      }, 180);
    });
  }

  refresh();
})();
