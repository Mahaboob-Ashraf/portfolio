const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-pill');
const navigationWrap = document.querySelector('.navigation-wrap');
const navLinks = [...document.querySelectorAll('.nav-link')];
const navIndicator = document.createElement('span');
navIndicator.className = 'nav-indicator';
navIndicator.setAttribute('aria-hidden', 'true');
navigation.prepend(navIndicator);
let hoveredNavLink = null;
let focusedNavLink = null;
let activeNavLink = navigation.querySelector('.nav-link.is-active');
let navIntroTimer;
let pendingNavLink = null;
let navScrollTimer;

function navIndicatorTarget() {
  return focusedNavLink || hoveredNavLink || activeNavLink;
}

function finishNavScroll() {
  clearTimeout(navScrollTimer);
  if (!pendingNavLink) return;
  pendingNavLink = null;
  requestProjectUpdate();
}

function settleNavAfterScroll() {
  if (!pendingNavLink) return;
  clearTimeout(navScrollTimer);
  navScrollTimer = setTimeout(finishNavScroll, 160);
}

function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return { text: 'Good morning', icon: '🌅' };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', icon: '☀️' };
  return { text: 'Good evening', icon: '🌙' };
}

function updateNavigationWidth() {
  if (matchMedia('(max-width: 800px)').matches) return;
  navigationWrap.style.setProperty('--nav-width', `${navigation.scrollWidth + 8}px`);
}

function finishNavIntro() {
  clearTimeout(navIntroTimer);
  navigationWrap.classList.remove('is-intro');
  navigation.inert = false;
  navigation.removeAttribute('aria-hidden');
}

const localHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
const greeting = greetingForHour(localHour);
document.querySelector('.nav-greeting-text').textContent = greeting.text;
document.querySelector('.nav-greeting-icon').textContent = greeting.icon;
updateNavigationWidth();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  navigationWrap.classList.add('is-intro');
  navigation.inert = true;
  navigation.setAttribute('aria-hidden', 'true');
  navIntroTimer = setTimeout(finishNavIntro, 1100);
}
document.fonts.ready.then(() => { updateNavigationWidth(); moveNavIndicator(navIndicatorTarget()); });
navigationWrap.addEventListener('pointerdown', finishNavIntro, { once: true });
document.addEventListener('keydown', event => { if (event.key === 'Tab') finishNavIntro(); });

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  navigation.classList.remove('is-open');
}

