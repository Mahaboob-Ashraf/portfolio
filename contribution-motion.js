(() => {
  const header = document.querySelector('.contribution-header');
  if (!header) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  function reveal(element,delay=0) {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    animations.add(animation);
    animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
  }
  header.querySelectorAll('.contribution-kicker,h1,.contribution-summary,.contribution-meta').forEach((element,index)=>reveal(element,index*65));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    }),{threshold:.06,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.contribution-body>section,.contribution-artwork,.contribution-faq>h2').forEach(element=>observer.observe(element));
  }
  reduced.addEventListener('change',()=>{animations.forEach(animation=>animation.cancel());animations.clear();});
})();
