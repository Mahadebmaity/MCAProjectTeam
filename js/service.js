/* ===================================================== SERVICES PAGE JAVASCRIPT ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    /* ================================================= DARK / LIGHT MODE ================================================= */
    const themeToggle =  document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("mca-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const dark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    "mca-theme",
                    dark ? "dark" : "light"
                );


                themeToggle.textContent =
                    dark ? "☀️" : "🌙";

            }
        );

    }



    /* =================================================
       SCROLL REVEAL
    ================================================= */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(element);

        }
    );



    /* =================================================
       NUMBER COUNTER
    ================================================= */

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    let countersStarted = false;


    function startCounters() {

        if (countersStarted) {
            return;
        }

        countersStarted = true;


        counters.forEach(
            (counter) => {

                const target =
                    Number(
                        counter.dataset.count
                    );


                let current = 0;


                const increment =
                    target / 60;


                const timer =
                    setInterval(
                        () => {

                            current += increment;


                            if (
                                current >= target
                            ) {

                                current = target;

                                clearInterval(timer);

                            }


                            counter.textContent =
                                Math.floor(current);

                        },
                        20
                    );

            }
        );

    }


    const statsSection =
        document.querySelector(
            ".service-stats"
        );


    if (statsSection) {

        const statsObserver =
            new IntersectionObserver(
                (entries) => {

                    if (
                        entries[0].isIntersecting
                    ) {

                        startCounters();

                        statsObserver.disconnect();

                    }

                },
                {
                    threshold: 0.4
                }
            );


        statsObserver.observe(
            statsSection
        );

    }



    /* =================================================
       SEARCH
    ================================================= */

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    const serviceCards =
        document.querySelectorAll(
            ".service-card"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                serviceCards.forEach(
                    (card) => {

                        const text =
                            card.textContent
                                .toLowerCase();


                        if (
                            text.includes(query)
                        ) {

                            card.style.display =
                                "";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }



    /* =================================================
       SMOOTH SCROLL
    ================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            }
        );



    /* =================================================
       SERVICE CARD TILT EFFECT
    ================================================= */

    const cards =
        document.querySelectorAll(
            ".service-card"
        );


    cards.forEach(
        (card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    /*
                     * Disable tilt on smaller
                     * screens.
                     */

                    if (
                        window.innerWidth < 800
                    ) {
                        return;
                    }


                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        ((y - centerY) /
                            centerY) *-2;
                    const rotateY = ((x - centerX) / centerX) *2;
                    card.style.transform =  ` translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) `;
                }
            );
            card.addEventListener(
                "mouseleave",
                () => {
                    card.style.transform ="";
                }
            );
        }
    );
    /* ================================================= ACTIVE NAVIGATION ================================================= */
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-item").forEach(
            (item) => {
                const href = item.getAttribute("href");
                if (href === currentPage) {
                    item.classList.add("active");}
            }
        );
});