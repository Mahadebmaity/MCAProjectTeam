// Shared theme controller. Loaded in <head> to restore theme before painting.
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'mca-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  try {
    preference = localStorage.getItem(KEY) || localStorage.getItem('footer-theme');
  } catch (error) { /* Theme still works when storage is unavailable. */ }
  if (preference !== 'dark' && preference !== 'light') preference = null;
  function updateButtons() {
    var dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-theme-toggle], #themeBtn').forEach(function (button) {
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
      if (button.hasAttribute('data-theme-toggle')) { var label = dark ? '☀ Light' : '☾ Dark'; if (button.textContent !== label) button.textContent = label; }
    });
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    updateButtons();
  }
  apply(preference || (media.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', function () {
    updateButtons();
    new MutationObserver(updateButtons).observe(document.body, {childList: true, subtree: true});
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-theme-toggle], #themeBtn')) return;
    preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, preference); } catch (error) {}
    apply(preference);
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY && event.key !== null) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    apply(preference || (media.matches ? 'dark' : 'light'));
  });
  function systemChanged(event) { if (!preference) apply(event.matches ? 'dark' : 'light'); }
  if (media.addEventListener) media.addEventListener('change', systemChanged);
  else media.addListener(systemChanged);
})();
