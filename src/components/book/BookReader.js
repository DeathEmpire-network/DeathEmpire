/**
 * BookReader.ts - Lógica de navegación del libro interactivo
 * Export: initBookReader()
 */

export function initBookReader() {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    document.documentElement.classList.add('js');
    var book = document.getElementById('loreBook');
    if (!book) return;
    var spreads = Array.prototype.slice.call(book.querySelectorAll('.spread'));
    var total = spreads.length;
    if (!total) return;
    var leaf = document.getElementById('turnLeaf');
    var front = document.getElementById('turnFront');
    var back = document.getElementById('turnBack');
    var progress = document.getElementById('bookProgress');
    var paging = document.getElementById('bookPaging');
    var basePrevLabel = paging?.getAttribute('data-prev-label') || 'Previous';
    var baseNextLabel = paging?.getAttribute('data-next-label') || 'Next';
    var baseTemplate = progress?.textContent || '';
    var current = 1;
    var pending = 1;
    var isTurning = false;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finishedTimer = 0;

    function template(n) {
      var m = baseTemplate.match(/^(.*)(\d+)\s+(of|de)\s+(\d+)(.*)$/);
      if (m) return m[1] + n + ' ' + m[3] + ' ' + total + m[5];
      return 'Opening ' + n + ' of ' + total;
    }

    function leafInner(spreadEl, side) {
      var leaves = spreadEl.querySelectorAll('.leaf-inner');
      return leaves[side === 'left' ? 0 : 1];
    }

    function updateNavButtonsInElement(el, n) {
      var prevBtns = el.querySelectorAll('[data-book-prev]');
      var nextBtns = el.querySelectorAll('[data-book-next]');

      prevBtns.forEach(function(btn) {
        if (n > 1) {
          btn.setAttribute('href', '#opening-' + (n - 1));
          btn.removeAttribute('hidden');
        } else {
          btn.setAttribute('hidden', '');
        }
      });

      nextBtns.forEach(function(btn) {
        if (n < total) {
          btn.setAttribute('href', '#opening-' + (n + 1));
          btn.removeAttribute('hidden');
        } else {
          btn.setAttribute('hidden', '');
        }
      });
    }

    function show(n) {
      spreads.forEach(function (el, i) {
        if (i + 1 === n) el.removeAttribute('hidden');
        else el.setAttribute('hidden', '');
      });
      book.setAttribute('data-current', String(n));
      if (progress) progress.textContent = template(n);

      // Actualizar botones dentro de las páginas
      var prevBtns = book.querySelectorAll('[data-book-prev]');
      var nextBtns = book.querySelectorAll('[data-book-next]');

      prevBtns.forEach(function(btn) {
        if (n > 1) {
          btn.setAttribute('href', '#opening-' + (n - 1));
          btn.removeAttribute('hidden');
        } else {
          btn.setAttribute('hidden', '');
        }
      });

      nextBtns.forEach(function(btn) {
        if (n < total) {
          btn.setAttribute('href', '#opening-' + (n + 1));
          btn.removeAttribute('hidden');
        } else {
          btn.setAttribute('hidden', '');
        }
      });

      // Mantener pager externo para compatibilidad
      if (paging) {
        var prev = paging.querySelector('[data-book-prev]');
        var next = paging.querySelector('[data-book-next]');
        if (n > 1 && prev) {
          prev.setAttribute('href', '#opening-' + (n - 1));
          prev.setAttribute('aria-label', basePrevLabel + ' ' + (n - 1));
          prev.textContent = '← ' + basePrevLabel + ' ' + (n - 1);
        }
        if (n < total && next) {
          next.setAttribute('href', '#opening-' + (n + 1));
          next.setAttribute('aria-label', baseNextLabel + ' ' + (n + 1));
          next.textContent = baseNextLabel + ' ' + (n + 1) + ' →';
        }
      }
      current = n;
    }

    function focusSpread() {
      var h = book.querySelector('.spread:not([hidden]) [data-book-focus]');
      if (h) (h ).focus({ preventScroll: false });
    }

    function finishTurn() {
      if (!isTurning) return;
      isTurning = false;
      window.clearTimeout(finishedTimer);
      if (leaf) {
        leaf.className = 'turn-leaf';
        leaf.hidden = true;
      }
      show(pending);
      var active = spreads[pending - 1];
      if (!reduceMotion && active) {
        active.classList.add('page-enter');
        setTimeout(function () { active.classList.remove('page-enter'); }, 900);
      }
      try {
        var url = new URL(window.location.href);
        url.hash = 'opening-' + pending;
        window.history.replaceState(null, '', url.toString());
      } catch (e) {}
      focusSpread();
    }

    function onAnimationEnd(ev) {
      if (ev.target !== leaf || ev.animationName === 'turn-fade') { finishTurn(); return; }
      finishTurn();
    }
    if (leaf) leaf.addEventListener('animationend', onAnimationEnd);

    function turnTo(n, dir) {
      if (isTurning || n < 1 || n > total || n === current) return;
      pending = n;
      var fromEl = spreads[current - 1];
      var toEl = spreads[n - 1];
      if (reduceMotion) {
        show(n);
        try {
          var url = new URL(window.location.href);
          url.hash = 'opening-' + n;
          window.history.replaceState(null, '', url.toString());
        } catch (e) {}
        focusSpread();
        return;
      }
      isTurning = true;

      // Dispositivos móviles: animación de plegado/desplegado de pergamino (scroll)
      if (window.innerWidth <= 1023) {
        fromEl.classList.add('scroll-fold');
        setTimeout(function() {
          show(n);
          toEl.classList.add('scroll-fold');
          try {
            var url = new URL(window.location.href);
            url.hash = 'opening-' + n;
            window.history.replaceState(null, '', url.toString());
          } catch (e) {}
          focusSpread();
        }, 220);
        setTimeout(function() {
          fromEl.classList.remove('scroll-fold');
          toEl.classList.remove('scroll-fold');
          isTurning = false;
        }, 520);
        return;
      }

      // Escritorio: animación 3D de paso de hoja de libro
      toEl.removeAttribute('hidden');
      updateNavButtonsInElement(toEl, n);
      if (dir === 'next' && front && back && leaf) {
        front.innerHTML = leafInner(fromEl, 'right')?.innerHTML || '';
        back.innerHTML = leafInner(toEl, 'left')?.innerHTML || '';
        leaf.className = 'turn-leaf show from-right';
      } else if (front && back && leaf) {
        front.innerHTML = leafInner(fromEl, 'left')?.innerHTML || '';
        back.innerHTML = leafInner(toEl, 'right')?.innerHTML || '';
        leaf.className = 'turn-leaf show from-left';
      }
      if (leaf) leaf.hidden = false;
      // Seguridad: si animationend no llega, finalizar igualmente.
      window.clearTimeout(finishedTimer);
      finishedTimer = window.setTimeout(finishTurn, 800);
    }

    if (paging) {
      paging.addEventListener('click', function (ev) {
        var a = (ev.target).closest('a');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        var m = href.match(/#opening-(\d+)$/);
        if (!m) return;
        ev.preventDefault();
        var n = parseInt(m[1], 10);
        if (n === current) return;
        turnTo(n, n > current ? 'next' : 'prev');
      });
    }

    // Event listener para botones dentro de las páginas
    book.addEventListener('click', function (ev) {
      var a = (ev.target).closest('a');
      if (!a) return;
      if (!a.hasAttribute('data-book-prev') && !a.hasAttribute('data-book-next')) return;
      var href = a.getAttribute('href') || '';
      var m = href.match(/#opening-(\d+)$/);
      if (!m) return;
      ev.preventDefault();
      var n = parseInt(m[1], 10);
      if (n === current) return;
      turnTo(n, n > current ? 'next' : 'prev');
    });

    (function init() {
      var m = (window.location.hash || '').match(/#opening-(\d+)$/);
      var n = m ? parseInt(m[1], 10) : 1;
      if (!(n >= 1 && n <= total)) n = 1;
      show(n);
    })();
  });
}