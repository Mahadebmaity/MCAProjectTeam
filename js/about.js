/* ========================================= MCA PROJECT TEAM Global JavaScript ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* ===================================== DARK / LIGHT MODE ====================================== */
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("mca-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark =
                document.body.classList.contains("dark-mode");
            localStorage.setItem(
                "mca-theme",
                isDark ? "dark" : "light"
            );
            themeToggle.textContent =
                isDark ? "☀️" : "🌙";
        });
    }
/* ===================================== SEARCH ====================================== */
    const searchInput =
        document.querySelector(".search-box input");
    const memberCards =
        document.querySelectorAll(".member-card");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();
            memberCards.forEach((card) => {
                const cardText =
                    card.textContent.toLowerCase();
                if (cardText.includes(query)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
    /* ===================================== MEMBER CARD CLICK EFFECT  ====================================== */
    memberCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            /*
             * Don't trigger if a social link
             * was clicked.
             */
            if (event.target.closest(".social-link")) {
                return;
            }
            card.classList.toggle("selected");
        });
    });
    /* ===================================== SMOOTH INTERNAL LINKS ====================================== */
    const internalLinks =
        document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId =
                link.getAttribute("href");
            if ( !targetId || targetId === "#") {
                return;
            }
            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
    /* =====================================ACTIVE NAV ITEM====================================== */
    const currentPage =
        window.location.pathname
            .split("/")
            .pop();
    document
        .querySelectorAll(".nav-item")
        .forEach((item) => {
            const href =
                item.getAttribute("href");
            if ( href && href === currentPage) {
                item.classList.add("active");
            }
        });
    /* =====================================  INTERSECTION ANIMATION ====================================== */
    const animatedCards =
        document.querySelectorAll(
            ".member-card, .ownership-section"
        );
    const observer =
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08
            }
        );
    animatedCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(18px)";
        card.style.transition =
            "opacity .5s ease, transform .5s ease";
        observer.observe(card);
    });
    /* ===================================== ADD VISIBLE STYLE ====================================== */
    const animationStyle =
        document.createElement("style");
    animationStyle.textContent = `
        .member-card.visible,
        .ownership-section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .member-card.selected {
            box-shadow:
                0 0 0 3px rgba(7, 95, 93, .12),
                0 18px 40px rgba(25, 64, 84, .12);
        } `;
    document.head.appendChild(animationStyle);
});
