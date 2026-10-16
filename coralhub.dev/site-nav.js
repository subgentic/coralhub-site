// Site navigation: click/tap/keyboard menus (no hover-only access), the phone menu, and the old root anchors.
(function () {
  'use strict';
  // /#download, /#pricing and the other Coral-page anchors used to live on the root page: send those visitors to the Coral page, same anchor.
  var legacy = { '#download': 1, '#pricing': 1, '#features': 1, '#compare': 1, '#harness': 1 };
  if (document.documentElement.getAttribute('data-legacy-anchors') === '1' && legacy[location.hash]) {
    location.replace('/coral.html' + location.hash);
    return;
  }
  var nav = document.querySelector('.snav');
  if (!nav) return;
  var tops = nav.querySelectorAll('button.snav-top');
  var toggle = nav.querySelector('.snav-toggle');
  var menu = nav.querySelector('.snav-menu');
  function closeAll(except) {
    tops.forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      var s = document.getElementById(b.getAttribute('aria-controls'));
      if (s) s.hidden = true;
    });
  }
  tops.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = b.getAttribute('aria-expanded') === 'true';
      closeAll(b);
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.getElementById(b.getAttribute('aria-controls')).hidden = open;
    });
  });
  if (toggle) toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openTop = nav.querySelector('button.snav-top[aria-expanded="true"]');
    closeAll();
    if (openTop) openTop.focus();
    if (menu && menu.classList.contains('is-open') && toggle) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
})();
