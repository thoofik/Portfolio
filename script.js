// Load elements after page is ready
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen after a delay
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1500);
  }

  // Initialize Typed.js
  new Typed('.typing', {
    strings: ['Thoofik Usmaan A', 'a Software Engineer', 'a Web Developer', 'a Problem Solver'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true,
    backDelay: 2000
  });

  // Create stars for background
  createStars();

  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString();
  }

  // Animate skill bars when about section is in view
  const skillBars = document.querySelectorAll('.skill-progress');
  const aboutSection = document.getElementById('about');

  if (aboutSection && skillBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillBars.forEach((bar) => {
          const width = bar.getAttribute('data-width');
          if (width) {
            bar.style.width = `${width}%`;
          }
        });
        observer.unobserve(aboutSection);
      }
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
  }

  // Handle card hover effects
  document.querySelectorAll('.project-card, .about-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / card.offsetWidth) * 100;
      const y = ((e.clientY - rect.top) / card.offsetHeight) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });

    // Reset the effect when mouse leaves the card
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const navLinks = document.querySelectorAll('#nav-menu a');

  function toggleMenu() {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  mobileMenuToggle.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Skill Progress Animation
  const observeSkills = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute('data-width');
          progressBar.style.width = `${targetWidth}%`;
          observer.unobserve(progressBar);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  };

  // Initialize skill animations
  document.addEventListener('DOMContentLoaded', observeSkills);

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(lazyLoadScript);
  }

  // Initialize keyboard navigation
  initKeyboardNav();
});

// Create stars background
function createStars() {
  const starsContainer = document.getElementById('stars-container');
  if (!starsContainer) return;

  starsContainer.innerHTML = '';

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const starCount = Math.floor((screenWidth * screenHeight) / 3000);

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Random size between 1-3px
    const size = Math.random() * 2 + 1;

    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;

    // Random opacity
    const opacity = Math.random() * 0.7 + 0.3;

    // Apply styles
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;
    star.style.opacity = opacity.toString();

    starsContainer.appendChild(star);
  }
}

// Recreate stars on window resize
window.addEventListener('resize', createStars);

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      // Add smooth scrolling animation
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update URL without jumping
      window.history.pushState(null, null, this.getAttribute('href'));
    }
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const headerHeight = header.offsetHeight;
    
    if (targetElement) {
      // Add extra offset for skills section to ensure it's visible
      const extraOffset = targetId === '#skills-section' ? 20 : 0;
      
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight - extraOffset,
        behavior: 'smooth'
      });
    }
  });
});

// Update active link based on scroll position
function updateActiveLink() {
  const scrollPosition = window.scrollY + 100; // Offset for header
  
  // Special case for when we're at the bottom of the page
  const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
  
  if (isAtBottom) {
    // When at bottom, activate the last nav item (Contact)
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === "#contact") {
        link.classList.add('active');
      }
    });
    return;
  }

  // Check each section and the skills section
  const sections = document.querySelectorAll('section[id], #skills-section');
  let currentSection = null;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
      currentSection = section.id;
      // Special case for skills section
      if (section.id === 'skills-section') {
        document.querySelector('nav a[href="#skills-section"]')?.classList.add('active');
      }
    }
  });
  
  if (currentSection) {
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveLink);
// Update active link on page load
document.addEventListener('DOMContentLoaded', updateActiveLink);

// Scroll to Top & Sticky Navigation
const scrollToTopBtn = document.getElementById('scrollToTop');
const header = document.querySelector('.header');
let lastScrollPosition = 0;

window.addEventListener('scroll', () => {
  // Scroll to Top Button visibility
  if (window.scrollY > 500) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }

  // Sticky Navigation hide/show on scroll
  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollPosition = currentScrollPosition;
});

// Smooth scroll to top
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Keyboard Navigation
function initKeyboardNav() {
  // Handle keyboard navigation for the main menu
  const menuItems = document.querySelectorAll('nav a');
  menuItems.forEach((item, index) => {
    item.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          menuItems[(index + 1) % menuItems.length].focus();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          menuItems[index === 0 ? menuItems.length - 1 : index - 1].focus();
          break;
        case 'Home':
          e.preventDefault();
          menuItems[0].focus();
          break;
        case 'End':
          e.preventDefault();
          menuItems[menuItems.length - 1].focus();
          break;
      }
    });
  });

  // Handle keyboard navigation for certification items
  const certItems = document.querySelectorAll('.certification-item');
  certItems.forEach((item, index) => {
    item.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          item.querySelector('.cert-link').click();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (index < certItems.length - 1) {
            certItems[index + 1].focus();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (index > 0) {
            certItems[index - 1].focus();
          }
          break;
      }
    });
  });

  // Handle Escape key for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileMenu = document.getElementById('nav-menu');
      if (mobileMenu.classList.contains('active')) {
        toggleMenu();
      }
    }
  });
}

// Optimize scroll performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      // Scroll-based updates
      updateActiveLink();
      toggleScrollButton();
    }, 100);
  }
}, { passive: true });

// Performance optimized scroll button visibility
function toggleScrollButton() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (window.scrollY > 500) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
}

// Optimize animations for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--animation-duration', '0s');
} 