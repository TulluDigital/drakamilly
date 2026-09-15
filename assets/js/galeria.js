(() => {
  const gallery = document.getElementById('case-gallery');
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll('figure')];
  const previous = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');
  const status = document.getElementById('gallery-status');
  let current = 0;
  const positions = () => slides.map(slide => slide.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft - 4);
  function update() {
    const points = positions();
    current = points.reduce((best, point, index) => Math.abs(point - gallery.scrollLeft) < Math.abs(points[best] - gallery.scrollLeft) ? index : best, 0);
    // At the end, the final image is fully visible even when it cannot align left.
    if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2) current = slides.length - 1;
    previous.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2;
    status.textContent = `Imagem ${current + 1} de ${slides.length}`;
  }
  function move(delta) {
    const max = gallery.scrollWidth - gallery.clientWidth;
    const points = [...new Set(positions().map(point => Math.max(0, Math.min(max, point))))];
    const left = delta > 0
      ? (points.find(point => point > gallery.scrollLeft + 2) ?? max)
      : (points.reverse().find(point => point < gallery.scrollLeft - 2) ?? 0);
    gallery.scrollTo({left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  let frame;
  gallery.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }, {passive:true});
  new ResizeObserver(update).observe(gallery);
  document.getElementById('gallery-controls').hidden = false;
  update();
})();
