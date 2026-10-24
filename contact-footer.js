(() => {
  const contactReduced = matchMedia('(prefers-reduced-motion: reduce)');
const contactReveals = [...document.querySelectorAll('.contact-reveal')];
if (contactReveals.length && 'IntersectionObserver' in window && !contactReduced.matches) {
  document.documentElement.classList.add('has-contact-motion');
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      contactObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -70px 0px', threshold: .08 });
  contactReveals.forEach(element => contactObserver.observe(element));
}

const localTime = document.querySelector('#footer-local-time');
const footerYear = document.querySelector('#footer-year');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());
if (localTime) {
  const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true });
  const updateLocalTime = () => {
    localTime.textContent = `${timeFormatter.format(new Date())} IST`;
    localTime.dateTime = new Date().toISOString();
  };
  updateLocalTime();
  setInterval(updateLocalTime, 60000);
}


document.querySelectorAll('[data-copy-email], .copy-email[data-email]').forEach(copyEmailButton => {
  const copyStatus = document.getElementById(copyEmailButton.getAttribute('aria-describedby'));
  const label = copyEmailButton.querySelector('[data-copy-label]');
  let statusTimeout;
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail || copyEmailButton.dataset.email;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch (_) { /* Fall back to the browser's copy command. */ }
    if (!copied) {
      const previousFocus = document.activeElement;
      const temporaryInput = document.createElement('textarea');
      try {
        temporaryInput.value = email;
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.append(temporaryInput);
        temporaryInput.select();
        copied = document.execCommand('copy');
      } catch (_) { copied = false; }
      finally {
        temporaryInput.remove();
        previousFocus?.focus({preventScroll:true});
      }
    }
    copyEmailButton.classList.toggle('is-copied',copied);
    if (label) label.textContent = copied ? 'Copied' : 'Copy';
    if (copyStatus) copyStatus.textContent = copied ? 'Email copied' : 'Use the email link to get in touch';
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      if (copyStatus) copyStatus.textContent = '';
      if (label) label.textContent = 'Copy';
      copyEmailButton.classList.remove('is-copied');
    }, 3500);
  });
});


  const footer = document.querySelector('.site-footer');
  const main = document.querySelector('#main');
  const name = footer?.querySelector('.footer-name');
  if (!footer || !main || !name) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const watermark = name.parentElement;
  const characters = Array.from(name.textContent);
  const letters = characters.map(character => {
    const span = document.createElement('span');
    span.className = 'footer-name-letter';
    span.textContent = character === ' ' ? '\u00a0' : character;
    return span;
  });
  name.replaceChildren(...letters);
  root.classList.add('has-footer-reveal');

  let frame = 0;
  let lastProgress = -1;
  const clamp = value => Math.min(1, Math.max(0, value));

  function paint() {
    frame = 0;
    const footerHeight = footer.offsetHeight;
    const tall = footerHeight > innerHeight - 64;
    root.classList.toggle('has-tall-footer', tall);
    const bottom = main.getBoundingClientRect().bottom;
    const reveal = tall
      ? (innerHeight - watermark.getBoundingClientRect().top - 8) / (watermark.offsetHeight * .85)
      : (innerHeight - bottom - 12) / (footerHeight * .72);
    const progress = reduced.matches ? 1 : clamp(reveal);
    if (Math.abs(lastProgress - progress) < .0001) return;
    lastProgress = progress;
    letters.forEach((letter, index) => {
      const start = index / Math.max(1, letters.length - 1) * .68;
      const amount = clamp((progress - start) / .32);
      const eased = 1 - (1 - amount) ** 3;
      letter.style.setProperty('--letter-opacity', eased.toFixed(4));
      letter.style.setProperty('--letter-offset', `${((1 - eased) * 22).toFixed(2)}px`);
      letter.style.setProperty('--letter-blur', `${((1 - eased) * 3).toFixed(2)}px`);
    });
  }
  function requestPaint() {
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function fitName() {
    // Measure the untransformed glyph widths so the full name fits at every size.
    watermark.style.setProperty('--footer-name-size', '200px');
    const available = watermark.clientWidth;
    const natural = name.offsetWidth;
    if (available && natural) watermark.style.setProperty('--footer-name-size', `${(200 * (available - 2) / natural).toFixed(2)}px`);
    lastProgress = -1;
    requestPaint();
  }

  addEventListener('scroll', requestPaint, { passive: true });
  addEventListener('resize', fitName);
  reduced.addEventListener('change', () => { lastProgress = -1; requestPaint(); });
  if ('ResizeObserver' in window) new ResizeObserver(requestPaint).observe(footer);
  document.fonts.ready.then(fitName);
  fitName();

  // A sticky footer may sit behind the contact panel; keyboard focus uncovers it.
  footer.addEventListener('focusin', event => {
    if (reduced.matches || root.classList.contains('has-tall-footer')) return;
    if (main.getBoundingClientRect().bottom > event.target.getBoundingClientRect().top - 24) {
      scrollTo({ top: document.documentElement.scrollHeight - innerHeight, behavior: 'instant' });
    }
  });
})();
