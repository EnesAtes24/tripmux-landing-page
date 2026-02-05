import { bindEvents } from "./ui/events.js";

bindEvents();

// ===== NAVBAR HAMBURGER MENU =====
const burger = document.querySelector('.tmx-burger');
const mobileMenu = document.querySelector('.tmx-mobile-menu');
const mobileLinks = document.querySelectorAll('.tmx-mobile-link, .tmx-mobile-cta');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.hidden = isExpanded;
    });

    // Close menu when clicking on a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        }
    });
}