function setActiveNav(link) {
  if (!link || link === activeNavLink) return;
  activeNavLink = link;
  navLinks.forEach(item => {
    const active = item === link;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  moveNavIndicator(navIndicatorTarget());
}

function moveNavIndicator(link) {
  if (link?.classList.contains('nav-contact')) link = activeNavLink?.classList.contains('nav-contact') ? null : activeNavLink;
  if (!link || matchMedia('(max-width: 800px)').matches) {
    navigation.classList.remove('has-indicator');
    return;
  }
  navIndicator.style.width = `${link.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
  navigation.classList.add('has-indicator');
}

menuButton.addEventListener('click', () => {
  finishNavIntro();
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  navigation.classList.toggle('is-open', opening);
});
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
    closeMenu();
    const destination = new URL(link.href, location.href);
    if (destination.pathname !== location.pathname || !destination.hash) return;
    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    finishNavIntro();
    pendingNavLink = link;
    setActiveNav(link);
    moveNavIndicator(link);
    closeMenu();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    settleNavAfterScroll();
  });
  link.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hoveredNavLink = link;
    moveNavIndicator(navIndicatorTarget());
  });
  link.addEventListener('focus', () => {
    focusedNavLink = link.matches(':focus-visible') ? link : null;
    moveNavIndicator(navIndicatorTarget());
  });
  link.addEventListener('blur', () => {
    if (focusedNavLink === link) focusedNavLink = null;
    moveNavIndicator(navIndicatorTarget());
  });
});
navigation.addEventListener('pointerleave', () => { hoveredNavLink = null; moveNavIndicator(navIndicatorTarget()); });
navigation.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget)) { focusedNavLink = null; moveNavIndicator(navIndicatorTarget()); }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.navigation-wrap')) closeMenu(); });
addEventListener('scroll', settleNavAfterScroll, { passive: true });
addEventListener('wheel', finishNavScroll, { passive: true });
addEventListener('touchstart', finishNavScroll, { passive: true });
addEventListener('popstate', finishNavScroll);
document.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) finishNavScroll();
});
moveNavIndicator(activeNavLink);

const projects = [...document.querySelectorAll('.showcase-project')];
const panelsContainer = document.querySelector('.rail-panels');
const progressBars = [...document.querySelectorAll('.rail-progress span')];
// The ruler, highlights, and card share one palette defined on the project.
const projectColours = projects.map(project => getComputedStyle(project).getPropertyValue('--project-colour').trim());
function updateProjectRuler(index) {
  const ruler = document.querySelector('.rail-progress');
  ruler.style.setProperty('--active-project', index);
  ruler.style.setProperty('--project-colour', projectColours[index]);
  progressBars.forEach((bar, i) => {
    const distance = Math.abs(i - index);
    bar.classList.toggle('is-active', distance === 0);
    bar.style.setProperty('--tick-scale', [1, .58, .34][Math.min(distance, 2)]);
    bar.style.setProperty('--tick-alpha', [1, .8, .5][Math.min(distance, 2)]);
  });
}
const panels = projects.map(project => {
  const panel = project.querySelector('.project-detail').cloneNode(true);
  panel.classList.add('rail-panel');
  panel.removeAttribute('id');
  panel.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  panel.style.setProperty('--project-colour', projectColours[projects.indexOf(project)]);
  panelsContainer.append(panel);
  return panel;
});
document.documentElement.classList.add('has-work-js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let visibleProject = 0;
let desiredProject = 0;
let panelPhase = 'idle';
let panelEpoch = 0;
panels[0].classList.add('is-active');
panels[0].setAttribute('aria-hidden', 'false');
panels[0].inert = false;
updateProjectRuler(0);

function showProjectImmediately(index) {
  panelEpoch += 1;
  visibleProject = index;
  desiredProject = index;
  panelPhase = 'idle';
  panels.forEach((panel, i) => {
    const active = i === index;
    panel.classList.toggle('is-active', active);
    panel.classList.remove('is-entering', 'is-exiting');
    panel.setAttribute('aria-hidden', String(!active));
    panel.inert = !active;
  });
  updateProjectRuler(index);
}

function transitionProject() {
  if (panelPhase !== 'idle' || desiredProject === visibleProject) return;
  if (panels[visibleProject].contains(document.activeElement)) return;
  panelPhase = 'exiting';
  const epoch = panelEpoch;
  const outgoing = panels[visibleProject];
  outgoing.classList.add('is-exiting');
  outgoing.inert = true;
  setTimeout(() => {
    if (epoch !== panelEpoch) return;
    if (desiredProject === visibleProject) {
      outgoing.classList.remove('is-exiting');
      outgoing.inert = false;
      panelPhase = 'idle';
      return;
    }
    outgoing.classList.remove('is-active', 'is-exiting');
    outgoing.setAttribute('aria-hidden', 'true');
    visibleProject = desiredProject;
    const incoming = panels[visibleProject];
    incoming.classList.add('is-entering');
    incoming.setAttribute('aria-hidden', 'false');
    incoming.inert = false;
    updateProjectRuler(visibleProject);
    void incoming.offsetHeight;
    incoming.classList.add('is-active');
    incoming.classList.remove('is-entering');
    panelPhase = 'entering';
    setTimeout(() => {
      if (epoch !== panelEpoch) return;
      panelPhase = 'idle';
      if (desiredProject !== visibleProject) transitionProject();
    }, 230);
  }, 145);
}

function setActiveProject(index) {
  if (index === desiredProject) return;
  if (reducedMotion.matches || matchMedia('(max-width: 900px)').matches) {
    showProjectImmediately(index);
    return;
  }
  desiredProject = index;
  transitionProject();
}
function updateActiveProject() {
  const target = Math.min(innerHeight * .47, 425);
  let nearest = 0;
  let distance = Infinity;
  const centers = [];
  projects.forEach((project, index) => {
    const box = project.querySelector('.showcase-card').getBoundingClientRect();
    const current = Math.abs(box.top + box.height / 2 - target);
    centers.push(current);
    if (current < distance) { distance = current; nearest = index; }
  });
  if (nearest !== desiredProject && distance + 46 < centers[desiredProject]) setActiveProject(nearest);
  // Preserve the clicked destination while scrolling past intermediate sections.
  if (pendingNavLink) return;
  const workTop = document.querySelector('#work').getBoundingClientRect().top;
  const ossTop = document.querySelector('#oss').getBoundingClientRect().top;
  const aboutTop = document.querySelector('#about').getBoundingClientRect().top;
  const contactTop = document.querySelector('#contact').getBoundingClientRect().top;
  const experienceTop = document.querySelector('#experience').getBoundingClientRect().top;
  if (contactTop < innerHeight * .65) {
    setActiveNav(navLinks.find(link => link.classList.contains('nav-contact')));
  } else if (experienceTop < innerHeight * .65) {
    setActiveNav(navLinks.find(link => link.classList.contains('nav-experience')));
  } else if (aboutTop < innerHeight * .65) {
    setActiveNav(navLinks.find(link => link.hash === '#about'));
  } else if (ossTop < innerHeight * .45) setActiveNav(navLinks.find(link => link.classList.contains('nav-oss')));
  else if (workTop < innerHeight * .45) setActiveNav(navLinks.find(link => link.getAttribute('href') === '/work'));
  else setActiveNav(navLinks.find(link => link.hash === '#home'));
}
let scrollFrame = 0;
function requestProjectUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateActiveProject(); });
}
addEventListener('scroll', requestProjectUpdate, { passive: true });
addEventListener('resize', () => {
  if (matchMedia('(max-width: 900px)').matches && panelPhase !== 'idle') showProjectImmediately(desiredProject);
  requestProjectUpdate();
  moveNavIndicator(navIndicatorTarget());
  updateNavigationWidth();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) showProjectImmediately(desiredProject);
});
addEventListener('load', requestProjectUpdate);
requestProjectUpdate();
projects.forEach((project,index) => project.querySelector('.showcase-card').addEventListener('focusin', () => setActiveProject(index)));

const aboutIntro = document.querySelector('.about-intro');
if (aboutIntro) {
  const glow = aboutIntro.querySelector('.about-glow');
  const glowPointer = matchMedia('(hover: hover) and (pointer: fine)');
  let glowX = 0;
  let glowY = 0;
  let glowTargetX = 0;
  let glowTargetY = 0;
  let glowFrame = 0;
  let glowTime = 0;
  let glowActive = false;
  const paintGlow = () => { glow.style.transform = `translate3d(${glowX - 420}px,${glowY - 420}px,0)`; };
  function animateAboutGlow(timestamp) {
    glowFrame = 0;
    const elapsed = glowTime ? Math.min(timestamp - glowTime, 64) : 16.67;
    glowTime = timestamp;
    const follow = 1 - Math.exp(-elapsed / 90);
    glowX += (glowTargetX - glowX) * follow;
    glowY += (glowTargetY - glowY) * follow;
    paintGlow();
    if (Math.abs(glowTargetX - glowX) + Math.abs(glowTargetY - glowY) > .3) {
      glowFrame = requestAnimationFrame(animateAboutGlow);
    } else glowTime = 0;
  }
  function moveAboutGlow(event) {
    if (event.pointerType !== 'mouse' || !glowPointer.matches) return;
    const box = aboutIntro.getBoundingClientRect();
    glowTargetX = event.clientX - box.left;
    glowTargetY = event.clientY - box.top;
    if (!glowActive || reducedMotion.matches) {
      glowX = glowTargetX;
      glowY = glowTargetY;
      paintGlow();
    }
    glowActive = true;
    aboutIntro.classList.add('is-glowing');
    if (!reducedMotion.matches && !glowFrame) glowFrame = requestAnimationFrame(animateAboutGlow);
  }
  function hideAboutGlow() {
    glowActive = false;
    aboutIntro.classList.remove('is-glowing');
    cancelAnimationFrame(glowFrame);
    glowFrame = 0;
    glowTime = 0;
  }
  aboutIntro.addEventListener('pointerenter', moveAboutGlow);
  aboutIntro.addEventListener('pointermove', moveAboutGlow);
  aboutIntro.addEventListener('pointerleave', hideAboutGlow);
  aboutIntro.addEventListener('pointercancel', hideAboutGlow);
  addEventListener('blur', hideAboutGlow);
  reducedMotion.addEventListener('change', hideAboutGlow);
  glowPointer.addEventListener('change', hideAboutGlow);
}

const aboutReveals = [...document.querySelectorAll('.about-reveal')];
if (aboutReveals.length && 'IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('has-about-motion');
  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      aboutObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -65px 0px', threshold: .08 });
  aboutReveals.forEach(element => aboutObserver.observe(element));
}

// Render luminance as dot area, preserving the original photo and its proportions.
const stageLayer = document.querySelector('.hero-stage');
if (stageLayer) {
  const stageHero = stageLayer.closest('.hero');
  const stagePhoto = stageLayer.querySelector('.hero-stage-monochrome');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let stagePointerFrame;
  let pointerPosition;
  let halftoneResizeFrame;
  let lastHalftoneSize = '';
  let stagePhotoReady = false;
  const monoDots = document.createElement('canvas');
  const samples = document.createElement('canvas');
  monoDots.className = 'hero-stage-halftone';
  stageLayer.append(monoDots);
  // Reuse the responsive picture so hover reveals the unmodified photo and
  // mobile keeps the existing lightweight fallback.
  const colourPhoto = stagePhoto.closest('picture').cloneNode(true);
  colourPhoto.querySelector('img').className = 'hero-stage-photo hero-stage-original';
  const colourLayer = stageLayer.querySelector('.hero-stage-colour');
  colourLayer.append(colourPhoto);
  // Keep the real photo outside the ambient halftone's fading mask. Otherwise
  // the original black hair and dark stage are still blended with the beige.
  stageLayer.after(colourLayer);

  function drawStageHalftone() {
    // PNG dimensions can be available while its pixels are still loading.
    if (!stagePhotoReady || !stagePhoto.complete || !stagePhoto.naturalWidth) return;
    const bounds = stageLayer.getBoundingClientRect();
    const photoBounds = stagePhoto.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const sizeKey = `${bounds.width}:${bounds.height}:${ratio}`;
    if (lastHalftoneSize === sizeKey || !bounds.width || !bounds.height) return;
    const mono = monoDots.getContext('2d');
    const sampler = samples.getContext('2d', { willReadFrequently: true });
    if (!mono || !sampler) {
      stageLayer.classList.add('is-ready');
      return;
    }
    const spacing = bounds.width < 620 ? 2.8 : 3.2;
    const columns = Math.ceil(bounds.width / spacing);
    const rows = Math.ceil(bounds.height / spacing);
    samples.width = columns;
    samples.height = rows;
    sampler.imageSmoothingQuality = 'high';
    sampler.drawImage(stagePhoto, (photoBounds.left - bounds.left) / spacing, (photoBounds.top - bounds.top) / spacing, photoBounds.width / spacing, photoBounds.height / spacing);
    const pixels = sampler.getImageData(0, 0, columns, rows).data;
    monoDots.width = Math.round(bounds.width * ratio);
    monoDots.height = Math.round(bounds.height * ratio);
    mono.setTransform(ratio, 0, 0, ratio, 0, 0);
    const stageStyle = getComputedStyle(stageLayer);
    const photoX = photoBounds.left-bounds.left;
    const photoY = photoBounds.top-bounds.top;
    const lightHalftone = stageStyle.getPropertyValue('--halftone-light').trim() === '1';
    mono.fillStyle = stageStyle.getPropertyValue('--halftone-ink').trim() || '#f1f1f1';
    mono.beginPath();
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const offset = (row * columns + column) * 4;
        if (!pixels[offset + 3]) continue;
        const red = pixels[offset];
        const green = pixels[offset + 1];
        const blue = pixels[offset + 2];
        const tone = (red * .2126 + green * .7152 + blue * .0722) / 255;
        const x = (column + .5) * spacing;
        const y = (row + .5) * spacing;
        // Match the photo's CSS edge fades in the idle halftone as well.
        const u = (x-photoX)/photoBounds.width;
        const v = (y-photoY)/photoBounds.height;
        const fadeX = Math.max(0,Math.min(1,u/.1,(1-u)/.1));
        const fadeY = Math.max(0,Math.min(1,v/.1,(1-v)/.16));
        const alpha = pixels[offset+3]/255*fadeX*fadeY;
        const radius = Math.sqrt((lightHalftone ? 1-tone : tone)*alpha)*spacing*.49;
        mono.moveTo(x + radius, y);
        mono.arc(x, y, radius, 0, Math.PI * 2);
      }
    }
    mono.fill();
    lastHalftoneSize = sizeKey;
    stageLayer.classList.add('has-halftone', 'is-ready');
  }
  async function prepareStagePhoto() {
    if (!stagePhoto.complete || !stagePhoto.naturalWidth) return;
    try {
      if (stagePhoto.decode) await stagePhoto.decode();
      stagePhotoReady = true;
      lastHalftoneSize = '';
      drawStageHalftone();
    } catch (_) {
      // Keep the real photo visible if the decorative renderer is unavailable.
      stageLayer.classList.remove('has-halftone');
      stageLayer.classList.add('is-ready');
    }
  }
  stagePhoto.addEventListener('load', prepareStagePhoto);
  if (stagePhoto.complete && stagePhoto.naturalWidth) prepareStagePhoto();
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      cancelAnimationFrame(halftoneResizeFrame);
      halftoneResizeFrame = requestAnimationFrame(drawStageHalftone);
    }).observe(stageLayer);
  } else window.addEventListener('resize', drawStageHalftone);

  stageHero.addEventListener('pointermove', event => {
    if (!finePointer.matches || event.pointerType === 'touch' || !stageLayer.clientWidth) return;
    pointerPosition = { x: event.clientX, y: event.clientY };
    if (stagePointerFrame) return;
    stagePointerFrame = requestAnimationFrame(() => {
      stagePointerFrame = null;
      const bounds = stageLayer.getBoundingClientRect();
      colourLayer.style.setProperty('--stage-pointer-x',`${pointerPosition.x-bounds.left}px`);
      colourLayer.style.setProperty('--stage-pointer-y',`${pointerPosition.y-bounds.top}px`);
      stageLayer.classList.add('is-colour-active');
    });
  });
  function clearStageColour() {
    cancelAnimationFrame(stagePointerFrame);
    stagePointerFrame = null;
    stageLayer.classList.remove('is-colour-active');
  }
  stageHero.addEventListener('pointerleave', clearStageColour);
  window.addEventListener('blur', clearStageColour);
  window.addEventListener('scroll', clearStageColour, { passive: true });
  finePointer.addEventListener('change', clearStageColour);
}
