// Loads footer.html into #site-footer, then sets the year.
// Theme is handled globally by theme.js — no separate logic needed here.
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
      var year = document.getElementById('year');
      if (year) year.textContent = new Date().getFullYear();
    })
    .catch(function (err) {
      console.error('Footer could not load. Run the site with a local server (e.g. VS Code Live Server) instead of opening the file directly.', err);
    });
})();