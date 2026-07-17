/* ═══════════════════════════════════════════════════════
   AI IDEAS — external initialiser
   Loaded via <script src> from ai-ideas-shell.html
   External scripts ARE executed even after innerHTML injection.
   v3 — fix for innerHTML script-blocking browser rule
═══════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* guard: only run once even if script tag is cloned */
  if (window.__aiIdeasInit) return;
  window.__aiIdeasInit = true;

  /* ── card registry ── */
  var BIZ = [
    'sections/ai-cards/motor.html',
    'sections/ai-cards/health.html',
    'sections/ai-cards/life.html',
    'sections/ai-cards/property.html',
    'sections/ai-cards/commercial.html',
    'sections/ai-cards/sme.html',
    'sections/ai-cards/marine.html',
    'sections/ai-cards/travel.html',
    'sections/ai-cards/cyber.html',
    'sections/ai-cards/agri.html',
    'sections/ai-cards/reinsurance.html',
    'sections/ai-cards/embedded.html'
  ];
  var SUP = [
    'sections/ai-cards/sup-underwriting.html',
    'sections/ai-cards/sup-actuarial.html',
    'sections/ai-cards/sup-cx.html',
    'sections/ai-cards/sup-claims-ops.html',
    'sections/ai-cards/sup-compliance.html',
    'sections/ai-cards/sup-marketing.html',
    'sections/ai-cards/sup-it.html',
    'sections/ai-cards/sup-hr.html'
  ];

  var _status = 'all';
  var _search = '';
  var _supLoaded = false;

  /* ── toggle ── */
  function attachToggle(card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');
    var body = card.querySelector('.ai-bl-body');
    if (body) {
      body.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    card.addEventListener('click', function() { toggleCard(card); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(card); }
    });
  }

  function toggleCard(card) {
    var wasOpen = card.classList.contains('open');
    var grid = card.closest('.ai-bl-grid');
    if (grid) {
      grid.querySelectorAll('.ai-bl-card.open').forEach(function(c) {
        c.classList.remove('open');
        c.setAttribute('aria-expanded', 'false');
      });
    }
    if (!wasOpen) {
      card.classList.add('open');
      card.setAttribute('aria-expanded', 'true');
      setTimeout(function() {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
    _applyFilters();
  }

  /* ── load cards via fetch ── */
  function loadCards(list, gridId) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    list.forEach(function(url) {
      fetch(url)
        .then(function(r) { return r.ok ? r.text() : null; })
        .then(function(html) {
          if (!html) return;
          var wrap = document.createElement('div');
          wrap.innerHTML = html.trim();
          var card = wrap.firstElementChild;
          if (card && card.classList.contains('ai-bl-card')) {
            attachToggle(card);
            _applyCardVisibility(card);
            grid.appendChild(card);
          }
        })
        .catch(function() {});
    });
  }

  /* load biz cards on boot */
  loadCards(BIZ, 'ai-biz-grid');

  /* ── filters ── */
  function _applyCardVisibility(card) {
    var matchSearch = !_search || card.textContent.toLowerCase().indexOf(_search) !== -1;
    card.style.display = matchSearch ? '' : 'none';
    if (!matchSearch) return;
    card.querySelectorAll('.ai-idea').forEach(function(row) {
      row.style.display = (_status === 'all' || row.dataset.status === _status) ? '' : 'none';
    });
    if (_search) card.classList.add('open');
  }

  function _applyFilters() {
    document.querySelectorAll('.ai-bl-card').forEach(_applyCardVisibility);
    _updateEmpty();
  }

  function _updateEmpty() {
    var e = document.getElementById('ai-empty');
    if (!e) return;
    var visible = Array.from(document.querySelectorAll('.ai-bl-card')).filter(function(c) {
      return c.style.display !== 'none';
    });
    e.classList.toggle('show', visible.length === 0);
  }

  /* ── status filter chips ── */
  document.querySelectorAll('.ai-fchip').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ai-fchip').forEach(function(b) { b.classList.remove('on'); });
      btn.classList.add('on');
      _status = btn.dataset.status || 'all';
      _applyFilters();
    });
  });

  /* ── search ── */
  var searchEl = document.getElementById('ai-search');
  if (searchEl) {
    searchEl.addEventListener('input', function() {
      _search = this.value.trim().toLowerCase();
      _applyFilters();
    });
  }

  /* ── category tabs ── */
  document.querySelectorAll('.ai-cat-chip').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ai-cat-chip').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.cat;
      var bw = document.getElementById('ai-business-wrap');
      var sw = document.getElementById('ai-support-wrap');
      if (cat === 'business') {
        bw.style.display = ''; sw.style.display = 'none';
      } else if (cat === 'support') {
        bw.style.display = 'none'; sw.style.display = '';
        if (!_supLoaded) { _supLoaded = true; loadCards(SUP, 'ai-sup-grid'); }
      } else {
        bw.style.display = ''; sw.style.display = '';
        if (!_supLoaded) { _supLoaded = true; loadCards(SUP, 'ai-sup-grid'); }
      }
      _updateEmpty();
    });
  });

})();
