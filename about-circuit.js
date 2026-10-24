(() => {
  const circuit = document.querySelector('.about-circuit');
  if (!circuit) return;
  const buttons = [...circuit.querySelectorAll('[data-circuit-node]')];
  const connections = [...circuit.querySelectorAll('.circuit-path')];
  const pulses = connections.map(connection => connection.querySelector('.circuit-pulse'));
  const label = circuit.querySelector('[data-circuit-label]');
  const detail = circuit.querySelector('#circuit-detail');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const descriptions = {
    product: ['Working product', 'A useful product connects models, APIs, and data with tests and human judgement.'],
    api: ['APIs · connecting services', 'APIs connect the product to real services. Tests check that those contracts hold.'],
    models: ['Models · interpreting intent', 'Models turn data into predictions or suggestions that the product can use.'],
    data: ['Data · grounding the system', 'Data gives models context and keeps the product’s state consistent.'],
    tests: ['Tests · checking behaviour', 'Tests check API contracts and product behaviour before changes are shipped.'],
    review: ['Human review · keeping control', 'Human judgement reviews important decisions before they become product actions.']
  };
  let hovered = null;
  let focused = null;
  let selected = null;
  let visible = false;
  let lastScroll = scrollY;
  let phase = 0;
  let targetPhase = 0;
  let frame = 0;
  let lastTime = 0;

  // Keep the same connected nodes, with a small change in viewing angle.
  const board = circuit.querySelector('.circuit-board');
  const card = circuit.closest('.workflow-circuit');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  function resetTilt() {
    board.style.removeProperty('--circuit-tilt-x');
    board.style.removeProperty('--circuit-tilt-y');
  }
  card?.addEventListener('pointermove',event => {
    if (motion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX-box.left)/box.width-.5;
    const y = (event.clientY-box.top)/box.height-.5;
    board.style.setProperty('--circuit-tilt-x',`${24-y*7}deg`);
    board.style.setProperty('--circuit-tilt-y',`${x*9}deg`);
  });
  card?.addEventListener('pointerleave',resetTilt);
  motion.addEventListener('change',resetTilt);

  function animate(timestamp) {
    frame = 0;
    if (!visible || motion.matches) return;
    const elapsed = lastTime ? Math.min(timestamp - lastTime, 64) : 16.67;
    lastTime = timestamp;
    phase += (targetPhase - phase) * (1 - Math.exp(-elapsed / 180));
    // Every path is drawn from its source to its destination. Scroll changes
    // packet speed; scrolling upwards never reverses the logical direction.
    pulses.forEach((pulse, index) => {
      pulse.style.strokeDashoffset = String(-(phase + index * 137) % 1000);
    });
    if (targetPhase - phase > .3) frame = requestAnimationFrame(animate);
    else {
      phase = targetPhase;
      lastTime = 0;
      circuit.classList.remove('is-circuit-running');
    }
  }

  function sendPulse(distance) {
    if (!visible || motion.matches) return;
    targetPhase += distance;
    circuit.classList.add('is-circuit-running');
    if (!frame) frame = requestAnimationFrame(animate);
  }

  function highlight() {
    const active = hovered || focused || selected;
    circuit.classList.toggle('has-circuit-focus', Boolean(active));
    const related = new Set();
    connections.forEach(connection => {
      const connected = active === connection.dataset.from || active === connection.dataset.to;
      connection.classList.toggle('is-connected', connected);
      if (connected) {
        related.add(connection.dataset.from);
        related.add(connection.dataset.to);
      }
    });
    buttons.forEach(button => {
      const id = button.dataset.circuitNode;
      button.classList.toggle('is-active', id === active);
      button.classList.toggle('is-related', id !== active && related.has(id));
      button.setAttribute('aria-pressed', String(id === selected));
    });
    const copy = descriptions[active] || ['Connected by design', 'Models, APIs, and data become useful through testing and human judgement.'];
    label.textContent = copy[0];
    detail.textContent = copy[1];
  }

  buttons.forEach(button => {
    const id = button.dataset.circuitNode;
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = id;
      highlight();
      sendPulse(1000);
    });
    button.addEventListener('pointerleave', () => { hovered = null; highlight(); });
    button.addEventListener('focus', () => { focused = id; highlight(); sendPulse(1000); });
    button.addEventListener('blur', () => { focused = null; highlight(); });
    button.addEventListener('click', () => {
      selected = selected === id ? null : id;
      highlight();
      sendPulse(1000);
    });
  });

  addEventListener('scroll', () => {
    const distance = Math.abs(scrollY - lastScroll);
    lastScroll = scrollY;
    // Ignore anchor jumps so returning to the section cannot queue a long run.
    sendPulse(Math.min(distance, 120) * 2.5);
  }, { passive: true });

  function stopMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    targetPhase = phase;
    circuit.classList.remove('is-circuit-running');
  }
  motion.addEventListener('change', stopMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      lastScroll = scrollY;
      if (visible) sendPulse(1000);
      else stopMotion();
    }, { threshold: .15 }).observe(circuit);
  } else visible = true;
})();
