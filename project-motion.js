(() => {
  const article = document.querySelector('.project-article');
  if (!article) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const entranceAnimations = new Set();
  const ease = 'cubic-bezier(.22,1,.36,1)';
  function reveal(element, delay = 0, distance = 12) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate([
      {opacity:0,transform:`translateY(${distance}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:650,delay,easing:ease,fill:'backwards'});
    entranceAnimations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>entranceAnimations.delete(animation));
  }
  article.querySelectorAll('.project-breadcrumbs, .project-intro h1, .project-summary, .project-facts, .project-stack').forEach((element,index)=>reveal(element,index*55));
  const artwork = article.querySelector('.project-header-art');
  if (!reduced.matches && artwork?.animate) {
    const animation = artwork.animate([{opacity:0,transform:'scale(1.035)'},{opacity:.78,transform:'scale(1)'}],{duration:1000,easing:ease});
    entranceAnimations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>entranceAnimations.delete(animation));
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (entry.target.classList.contains('project-section')) {
        reveal(entry.target.querySelector('.project-section-heading'));
        reveal(entry.target.querySelector('.project-section-body'),60,8);
      } else reveal(entry.target,0,14);
    });
  },{threshold:.04,rootMargin:'0px 0px -35px 0px'}) : null;
  article.querySelectorAll('.project-section, .project-media, .project-next-copy').forEach(element=>observer?.observe(element));

  reduced.addEventListener('change',()=>{
    entranceAnimations.forEach(animation=>animation.cancel());
    entranceAnimations.clear();
  });
})();
