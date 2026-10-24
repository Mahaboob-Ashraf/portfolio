(() => {
  const navigation = document.querySelector('.nav-pill');
  const wrap = document.querySelector('.navigation-wrap');
  const menu = document.querySelector('.menu-toggle');
  const links = [...navigation.querySelectorAll('.nav-link')];
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  navigation.prepend(indicator);
  const active = navigation.querySelector('[aria-current]');
  let hovered = null;
  let focused = null;

  function paintNavigation() {
    if (!matchMedia('(max-width:800px)').matches) {
      wrap.style.setProperty('--nav-width', `${navigation.scrollWidth + 8}px`);
    }
    const target = focused || hovered || active;
    const show = target && !target.classList.contains('nav-contact');
    navigation.classList.toggle('has-indicator', Boolean(show));
    if (show) {
      indicator.style.width = `${target.offsetWidth}px`;
      indicator.style.transform = `translateX(${target.offsetLeft}px)`;
    }
  }
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    navigation.classList.remove('is-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navigation.classList.toggle('is-open', open);
  });
  links.forEach(link => {
    link.addEventListener('pointerenter', () => { hovered = link; paintNavigation(); });
    link.addEventListener('focus', () => { focused = link; paintNavigation(); });
    link.addEventListener('blur', () => { focused = null; paintNavigation(); });
    link.addEventListener('click', closeMenu);
  });
  navigation.addEventListener('pointerleave', () => { hovered = null; paintNavigation(); });
  document.addEventListener('pointerdown', event => { if (!wrap.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  addEventListener('resize', paintNavigation);
  document.fonts.ready.then(paintNavigation);
  paintNavigation();

  const copy = document.querySelector('.project-copy-link');
  let copyTimer;
  copy?.addEventListener('click', async () => {
    const status = document.querySelector('.project-copy-status');
    try {
      await navigator.clipboard.writeText(location.href.split('#')[0]);
      status.textContent = 'Link copied';
    } catch {
      status.textContent = 'Copy this page’s address from your browser';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { status.textContent = ''; }, 3500);
  });
})();
