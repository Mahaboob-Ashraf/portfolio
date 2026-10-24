(() => {
  const journey = document.querySelector('.research-journey');
  if (!journey) return;
  const rows = [...journey.querySelectorAll('.research-entry')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let target = 0;
  let measureFrame = 0;
  let motionFrame = 0;
  let lastTime = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const paint = () => journey.style.setProperty('--journey-position', `${current.toFixed(2)}px`);
  function animate(timestamp) {
    motionFrame = 0;
    const elapsed = lastTime ? Math.min(timestamp - lastTime, 64) : 16.67;
    lastTime = timestamp;
    current += (target - current) * (1 - Math.exp(-elapsed / 85));
    paint();
    if (Math.abs(target - current) > .3) motionFrame = requestAnimationFrame(animate);
    else {
      current = target;
      lastTime = 0;
      paint();
    }
  }
  function measure() {
    measureFrame = 0;
    const box = journey.getBoundingClientRect();
    const focus = innerHeight * .52;
    target = Math.max(0, Math.min(box.height, focus - box.top));
    const visible = box.bottom > 0 && box.top < innerHeight;
    rows.forEach(row => {
      const rect = row.getBoundingClientRect();
      row.classList.toggle('is-research-active', rect.top <= focus && rect.bottom > focus);
      row.style.setProperty('--research-progress', clamp((innerHeight * .75 - rect.top) / rect.height).toFixed(4));
    });
    if (!visible || reduced.matches) {
      cancelAnimationFrame(motionFrame);
      motionFrame = 0;
      lastTime = 0;
      current = target;
      paint();
    } else if (!motionFrame) motionFrame = requestAnimationFrame(animate);
  }
  function requestMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  }
  addEventListener('scroll', requestMeasure, { passive: true });
  addEventListener('resize', requestMeasure);
  reduced.addEventListener('change', requestMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(journey);
  document.fonts.ready.then(requestMeasure);
  requestMeasure();
})();
