// Shared highlight interaction for project actions and every footer link.
(() => {
  const selector = '.site-footer a, .project-breadcrumbs a, .project-facts a, .project-section-body a, .project-source-note a, .project-next-cta, .contribution-meta-info a, .contribution-body a:not(.contribution-author-end), .contribution-share .project-copy-link, .oss-card-links a';
  document.querySelectorAll(selector).forEach(link => {
    if (link.classList.contains('ink-link')) return;
    // Remove the old decorative arrow; the shared arrow slides in on interaction.
    [...link.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\s*[↗→]\s*$/,'');
      else if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('aria-hidden') === 'true' && /^[\s↗→]+$/.test(node.textContent)) node.remove();
    });
    const label = document.createElement('span');
    label.className = 'ink-link-label';
    label.append(...link.childNodes);
    link.append(label);
    link.classList.add('ink-link');
  });
  document.querySelectorAll('.site-footer .copy-email').forEach(button => button.classList.add('ink-icon-button'));
})();
