// Highlight code blocks on page load
document.addEventListener('DOMContentLoaded', function() {
    hljs.highlightAll();
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Dropdown menu toggle on mobile
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    if (link) {
        link.addEventListener('click', function(e) {
            // Only prevent default and toggle on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        hamburger?.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Set active nav link based on current page
function setActiveNav() {
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-menu a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation || 
            currentLocation.includes(item.getAttribute('href').split('/')[1])) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

setActiveNav();
