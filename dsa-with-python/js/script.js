// Highlight code blocks on page load
document.addEventListener('DOMContentLoaded', function() {
    hljs.highlightAll();
});

// Hamburger menu toggle
document.querySelector('.hamburger')?.addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
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
