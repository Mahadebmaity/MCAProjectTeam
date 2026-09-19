/* ==========================================================================
   NAVBAR + HERO SLIDER  -  navbar-hero.js
   --------------------------------------------------------------------------
   Link it at the end of <body>, after the navbar and hero markup:
     <script src="navbar-hero.js"></script>

   It needs these elements in the HTML:  #siteHeader  and  #hero
   (if one is missing, that part is simply skipped).
   Nothing is added to the global scope (everything is inside one function).
   ========================================================================== */

(function () {
    'use strict';

    var header = document.getElementById('siteHeader');
    var hero = document.getElementById('hero');
    if (header) initNavbar(header);
    if (hero) initHero(hero);

    /* ---------- Navbar ---------- */
    function initNavbar(header) {
        var toggle = header.querySelector('.nb__toggle');
        var links = header.querySelectorAll('.nb__link');
        var desktop = window.matchMedia('(min-width: 900px)');

        function setOpen(open) {
            header.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        toggle.addEventListener('click', function () {
            setOpen(!header.classList.contains('is-open'));
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && header.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
        });

        header.querySelectorAll('.nb__menu a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });

        desktop.addEventListener('change', function (e) { if (e.matches) setOpen(false); });

        // Shadow after scrolling
        function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // Highlight the link for the current page
        var here = location.pathname.split('/').pop() || 'index.html';
        var match = null;
        links.forEach(function (a) {
            var file = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
            if (file && file === here) match = a;
        });
        if (match) {
            links.forEach(function (a) { a.removeAttribute('aria-current'); });
            match.setAttribute('aria-current', 'page');
        }

        // Single-page landing: highlight the link of the section on screen.
        // Sections that don't exist yet are simply skipped.
        if ('IntersectionObserver' in window) {
            var pairs = [];
            links.forEach(function (a) {
                var h = a.getAttribute('href') || '';
                if (h.length > 1 && h.charAt(0) === '#') {
                    var target = document.querySelector(h);
                    if (target) pairs.push({ link: a, target: target });
                }
            });
            if (pairs.length) {
                var spy = new IntersectionObserver(function (entries) {
                    entries.forEach(function (en) {
                        if (!en.isIntersecting) return;
                        pairs.forEach(function (p) {
                            if (p.target === en.target) p.link.setAttribute('aria-current', 'location');
                            else p.link.removeAttribute('aria-current');
                        });
                    });
                }, { rootMargin: '-45% 0px -50% 0px' }); // a section counts when it crosses mid-screen
                pairs.forEach(function (p) { spy.observe(p.target); });
            }
        }
    }

    /* ---------- Hero slider ---------- */
    function initHero(hero) {
        var viewport = hero.querySelector('.hero__viewport');
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dot'));
        var playBtn = hero.querySelector('.hero__play');
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        var index = 0;

        function go(i) {
            index = (i + slides.length) % slides.length;

            slides.forEach(function (s, n) {
                var on = n === index;
                s.classList.toggle('is-active', on);
                s.setAttribute('aria-hidden', String(!on));
                s.inert = !on;
            });

            // Reset the progress animation on the dots
            dots.forEach(function (d) { d.classList.remove('is-active'); d.removeAttribute('aria-current'); });
            void hero.offsetWidth; // force reflow so the animation restarts
            dots[index].classList.add('is-active');
            dots[index].setAttribute('aria-current', 'true');
        }

        function setPlaying(p) {
            hero.dataset.playing = String(p);
            playBtn.setAttribute('aria-label', p ? 'Pause slideshow' : 'Play slideshow');
            viewport.setAttribute('aria-live', p ? 'off' : 'polite');
        }

        // Autoplay is driven by the dot's progress animation: when it ends, go next.
        hero.addEventListener('animationend', function (e) {
            if (e.animationName === 'hero-fill') go(index + 1);
        });

        hero.querySelector('.hero__next').addEventListener('click', function () { go(index + 1); });
        hero.querySelector('.hero__prev').addEventListener('click', function () { go(index - 1); });
        dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); }); });
        playBtn.addEventListener('click', function () { setPlaying(hero.dataset.playing !== 'true'); });

        // Keyboard: left / right arrows while focus is inside the hero
        hero.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { go(index + 1); }
            else if (e.key === 'ArrowLeft') { go(index - 1); }
        });

        // Touch swipe
        var startX = 0, startY = 0, tracking = false, swiped = false;
        viewport.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse') return;
            tracking = true; swiped = false; startX = e.clientX; startY = e.clientY;
        });
        viewport.addEventListener('pointerup', function (e) {
            if (!tracking) return;
            tracking = false;
            var dx = e.clientX - startX, dy = e.clientY - startY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped = true;
                go(index + (dx < 0 ? 1 : -1));
            }
        });
        viewport.addEventListener('pointercancel', function () { tracking = false; });
        viewport.addEventListener('click', function (e) {
            if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; }
        }, true);

        // Pause while the hero is scrolled out of view
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                hero.dataset.inview = String(entries[0].isIntersecting);
            }, { threshold: 0.25 }).observe(hero);
        }

        // Respect "reduce motion": no autoplay, hide the pause button
        function applyMotionPreference() {
            playBtn.hidden = reduce.matches;
            setPlaying(!reduce.matches);
        }
        applyMotionPreference();
        reduce.addEventListener('change', applyMotionPreference);
    }
})();