(() => {
  const dock = document.querySelector('.contact-dock');
  if (!dock) return;
  const items = [...dock.querySelectorAll('.contact-network')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const values = items.map(()=>0), velocities = items.map(()=>0);
  let targets = items.map(()=>0), frame = 0, previousTime = 0;
  let focused = -1;
  function paint(now) {
    frame = 0;
    const elapsed = Math.min((now-(previousTime||now))/1000,.032);
    previousTime = now;
    let moving = false;
    items.forEach((item,index)=>{
      // Same spring response as the compact hero dock.
      velocities[index] += (targets[index]-values[index])*450*elapsed;
      velocities[index] *= Math.exp(-26*elapsed);
      values[index] += velocities[index]*elapsed;
      if (Math.abs(values[index]-targets[index])>.001 || Math.abs(velocities[index])>.001) moving = true;
      item.style.setProperty('--contact-growth',Math.max(0,values[index]).toFixed(4));
    });
    if (moving) frame = requestAnimationFrame(paint);
    else previousTime = 0;
  }
  function setTargets(next) {
    if (motion.matches) return;
    targets = next;
    if (!frame) frame = requestAnimationFrame(paint);
  }
  const focusTargets = () => items.map((_,index)=>focused<0 ? 0 : index===focused ? 1 : Math.abs(index-focused)===1 ? .35 : 0);
  dock.addEventListener('pointermove',event=>{
    if (!pointer.matches || event.pointerType!=='mouse') return;
    const box = dock.getBoundingClientRect();
    const x = event.clientX-box.left, y = event.clientY-box.top;
    setTargets(items.map(item=>{
      // Layout coordinates stay steady while the visible tiles lift.
      const dx = x-item.offsetLeft-item.offsetWidth/2;
      const dy = y-item.offsetTop-item.offsetHeight/2;
      return Math.exp(-(dx*dx+dy*dy)/(145*145));
    }));
  });
  dock.addEventListener('pointerleave',()=>setTargets(focusTargets()));
  items.forEach((item,index)=>{
    item.addEventListener('focus',()=>{focused=index;setTargets(focusTargets());});
    item.addEventListener('blur',()=>{focused=-1;setTargets(focusTargets());});
  });
  function reset() {
    cancelAnimationFrame(frame);
    frame = previousTime = 0;
    values.fill(0);velocities.fill(0);targets.fill(0);
    items.forEach(item=>item.style.setProperty('--contact-growth','0'));
  }
  motion.addEventListener('change',reset);
  addEventListener('blur',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
})();
