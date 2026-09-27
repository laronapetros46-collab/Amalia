/* ============================================================
   PETRA — CORE
   Shared across every page. Keeps three small promises:
     1. Remember the guest's name and their chosen theme.
     2. Let them switch between Day and Night at any time.
     3. Offer the turtle once they've settled in to read.
============================================================ */

(function () {

    "use strict";

    const STORAGE_KEY = "petra-guest";


    /* ========================================================
       01 — READ / WRITE THE GUEST RECORD
       { name: "Alex", theme: "night" }
    ======================================================== */

    function loadGuest() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;

        } catch (err) {

            return null;

        }

    }

    function saveGuest(guest) {

        try {

            localStorage.setItem(STORAGE_KEY, JSON.stringify(guest));

        } catch (err) {

            /* Private browsing / storage blocked — the site
               still works, it just won't remember the guest. */

        }

    }

    function clearGuest() {

        try {

            localStorage.removeItem(STORAGE_KEY);

        } catch (err) { /* no-op */ }

    }


    /* ========================================================
       02 — APPLY THEME
    ======================================================== */

    function applyTheme(theme) {

        document.documentElement.setAttribute("data-theme", theme);

        const label = document.querySelector(".theme-toggle .label");
        const icon = document.querySelector(".theme-toggle .icon");

        if (label) {
            label.textContent = theme === "day" ? "Day" : "Night";
        }

        if (icon) {
            icon.textContent = theme === "day" ? "☀" : "☾";
        }

    }


    /* ========================================================
       03 — BUILD THE FIXED NAV (theme toggle + guest chip)
    ======================================================== */

    function buildNav(guest) {

        const nav = document.createElement("div");
        nav.className = "site-nav";

        nav.innerHTML = `
            <button type="button" class="theme-toggle" aria-label="Toggle day and night theme">
                <span class="icon">☾</span>
                <span class="label">Night</span>
            </button>
            <span class="guest-chip" hidden>
                <span class="guest-name"></span>
                · <button type="button" class="switch-guest">not you?</button>
            </span>
        `;

        document.body.appendChild(nav);

        const toggle = nav.querySelector(".theme-toggle");

        toggle.addEventListener("click", function () {

            const current = document.documentElement.getAttribute("data-theme") || "night";
            const next = current === "day" ? "night" : "day";

            applyTheme(next);

            const stored = loadGuest();

            if (stored) {

                stored.theme = next;
                saveGuest(stored);

            }

        });

        const chip = nav.querySelector(".guest-chip");
        const nameEl = nav.querySelector(".guest-name");
        const switchBtn = nav.querySelector(".switch-guest");

        if (guest && guest.name) {

            chip.hidden = false;
            nameEl.textContent = guest.name;

        }

        switchBtn.addEventListener("click", function () {

            clearGuest();
            window.location.reload();

        });

    }


    /* ========================================================
       04 — ENTRY MODAL
       Only appears when there is no saved guest yet.
    ======================================================== */

    function buildEntryModal(onComplete) {

        const veil = document.createElement("div");
        veil.className = "entry-veil";

        veil.innerHTML = `
            <div class="entry-card" role="dialog" aria-modal="true" aria-labelledby="entry-title">

                <p class="eyebrow">PETRA · WELCOME</p>

                <h2 id="entry-title">Before you sit down —</h2>

                <p class="lead">
                    What should we call you, and which corner
                    of the reading room would you like to sit in?
                </p>

                <label class="field-label" for="entry-name">Your name</label>
                <input type="text" id="entry-name" maxlength="24" placeholder="e.g. Amara" autocomplete="off">

                <label class="field-label">Your reading nook</label>

                <div class="nook-options">

                    <div class="nook-option selected" data-theme="day">
                        <img src="images/library.jpg" alt="A sunlit library nook">
                        <span>Golden Hour</span>
                    </div>

                    <div class="nook-option" data-theme="night">
                        <img src="images/cozy-nook.jfif" alt="A candlelit library nook">
                        <span>Firelight</span>
                    </div>

                </div>

                <button type="button" class="entry-submit" disabled>Take a seat</button>

            </div>
        `;

        document.body.appendChild(veil);

        const nameInput = veil.querySelector("#entry-name");
        const options = veil.querySelectorAll(".nook-option");
        const submit = veil.querySelector(".entry-submit");

        let chosenTheme = "day";

        options.forEach(function (option) {

            option.addEventListener("click", function () {

                options.forEach(function (o) { o.classList.remove("selected"); });
                option.classList.add("selected");
                chosenTheme = option.getAttribute("data-theme");

                applyTheme(chosenTheme);

            });

        });

        function refreshSubmit() {
            submit.disabled = nameInput.value.trim().length === 0;
        }

        nameInput.addEventListener("input", refreshSubmit);

        nameInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !submit.disabled) {
                submit.click();
            }

        });

        submit.addEventListener("click", function () {

            const name = nameInput.value.trim();

            if (!name) {
                return;
            }

            const guest = { name: name, theme: chosenTheme };

            saveGuest(guest);
            applyTheme(chosenTheme);

            veil.classList.remove("active");

            window.setTimeout(function () {
                veil.remove();
            }, 500);

            onComplete(guest);

        });

        /* Reveal on the next frame so the CSS transition runs. */

        window.requestAnimationFrame(function () {
            veil.classList.add("active");
        });

        nameInput.focus();

    }


    /* ========================================================
       05 — PERSONAL GREETING
       Drops a small pill under whatever element carries
       [data-greeting-slot], if the page has one.
    ======================================================== */

    function showGreeting(guest) {

        const slot = document.querySelector("[data-greeting-slot]");

        if (!slot || !guest || !guest.name) {
            return;
        }

        const nook = guest.theme === "day" ? "Golden Hour" : "Firelight";

        const existing = slot.querySelector(".personal-greeting");

        if (existing) {
            existing.remove();
        }

        const pill = document.createElement("p");
        pill.className = "personal-greeting";
        pill.textContent = "Welcome back, " + guest.name + " — your " + nook + " nook is ready.";

        slot.appendChild(pill);

    }


    /* ========================================================
       06 — THE TURTLE
       Appears once the guest has scrolled a little way in,
       and carries them back to the top when clicked. Styled
       after "The World Turtle's Almanac" — a shell mandala
       on a deep-ocean backdrop, seen from above.
    ======================================================== */

    function buildTurtle() {

        const button = document.createElement("button");
        button.type = "button";
        button.className = "turtle-button";
        button.setAttribute("aria-label", "Back to the top");

        button.innerHTML = `
            <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">

                <!-- flippers, splayed to the four corners -->
                <ellipse class="flipper" cx="40" cy="10" rx="7" ry="3" transform="rotate(38 40 10)"/>
                <ellipse class="flipper" cx="12" cy="10" rx="7" ry="3" transform="rotate(-38 12 10)"/>
                <ellipse class="flipper" cx="12" cy="42" rx="7" ry="3" transform="rotate(38 12 42)"/>
                <ellipse class="flipper" cx="40" cy="42" rx="7" ry="3" transform="rotate(-38 40 42)"/>

                <!-- head, tucked to one side -->
                <circle class="head" cx="45" cy="26" r="4.3"/>
                <circle class="eye" cx="46.6" cy="24.6" r=".8"/>

                <!-- shell, viewed from above -->
                <circle class="shell-ring" cx="26" cy="26" r="15.4"/>
                <circle class="shell-disc" cx="26" cy="26" r="12.4"/>

                <g class="shell-spoke">
                    <line x1="26" y1="14.4" x2="26" y2="37.6"/>
                    <line x1="14.4" y1="26" x2="37.6" y2="26"/>
                    <line x1="17.4" y1="17.4" x2="34.6" y2="34.6"/>
                    <line x1="34.6" y1="17.4" x2="17.4" y2="34.6"/>
                </g>

                <path class="shell-spiral"
                      d="M26,26 m-3.4,0
                         a3.4,3.4 0 1,1 6.8,0
                         a5.2,5.2 0 1,1 -10.4,0
                         a7,7 0 1,1 14,0"/>

            </svg>
        `;

        document.body.appendChild(button);

        let shown = false;

        window.addEventListener("scroll", function () {

            const pastThreshold = window.scrollY > window.innerHeight * .6;

            if (pastThreshold && !shown) {

                button.classList.add("visible");
                shown = true;

            } else if (!pastThreshold && shown) {

                button.classList.remove("visible");
                shown = false;

            }

        }, { passive: true });

        button.addEventListener("click", function () {

            button.classList.add("departing");

            window.scrollTo({ top: 0, behavior: "smooth" });

            window.setTimeout(function () {
                button.classList.remove("departing");
            }, 700);

        });

    }


    /* ========================================================
       07 — ONE-TIME SETTLE
       Every element marked .settles fades up together, once,
       after everything above has finished getting ready.
    ======================================================== */

    function runSettle() {

        const items = document.querySelectorAll(".settles");

        items.forEach(function (item, index) {

            window.setTimeout(function () {
                item.classList.add("in");
            }, 80 * index);

        });

    }


    /* ========================================================
       08 — BOOT
    ======================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        const guest = loadGuest();

        applyTheme(guest ? guest.theme : "night");

        buildNav(guest);
        buildTurtle();

        if (guest) {

            showGreeting(guest);
            runSettle();

        } else {

            buildEntryModal(function (newGuest) {

                showGreeting(newGuest);
                runSettle();

            });

        }

    });

})();
