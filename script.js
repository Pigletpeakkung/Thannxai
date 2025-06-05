// Lightbox Functions
function openLightbox(url) {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  lightbox.style.display = 'flex';
  image.src = url;
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.getElementById('install-pwa');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.style.display = 'none';
  }
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Scroll Animations
  gsap.utils.toArray('.project-card, .blog-card, .feature-box').forEach(element => {
    gsap.fromTo(element, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: element, start: 'top 85%' } }
    );
  });

  // Hero Section
  const heroTitle = document.querySelector('.hero h1');
  const heroButtons = document.querySelectorAll('.hero-actions a');

  if (heroTitle) {
    gsap.fromTo(heroTitle, 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.3 }
    );
  }

  if (heroButtons.length) {
    gsap.fromTo(heroButtons, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, delay: 0.6 }
    );
  }

  // Hover Effects
  document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3 });
    });
  });

  // Contact Form Animation
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    gsap.to(document.getElementById('contact-form'), {
      scale: 1.02,
      yoyo: true,
      repeat: 1,
      duration: 0.3
    });
  });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registered', reg);
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(err => console.log('Service Worker registration failed', err));
  });
}
