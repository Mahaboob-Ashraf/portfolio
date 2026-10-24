// Interruptible native-details animation shared by projects and contributions.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const settleFaqs = [];
  document.querySelectorAll('.project-faq details, .contribution-faq details').forEach(details => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.project-faq-answer, .contribution-faq-answer');
    let intendedOpen = details.open;
    let heightAnimation = null;
    let answerAnimation = null;
    details.dataset.faqAnimated = '';
    function sync() {
      details.classList.toggle('is-faq-expanded',intendedOpen);
      summary.setAttribute('aria-expanded',String(intendedOpen));
    }
    function settle() {
      heightAnimation?.cancel();
      answerAnimation?.cancel();
      heightAnimation = answerAnimation = null;
      details.open = intendedOpen;
      details.style.removeProperty('height');
      details.style.removeProperty('overflow');
      sync();
    }
    settleFaqs.push(settle);
    sync();
    summary.addEventListener('click',event => {
      event.preventDefault();
      const startHeight = details.getBoundingClientRect().height;
      const startOpacity = details.open ? Number(getComputedStyle(answer).opacity) : 0;
      intendedOpen = !intendedOpen;
      heightAnimation?.cancel();
      answerAnimation?.cancel();
      heightAnimation = answerAnimation = null;
      sync();
      if (reduced.matches || !details.animate) { settle(); return; }
      details.style.height = `${startHeight}px`;
      details.style.overflow = 'hidden';
      details.open = true;
      const style = getComputedStyle(details);
      const border = parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
      const endHeight = summary.getBoundingClientRect().height+(intendedOpen ? answer.getBoundingClientRect().height : 0)+border;
      const animation = details.animate([{height:`${startHeight}px`},{height:`${endHeight}px`}],{duration:intendedOpen ? 430 : 330,easing:ease,fill:'both'});
      heightAnimation = animation;
      answerAnimation = answer.animate([{opacity:startOpacity,transform:intendedOpen ? 'translateY(-5px)' : 'translateY(0)'},{opacity:intendedOpen ? 1 : 0,transform:intendedOpen ? 'translateY(0)' : 'translateY(-5px)'}],{duration:intendedOpen ? 330 : 220,easing:ease,fill:'both'});
      animation.onfinish = () => { if (heightAnimation === animation) settle(); };
    });
    details.addEventListener('toggle',()=>{
      if (heightAnimation) return;
      intendedOpen = details.open;
      sync();
    });
  });
  addEventListener('resize',()=>settleFaqs.forEach(settle=>settle()),{passive:true});
  reduced.addEventListener('change',()=>settleFaqs.forEach(settle=>settle()));
})();
