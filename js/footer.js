// Loads footer.html into #site-footer, then sets up theme toggle + year
(function () {
  var host = document.getElementById('site-footer');
  if (!host) return;

  fetch(host.getAttribute('data-src') || 'footer.html')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (html) {
      host.innerHTML = html;
      initFooter();
    })
    .catch(function (err) {
      console.error('Footer could not load. Run the site with a local server (e.g. VS Code Live Server) instead of opening the file directly.', err);
    });

  function initFooter() {
    var root = document.documentElement;
    var btn = document.getElementById('themeBtn');
    var KEY = 'footer-theme';

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));

    if (btn) btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }
})();