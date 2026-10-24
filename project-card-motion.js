// Shared by the homepage and the project gallery.
(() => {
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const projects = document.querySelectorAll('.showcase-project');
projects.forEach((project, index) => {
  const card = project.querySelector('.showcase-card');
  const cursor = card.querySelector('.view-cursor');
  const ringId = `cursor-ring-${index}`;
  cursor.innerHTML = `<svg class="cursor-ring" viewBox="0 0 100 100" focusable="false"><defs><path id="${ringId}" d="M50 50m0-40a40 40 0 1 1 0 80a40 40 0 1 1 0-80"/></defs><g class="orbit"><text textLength="251" lengthAdjust="spacing"><textPath href="#${ringId}" dominant-baseline="hanging">VIEW · EXPLORE · DISCOVER · </textPath></text></g><circle cx="50" cy="50" r="24" fill="none" stroke="#77777c" stroke-width=".7"/><circle cx="50" cy="50" r="3" fill="#25252a"/></svg>`;
  // Keep the stamp in viewport space so the card's clipping and lift cannot cut it off.
  document.body.append(cursor);
  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;
  let hasPosition = false;
  let cursorFrame = 0;
  let previousCursorTime = 0;
  let tiltTimer = 0;
  function animateCursor(timestamp) {
    cursorFrame = 0;
    const elapsed = previousCursorTime ? Math.min(timestamp - previousCursorTime, 64) : 16.67;
    previousCursorTime = timestamp;
    const follow = 1 - Math.exp(-elapsed / 95);
    cursorX += (targetX - cursorX) * follow;
    cursorY += (targetY - cursorY) * follow;
    cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
    if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > .35) {
      cursorFrame = requestAnimationFrame(animateCursor);
    } else {
      previousCursorTime = 0;
    }
  }
  function moveProjectCursor(event) {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const x = event.clientX;
    const y = event.clientY;
    targetX = x;
    targetY = y;
    if (!hasPosition) {
      cursorX = x;
      cursorY = y;
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
      hasPosition = true;
      // Let the lift/reveal finish before adding the separate pointer tilt.
      tiltTimer = setTimeout(() => {
        tiltTimer = 0;
        if (hasPosition) card.classList.add('is-tilt-ready');
      }, card.querySelectorAll('.showcase-screen').length > 1 ? 875 : 700);
    }
    card.classList.add('is-pointer-active');
    cursor.classList.add('is-active');
    const box = card.getBoundingClientRect();
    const horizontal = Math.max(-.5, Math.min(.5, (x - box.left) / box.width - .5));
    const vertical = Math.max(-.5, Math.min(.5, (y - box.top) / box.height - .5));
    card.style.setProperty('--pointer-yaw', `${(horizontal * 8).toFixed(3)}deg`);
    card.style.setProperty('--pointer-pitch', `${(-vertical * 6).toFixed(3)}deg`);
    if (!cursorFrame) cursorFrame = requestAnimationFrame(animateCursor);
  }
  card.addEventListener('pointerenter', moveProjectCursor);
  card.addEventListener('pointermove', moveProjectCursor);
  function hideProjectCursor() {
    card.classList.remove('is-pointer-active', 'is-tilt-ready');
    cursor.classList.remove('is-active');
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    previousCursorTime = 0;
    clearTimeout(tiltTimer);
    tiltTimer = 0;
    hasPosition = false;
    card.style.removeProperty('--pointer-pitch');
    card.style.removeProperty('--pointer-yaw');
  }
  card.addEventListener('pointerleave', hideProjectCursor);
  card.addEventListener('pointercancel', hideProjectCursor);
  card.addEventListener('click', hideProjectCursor);
  addEventListener('blur', hideProjectCursor);
  reducedMotion.addEventListener('change', hideProjectCursor);
});

})();
