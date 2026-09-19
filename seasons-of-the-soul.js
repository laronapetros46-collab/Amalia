/* ============================================================
   PETRA — SEASONS OF THE SOUL
   POEM OPEN / CLOSE SYSTEM
============================================================ */


/* ============================================================
   01 — WAIT UNTIL THE HTML HAS LOADED
============================================================ */

document.addEventListener("DOMContentLoaded", function () {


    /* ========================================================
       02 — READ POEM BUTTONS
    ======================================================== */

    const readButtons =
        document.querySelectorAll(".read-button");


    /* ========================================================
       03 — ADD CLICK EVENT TO EVERY READ BUTTON
    ======================================================== */

    readButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const poemID =
                button.getAttribute("data-poem");

            const poem =
                document.getElementById(poemID);


            if (poem) {

                const card =
                    button.closest(".poem-card");

                document.querySelectorAll(".poem-card.selected")
                    .forEach(function (selectedCard) {

                        selectedCard.classList.remove("selected");

                    });

                poem.classList.add("active");

                if (card) {

                    card.classList.add("selected");

                }

            }

        });

    });


    /* ========================================================
       04 — CLOSE BUTTONS
    ======================================================== */

    const closeButtons =
        document.querySelectorAll(".close-button");


    closeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const poem =
                button.closest(".poem-content");


            if (poem) {

                poem.classList.remove("active");

                const card =
                    poem.closest(".poem-card");

                if (card) {

                    card.classList.add("closing");
                    card.classList.remove("selected");

                    setTimeout(function () {

                        card.classList.remove("closing");

                    }, 600);

                }

            }

        });

    });


    /* ========================================================
       05 — ESCAPE KEY
    ======================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            const openPoem =
                document.querySelector(
                    ".poem-content.active"
                );


            if (openPoem) {

                openPoem.classList.add("closing");
                openPoem.classList.remove("active");

                const card =
                    openPoem.closest(".poem-card");

                if (card) {

                    card.classList.add("closing");
                    card.classList.remove("selected");

                    setTimeout(function () {

                        openPoem.classList.remove("closing");
                        card.classList.remove("closing");

                    }, 600);

                }

            }

        }

    });

});