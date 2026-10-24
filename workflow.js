(() => {
  const section = document.querySelector('.workflow-section');
  if (!section) return;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const point = p => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const polygon = points => `M${points.map(point).join('L')}Z`;
  const line = points => `M${points.map(point).join('L')}`;
  // Original ruled-paper drawing. Keep its near edge anchored as the far panel slides.
  const chart = section.querySelector('.workflow-chart');
  const chartGuides = [
    [[54, 213], [434, 403]], [[428, 26], [808, 216]],
    [[108, 57], [570, 288]], [[251, 128], [713, 359]],
    [[126, 255], [510, 63], [702, 159], [318, 351], [126, 255]]
  ].map(points => `<path class="workflow-gridline" d="${line(points)}"/>`).join('');
  const crosses = [[132, 272], [298, 355], [528, 78], [694, 161]].map(([x, y]) => `<path class="workflow-cross" d="M${x - 5} ${y - 2.5}l10 5m-10 0l10 -5"/>`).join('');
  const specRows = [0, 1, 2, 3, 4].map(i => `<path class="workflow-sheet-detail" d="M${503 - i * 6} ${105 + i * 3}l${98 - (i % 2) * 13} ${49 - (i % 2) * 6.5}"/>`).join('');
  const shippedMark = Array.from({ length: 36 }, (_, i) => {
    const x = i % 6, y = Math.floor(i / 6);
    return ((x * 7 + y * 3 + x * y) % 5 < 3) ? `<rect x="${x * 3.3}" y="${y * 3.3}" width="2.5" height="2.5"/>` : '';
  }).join('');
  chart.innerHTML = `<defs>
    <radialGradient id="workflow-blue-glow"><stop stop-color="#547bbd" stop-opacity=".08"/><stop offset="1" stop-color="#547bbd" stop-opacity="0"/></radialGradient>
    <linearGradient id="workflow-paper-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#161618"/><stop offset="1" stop-color="#101012"/></linearGradient>
    <linearGradient id="workflow-fold-shadow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></linearGradient>
    <linearGradient id="workflow-bar-shade"><stop stop-color="#111113"/><stop offset="1" stop-color="#19191c"/></linearGradient>
  </defs>
  <ellipse class="workflow-art-glow" cx="430" cy="278" rx="265" ry="120" fill="url(#workflow-blue-glow)"/>
  ${chartGuides}${crosses}
  <path class="workflow-fold-shadow"/>
  <path class="workflow-paper-surface workflow-paper-ribbon"/>
  <g class="workflow-spec">
    <path class="workflow-spec-bar" d="M524 90l73 36.5-9 4.5-73-36.5Z"/>
    ${specRows}<text class="workflow-ink" transform="matrix(1 .5 -1 .5 599 130)">SPEC</text>
  </g>
  <g class="workflow-sheet"><path class="workflow-sheet-detail workflow-inner-ribbon"/>
    <g class="workflow-checklist">${[0, 1, 2].map(i => `<path class="workflow-sheet-detail workflow-check-row" data-row="${i}"/><path class="workflow-trace" style="--trace-index:${i}" pathLength="1"/>`).join('')}</g>
    <text class="workflow-ink workflow-decided" transform="matrix(.94 .47 -.94 .31 382 110)">DECIDED</text>
    <g class="workflow-shipped" transform="matrix(1 .5 -1 .5 259 278)"><g class="workflow-print-mark">${shippedMark}</g><text class="workflow-ink" x="25" y="14">SHIPPED</text><path class="workflow-sheet-detail" d="M25 19h42m-42 3h31"/></g>
  </g>
  <g class="workflow-bars"></g>
  ${[0, 1, 2].map(i => `<text class="workflow-ink workflow-week" style="--bar-index:${i}" transform="matrix(1 .5 -1 .5 ${243 + i * 41.82} ${238 + i * 20.91})">W${i + 1}</text>`).join('')}`;

  const ribbon = chart.querySelector('.workflow-paper-ribbon');
  const ribbonInner = chart.querySelector('.workflow-inner-ribbon');
  const foldShadow = chart.querySelector('.workflow-fold-shadow');
  const specPanel = chart.querySelector('.workflow-spec');
  const decidedLabel = chart.querySelector('.workflow-decided');
  const checkRows = [...chart.querySelectorAll('.workflow-check-row')];
  const checks = [...chart.querySelectorAll('.workflow-trace')];
  function paintPaper(amount) {
    const dx = -17 * amount, dy = 8.5 * amount, lift = 8 * amount;
    const edge = (x, y) => [x, y];
    // Adjacent controls share a tangent: no kinks at the ramp, crest or spec panel.
    const left = [edge(162, 264.21), edge(245, 223), edge(274, 208.6), edge(296, 104.33 - lift), edge(326, 96.33 - lift), edge(354, 88.86 - lift), edge(370, 111.33 - lift), edge(399, 116 - lift), edge(420, 119.38 - lift), edge(441 + dx, 123 + dy), edge(459 + dx, 114 + dy)];
    const shifted = (p, inset = 136.8) => [p[0] + inset, p[1] + inset / 2];
    const commands = (points, start = points[0]) => `M${point(start)}L${point(points[1])}C${points.slice(2, 5).map(point).join(' ')}C${points.slice(5, 8).map(point).join(' ')}C${points.slice(8, 11).map(point).join(' ')}`;
    const right = left.map(p => shifted(p));
    const specEdge = `L${520 + dx} ${83 + dy}Q${528 + dx} ${79 + dy} ${536 + dx} ${83 + dy}L${660 + dx} ${145 + dy}Q${670 + dx} ${150 + dy} ${660 + dx} ${155 + dy}C${640 + dx} ${165 + dy} ${613.8 + dx} ${173.4 + dy} ${right[10][0]} ${right[10][1]}`;
    const reverse = `C${[right[9], right[8], right[7]].map(point).join(' ')}C${[right[6], right[5], right[4]].map(point).join(' ')}C${[right[3], right[2], right[1]].map(point).join(' ')}L${right[0][0] + 5} ${right[0][1] - 2.5}Q${right[0][0]} ${right[0][1]} ${right[0][0] - 5} ${right[0][1] - 2.5}L167 266.71Q162 264.21 167 261.71Z`;
    ribbon.setAttribute('d', commands(left, [167, 261.71]) + specEdge + reverse);
    const inner = left.map(p => shifted(p, 12));
    inner[0] = inner[1];
    ribbonInner.setAttribute('d', commands(inner) + `M231 239.7l120 60`);
    foldShadow.setAttribute('d', `M392 289C420 ${247 - lift} 449 ${159 - lift} 492 ${165 - lift}C529 ${166 - lift} 562 ${203 + dy} ${600 + dx} ${184 + dy}L392 289Z`);
    specPanel.setAttribute('transform', `translate(${dx} ${dy})`);
    decidedLabel.setAttribute('transform', `matrix(.94 .47 -.94 .31 382 ${110 - lift})`);
    checkRows.forEach((row, i) => {
      const x = 357 - i * 15.3, y = 117 + i * 15.9 - lift * (1.2 - i * .1);
      row.setAttribute('d', `M${x} ${y}l77 38.5`);
      const cx = 447 - i * 15.3, cy = 154 + i * (14 + i * 2) - lift * (1.2 - i * .1);
      checks[i].setAttribute('d', `M${cx} ${cy}l4 4 10 -${4 + i * 1.8}`);
    });
  }
  let paperAmount = 0;
  paintPaper(paperAmount);

  const baseHeights = [26.24, 66.62, 124.76];
  const activeHeights = [40.78, 81.15, 132.83];
  const barHeights = [...baseHeights];
  const barsRoot = chart.querySelector('.workflow-bars');
  barsRoot.innerHTML = baseHeights.map((_, i) => `<g class="workflow-bar" style="--bar-index:${i}"><path class="bar-front"/><path class="bar-side"/><path class="bar-top"/><path class="bar-outline"/><path class="bar-edge"/></g>`).join('');
  const barGroups = [...barsRoot.children];
  const barFaces = barGroups.map(group => Object.fromEntries([...group.children].map(path => [path.getAttribute('class').slice(4), path])));
  function paintBar(index, height) {
    const x = 276.3 + index * 41.82, y = 239.75 + index * 20.91;
    const north = [x, y - height - 23], east = [x + 23, y - height - 11.5];
    const south = [x, y - height], west = [x - 23, y - height - 11.5];
    const bottomEast = [x + 23, y - 11.5], bottom = [x, y], bottomWest = [x - 23, y - 11.5];
    const paths = {
      front: polygon([west, south, bottom, bottomWest]),
      side: polygon([south, east, bottomEast, bottom]),
      top: polygon([north, east, south, west]),
      outline: polygon([west, north, east, bottomEast, bottom, bottomWest]),
      edge: line([west, south, east]) + line([south, bottom])
    };
    for (const [face, d] of Object.entries(paths)) barFaces[index][face].setAttribute('d', d);
  }
  barHeights.forEach((height, index) => paintBar(index, height));

  function measuredEase(value) {
    // Invert cubic-bezier(.22, 1, .36, 1) for the measured reference timing.
    if (value <= 0) return 0;
    if (value >= 1) return 1;
    let lower = 0, upper = 1, t = value;
    for (let i = 0; i < 10; i++) {
      t = (lower + upper) / 2;
      const x = 3 * (1 - t) * (1 - t) * t * .22 + 3 * (1 - t) * t * t * .36 + t * t * t;
      if (x < value) lower = t; else upper = t;
    }
    return 1 - Math.pow(1 - t, 3);
  }
  let barFrame;
  function moveBars(active) {
    cancelAnimationFrame(barFrame);
    const targets = active ? activeHeights : baseHeights;
    if (motionPreference.matches) {
      baseHeights.forEach((height, index) => { barHeights[index] = height; paintBar(index, height); });
      paperAmount = 0;
      paintPaper(0);
      return;
    }
    const starts = [...barHeights];
    const paperStart = paperAmount;
    const began = performance.now();
    function frame(now) {
      let finished = true;
      const paperFraction = Math.max(0, Math.min(1, (now - began) / (active ? 700 : 300)));
      paperAmount = paperStart + ((active ? 1 : 0) - paperStart) * (active ? measuredEase(paperFraction) : paperFraction * paperFraction);
      paintPaper(paperAmount);
      if (paperFraction < 1) finished = false;
      targets.forEach((target, index) => {
        const delay = active ? 300 + index * 280 : 0;
        const fraction = Math.max(0, Math.min(1, (now - began - delay) / (active ? 450 : 300)));
        const eased = active ? measuredEase(fraction) : fraction * fraction;
        barHeights[index] = starts[index] + (target - starts[index]) * eased;
        paintBar(index, barHeights[index]);
        if (fraction < 1) finished = false;
      });
      if (!finished) barFrame = requestAnimationFrame(frame);
    }
    barFrame = requestAnimationFrame(frame);
  }

  section.querySelectorAll('.workflow-process').forEach(card => {
    function active(value) { card.classList.toggle('is-art-active',value); moveBars(value); }
    card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')active(true);});
    card.addEventListener('pointerleave',()=>active(false));
    card.addEventListener('focus',()=>active(true));
    card.addEventListener('blur',()=>active(false));
  });

  // Curated stack, including skills confirmed in Ashraf's AI, FDE, and SDE resumes.
  const stackSkills = {
    next: ['Next.js', 'next.svg'], react: ['React', 'react.svg'], typescript: ['TypeScript', 'typescript.svg'],
    tailwind: ['Tailwind CSS', 'tailwind.svg'], css: ['CSS', 'css.svg'],
    javascript: ['JavaScript', 'javascript.svg'], vite: ['Vite', 'vite.svg'], java: ['Java', 'java.svg'], sql: ['SQL', 'database.svg'],
    node: ['Node.js', 'node.svg'], python: ['Python', 'python.svg'], fastapi: ['FastAPI', 'fastapi.svg'],
    fastify: ['Fastify', 'fastify.svg'], springboot: ['Spring Boot', 'springboot.svg'], bullmq: ['BullMQ', 'queue.svg'],
    postgres: ['PostgreSQL', 'postgres.svg'], drizzle: ['Drizzle ORM', 'drizzle.svg'], prisma: ['Prisma ORM', 'prisma.svg'],
    redis: ['Redis', 'redis.svg'], mongodb: ['MongoDB', 'mongodb.svg'], express: ['Express.js', 'express.svg'],
    betterauth: ['Better Auth', 'betterauth.svg'], rest: ['REST APIs', 'api.svg'], integrations: ['API Integrations', 'api.svg'],
    pipelines: ['Data Pipelines', 'pipeline.svg'], pgvector: ['pgvector', 'database.svg'], razorpay: ['Razorpay', 'payment.svg'],
    langgraph: ['LangGraph', 'langgraph.svg'], langchain: ['LangChain', 'langchain.svg'], rag: ['RAG', 'rag.svg'],
    llms: ['LLMs', 'llm.svg'], agents: ['Agentic Workflows', 'workflow.svg'], toolcalling: ['Tool Calling', 'toolcalling.svg'],
    evaluation: ['AI Evaluation', 'evaluation.svg'], embeddings: ['Embeddings', 'embeddings.svg'],
    pytorch: ['PyTorch', 'pytorch.svg'], ollama: ['Ollama', 'ollama.svg'], chroma: ['Chroma', 'database.svg'],
    bm25: ['BM25', 'search.svg'], rrf: ['Reciprocal Rank Fusion', 'ranking.svg'], gemma: ['Gemma', 'gemini.svg'], yolo: ['YOLOv8', 'vision.svg'],
    vector: ['Vector DB', 'vector.svg'], claude: ['Claude', 'claude.svg'], chatgpt: ['ChatGPT', 'chatgpt.svg'],
    gemini: ['Gemini', 'gemini.svg'], grok: ['Grok', 'grok.svg'], claudecode: ['Claude Code', 'claude.svg'],
    bash: ['Bash', 'bash.svg'], linux: ['Linux', 'linux.svg'], codex: ['Codex', 'codex.svg'], testing: ['Testing', 'testing.svg'],
    treesitter: ['Tree-sitter', 'parser.svg'], dsa: ['Data Structures & Algorithms', 'algorithms.svg'], oop: ['OOP', 'oop.svg'], dbms: ['DBMS', 'database.svg'],
    git: ['Git', 'git.svg'], worktrees: ['Git Worktrees', 'git.svg'], github: ['GitHub', 'github.svg'],
    actions: ['GitHub Actions', 'actions.svg'], docker: ['Docker', 'docker.svg'],
    vercel: ['Vercel', 'vercel.svg'], cloudflare: ['Cloudflare', 'cloudflare.svg'], aws: ['AWS', 'aws.svg'],
    notion: ['Notion', 'notion.svg'], markdown: ['Markdown', 'markdown.svg']
  };
  const categories = {
    frontend: ['next', 'react', 'typescript', 'javascript', 'vite', 'tailwind', 'css'],
    backend: ['java', 'springboot', 'node', 'typescript', 'javascript', 'python', 'fastify', 'fastapi', 'express', 'rest', 'integrations', 'sql', 'postgres', 'pgvector', 'redis', 'bullmq', 'mongodb', 'drizzle', 'prisma', 'betterauth', 'pipelines', 'razorpay'],
    ai: ['python', 'llms', 'agents', 'toolcalling', 'langgraph', 'langchain', 'rag', 'embeddings', 'vector', 'chroma', 'bm25', 'rrf', 'evaluation', 'pytorch', 'ollama', 'gemini', 'gemma', 'yolo', 'claude', 'chatgpt', 'grok'],
    tools: ['codex', 'claudecode', 'testing', 'treesitter', 'bash', 'linux', 'git', 'worktrees', 'github', 'actions', 'docker', 'vercel', 'cloudflare', 'aws', 'notion', 'markdown', 'dsa', 'oop', 'dbms']
  };
  const chip = key => `<span class="stack-chip"><img class="stack-logo" src="/assets/tools/stack/${stackSkills[key][1]}" width="12" height="12" alt="" decoding="async">${stackSkills[key][0]}</span>`;
  const marquee = section.querySelector('.stack-marquees');
  function renderMarquees() {
    marquee.innerHTML = Object.values(categories).map((keys, row) => {
      const repeated = keys.length < 10 ? [...keys, ...keys] : keys;
      const set = `<div class="stack-set">${repeated.map(chip).join('')}</div>`;
      return `<div class="stack-row" style="--entrance-delay:${row * 50}ms"><div class="stack-track${row % 2 ? ' is-reversed' : ''}" style="--row-duration:${[50, 65, 90, 85][row]}s">${set}${set}</div></div>`;
    }).join('');
  }
  const accessibleStack = section.querySelector('.stack-accessible-list');
  const filteredStack = section.querySelector('.stack-filtered');
  let activeStackCategory;
  function filterStack(category) {
    if (category === activeStackCategory) return;
    activeStackCategory = category;
    const keys = category === 'all' ? [...new Set(Object.values(categories).flat())] : categories[category];
    accessibleStack.innerHTML = keys.map(key => `<li>${stackSkills[key][0]}</li>`).join('');
    accessibleStack.hidden = category !== 'all';
    marquee.hidden = category !== 'all';
    filteredStack.hidden = category === 'all';
    section.querySelector('.workflow-stack').dataset.stackCategory = category;
    if (category === 'all') renderMarquees();
    filteredStack.innerHTML = category === 'all' ? '' : keys.map((key, i) => `<span class="stack-entry" role="listitem" style="--entrance-delay:${i * 25}ms">${chip(key)}</span>`).join('');
    filteredStack.scrollTop = 0;
    section.querySelectorAll('button[data-stack-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stackFilter === category)));
  }
  filterStack('all');
  section.querySelectorAll('button[data-stack-filter]').forEach(button => button.addEventListener('click', () => filterStack(button.dataset.stackFilter)));

  const dock = section.querySelector('.workflow-dock');
  const dockLogo = name => `<span class="dock-icon dock-logo" style="--dock-icon:url('/assets/tools/${name}.svg')" aria-hidden="true"></span>`;
  const dockSymbol = paths => `<svg class="dock-icon dock-symbol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const dockLinks = [
    { label: 'GitHub', description: 'GitHub — browse my code', url: 'https://github.com/Mahaboob-Ashraf', tile: '#202023', shade: '#030304', icon: dockLogo('github') },
    { label: 'Projects', description: 'Projects — explore all projects', url: '/work', theme: 'projects', icon: dockSymbol('<path d="M3 8V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><path d="m9 12-2 2 2 2m6-4 2 2-2 2"/>') },
    { label: 'LinkedIn', description: 'LinkedIn — connect with me', url: 'https://www.linkedin.com/in/mohammad-mahaboob-ashraf-a0b17b321/', tile: '#2698ff', shade: '#085cae', icon: '<img class="dock-icon dock-brand" src="/assets/tools/linkedin.svg" alt="" aria-hidden="true">' },
    { label: 'Research', description: 'Research — explore my research experience', url: '#experience-title', theme: 'research', icon: dockSymbol('<path d="M9 3h6m-5 0v6l-6 10a1.3 1.3 0 0 0 1.1 2h13.8a1.3 1.3 0 0 0 1.1-2L14 9V3M7.5 15h9"/>') },
    { label: 'X', description: 'X — follow Mahaboob Ashraf', url: 'https://x.com/Mahaboob_Ashraf', tile: '#161619', shade: '#000000', icon: dockLogo('x') },
    { label: 'Email', description: 'Email — start a conversation', url: '#contact', theme: 'email', icon: dockSymbol('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 6.7 5a2 2 0 0 0 2.6 0L20 7"/>') }
  ];
  dock.innerHTML = dockLinks.map(({ label, description, url, tile = '#3b3c42', shade = '#17181d', theme, icon }) => `<a class="dock-item${theme ? ' dock-' + theme : ''}" href="${url}"${url.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''} aria-label="${description}" style="--dock-tile:${tile};--dock-shade:${shade}">${icon}<span class="dock-tooltip" aria-hidden="true">${label}</span></a>`).join('');
  const dockItems = [...dock.children];
  const dockValues = dockItems.map(() => 0);
  const dockVelocity = dockItems.map(() => 0);
  let dockTargets = dockItems.map(() => 0);
  let dockFrame;
  let dockLastTime;
  function animateDock(now) {
    const elapsed = Math.min((now - (dockLastTime || now)) / 1000, .032);
    dockLastTime = now;
    let moving = false;
    dockItems.forEach((item, index) => {
      dockVelocity[index] += (dockTargets[index] - dockValues[index]) * 450 * elapsed;
      dockVelocity[index] *= Math.exp(-26 * elapsed);
      dockValues[index] += dockVelocity[index] * elapsed;
      if (Math.abs(dockValues[index] - dockTargets[index]) > .001 || Math.abs(dockVelocity[index]) > .001) moving = true;
      item.style.setProperty('--dock-growth', Math.max(0, dockValues[index]).toFixed(4));
    });
    dockFrame = moving ? requestAnimationFrame(animateDock) : null;
    if (!moving) dockLastTime = null;
  }
  function setDockTargets(targets) {
    dockTargets = targets;
    if (motionPreference.matches) return;
    if (!dockFrame) dockFrame = requestAnimationFrame(animateDock);
  }
  dock.addEventListener('pointermove', event => {
    if (!finePointer.matches || event.pointerType !== 'mouse') return;
    const bounds = dock.getBoundingClientRect();
    const base = parseFloat(getComputedStyle(dock).getPropertyValue('--dock-base')) || 36;
    const gap = parseFloat(getComputedStyle(dock).gap) || 9;
    const center = bounds.left + bounds.width / 2;
    setDockTargets(dockItems.map((_, index) => Math.exp(-Math.pow((event.clientX - center - (index - (dockItems.length - 1) / 2) * (base + gap)) / 82, 2))));
  });
  dock.addEventListener('pointerleave', () => setDockTargets(dockItems.map(() => 0)));
  dockItems.forEach((item, index) => {
    item.addEventListener('focus', () => setDockTargets(dockItems.map((_, i) => i === index ? 1 : Math.abs(i - index) === 1 ? .35 : 0)));
    item.addEventListener('blur', () => setDockTargets(dockItems.map(() => 0)));
  });
  motionPreference.addEventListener('change', () => {
    moveBars(false);
    if (motionPreference.matches) {
      cancelAnimationFrame(dockFrame);
      dockFrame = null;
      dockValues.fill(0);
      dockVelocity.fill(0);
      dockTargets.fill(0);
      dockItems.forEach(item => item.style.setProperty('--dock-growth', '0'));
    }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => section.classList.toggle('is-in-view', entries[0].isIntersecting), { rootMargin: '100px' }).observe(section);
  } else section.classList.add('is-in-view');
  document.addEventListener('visibilitychange', () => section.classList.toggle('is-page-hidden', document.hidden));
})();
