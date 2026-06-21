// Navegação suave nos links de menu e botões
document.querySelectorAll('.nav-item, .hero-cta').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetSelector = link.getAttribute('href') || '#';
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
