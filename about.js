/* ========================================= MCA PROJECT TEAM Global JavaScript ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================== DARK / LIGHT MODE ====================================== */
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("mca-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "☀️";
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("mca-theme", isDark ? "dark" : "light");
            themeToggle.textContent = isDark ? "☀️" : "🌙";
        });
    }

    /* ===================================== SEARCH ====================================== */
    const searchInput = document.querySelector(".search-box input");
    const memberCards = document.querySelectorAll(".member-card");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            let visible = 0;
            memberCards.forEach((card) => {
                const cardText = card.textContent.toLowerCase();
                const show = cardText.includes(query);
                card.style.display = show ? "" : "none";
                if (show) visible++;
            });
            /* Show empty-state message when nothing matches */
            let emptyState = document.getElementById("searchEmpty");
            if (!emptyState) {
                emptyState = document.createElement("p");
                emptyState.id = "searchEmpty";
                emptyState.style.cssText =
                    "text-align:center;color:var(--text-muted);padding:30px;grid-column:1/-1;";
                emptyState.textContent = "No team members match your search.";
                document.querySelector(".team-grid")?.appendChild(emptyState);
            }
            emptyState.style.display = visible === 0 ? "" : "none";
        });
    }

    /* ===================================== MEMBER CARD CLICK EFFECT ====================================== */
    memberCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            /* Don't trigger if a social link was clicked */
            if (event.target.closest(".social-link")) return;
            card.classList.toggle("selected");
        });
    });

    /* ===================================== SMOOTH INTERNAL LINKS ====================================== */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /* ===================================== AUTH-AWARE DASHBOARD LINK ====================================== */
    /*
     * About, Services and Contact are PUBLIC pages — no login needed.
     * The Dashboard sidebar link is only shown when the user is logged in.
     */
    const dashboardNavLink = document.getElementById("dashboardNavLink");
    if (dashboardNavLink) {
        const token = localStorage.getItem("authToken");
        if (!token) {
            dashboardNavLink.style.display = "none";
        }
    }

    /* ===================================== ACTIVE NAV ITEM ====================================== */
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-item").forEach((item) => {
        const href = item.getAttribute("href");
        if (href && href.split("/").pop() === currentPage) {
            item.classList.add("active");
        }
    });

    /* ===================================== INTERSECTION ANIMATION ====================================== */
    /*
     * Inject hidden-state CSS BEFORE setting inline styles so cards
     * are hidden from paint, not from a JS tick — eliminates flicker.
     */
    const animationStyle = document.createElement("style");
    animationStyle.textContent = `
        .member-card,
        .ownership-section {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity .5s ease, transform .5s ease;
        }
        .member-card.visible,
        .ownership-section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .member-card.selected {
            box-shadow:
                0 0 0 3px rgba(7, 95, 93, .12),
                0 18px 40px rgba(25, 64, 84, .12);
        }
    `;
    document.head.appendChild(animationStyle);

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    document
        .querySelectorAll(".member-card, .ownership-section")
        .forEach((card) => observer.observe(card));
});
