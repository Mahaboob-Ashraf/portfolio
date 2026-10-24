// Editorial summaries of the projects' READMEs, checked 23 October 2026.
// Metrics retain the README's evaluation scope; proposed work is labelled as such.
module.exports = ({ p, list, table, image, flow, callout, faq }) => [
  {
    id: 'repopilot', title: 'RepoPilot', category: 'AI developer tooling',
    type: 'Local-first repair agent', role: 'Software & AI engineering',
    scope: 'Python repositories · two human checkpoints',
    repository: 'Repo-Pilot', readmeSha: 'eaba8a42576a35b699aabf8fd4dc6158dfe206ce',
    summary: 'Evidence-grounded code repair for Python repositories. Retrieve the right context, review the plan, test an exact patch, and keep the human in control.',
    nextSummary: 'A coding repair agent with grounded evidence, isolated tests, and explicit human approvals.',
    preview: '/assets/work/repopilot/new-repair.webp', previewAlt: 'RepoPilot review workbench, ready to start a repair',
    stack: [['Python','python'],['FastAPI','fastapi'],['React','react'],['TypeScript','typescript'],['LangGraph','langgraph'],['tree-sitter'],['SQLite / BM25'],['Chroma'],['Gemma'],['Gemini','gemini'],['Pydantic'],['Docker','docker'],['pytest']],
    sections: [
      { title: 'A repair agent with a human at the controls', body:
        p('A useful code repair needs more than a plausible diff. It needs relevant repository context, a diagnosis that points to real evidence, a bounded file scope, and tests that ran against the exact patch being reviewed.') +
        p('RepoPilot turns that into an inspectable workflow. Given a Python repository and an issue, it retrieves structural evidence, proposes a repair plan, and waits for approval. Only then does it generate a patch in an isolated workspace, run pytest in Docker, and ask for a second approval before exporting it.') +
        callout('The product is the chain of evidence: what was retrieved, why a change was planned, what changed, what tests ran, and what the reviewer approved.'),
        media: {src:'/assets/work/repopilot/new-repair.webp', alt:'RepoPilot new repair screen', caption:'The review workbench exposes each stage of a repair in one place.'}
      },
      { title: 'Find the evidence before proposing the fix', body:
        p('Repository discovery and tree-sitter parsing produce code chunks with source provenance. Retrieval combines two complementary signals: SQLite FTS5 / BM25 for lexical matches and EmbeddingGemma with Chroma for semantic similarity.') +
        p('Reciprocal Rank Fusion combines the ranked lists without relying on their score scales. One-hop structural expansion adds related local imports, parent/child relationships, and tests. Whole chunks are then packed into a bounded <code>ContextPack</code> with hard budget limits.') +
        flow(['Repository + issue', 'tree-sitter chunks + provenance', ['SQLite FTS5 / BM25','EmbeddingGemma + Chroma'], 'Reciprocal Rank Fusion', 'One-hop structural expansion', 'Bounded ContextPack']) +
        p('Dense retrieval can fail or become unavailable. In that case, the system can explicitly degrade to lexical evidence rather than concealing the missing retrieval path. The repair plan still has to pass exact evidence-citation checks.') +
        p('On the frozen M8-v2 retrieval suite, reducing returned depth from ten to five preserved full hybrid Hit@1, Hit@5, and MRR while improving context precision and reducing token waste.')
      },
      { title: 'Two approvals, bound to exact artifacts', body:
        p('The first checkpoint reviews diagnosis, repair steps, exact file scope, supporting evidence, and suggested tests. The approved plan and scope are hash-bound: a later model response cannot silently expand that authority.') +
        p('Patch generation uses exact-match replacements, rejects stale source, and enforces the approved files. A canonical diff and patch hash identify the candidate that enters testing.') +
        image('/assets/work/repopilot/plan-review.webp','RepoPilot plan review with retrieved evidence and approval controls','Checkpoint 1: inspect the plan and its supporting evidence before patch generation.') +
        p('The second checkpoint presents the final diff, changed files, Docker test evidence, patch/test identity, and attempt history. Final approval binds to the exact tested patch. The output is an export; the system does not autonomously apply it, commit, push, merge, or open a pull request.')
      },
      { title: 'Test in isolation. Keep retries bounded.', body:
        p('The canonical repository is not directly edited during a repair. Tests run against a disposable snapshot in a restricted Docker runner, with bounded resources and no autonomous image pull during the repair.') +
        p('A genuine test failure may trigger one critic-assisted retry. The critic must remain grounded, the approved scope still applies, and the total patch-attempt limit remains two. Provider errors and validator failures do not become permission to enter an unbounded repair loop.') +
        image('/assets/work/repopilot/patch-tests.webp','RepoPilot patch diff and Docker test results','Patch review keeps the proposed changes beside the test evidence.') +
        p('SQLite workflow checkpoints support durable pause and resume. The React workbench can revisit completed stages in read-only form; workflow authority remains in the backend, rather than in the navigation state of the UI.')
      },
      { title: 'Trade-offs', body:
        table(['Choice','Why','Cost'],[
          ['Hybrid lexical + dense retrieval','Identifiers and semantic relevance contribute different evidence.','Local embeddings add availability and configuration concerns.'],
          ['Whole-chunk context budgets','Keep provenance intact and enforce a hard context bound.','Relevant surrounding material can still consume tokens.'],
          ['Two human checkpoints','Make scope and tested patch identity explicit.','Repairs require reviewer attention at two stages.'],
          ['Docker test snapshots','Separate execution from the canonical repository.','Docker and a configured test image are required locally.'],
          ['Local generation with an optional hosted provider','Keep a local path while allowing controlled provider comparisons.','CPU generation is slower; Gemini sends bounded generation context off-machine.'],
          ['Python-only V1','Concentrate on depth, validation, and measurable evidence.','Other languages are outside the implemented scope.']
        ],true)
      },
      { title: 'Measured results', body:
        p('The controlled provider comparison held the retrieval pipeline, prompts, validators, approvals, Docker policy, and retry limit fixed. It ran the same six frozen defects across three public Python repositories; only the generation provider changed.') +
        table(['Metric','Local Gemma · CPU','Gemini 3.1 Flash-Lite'],[
          ['Successful repairs','1 / 6','6 / 6'],['Grounded plans','3 / 6','6 / 6'],['Exact citation validity','3 / 6','6 / 6'],['Median planner latency','85.169 s','2.288 s'],['Median workflow latency','110.912 s','20.928 s']
        ]) +
        p('The frozen M8-v2 safety suite passed <strong>33 / 33 deterministic scenarios</strong>, covering out-of-scope edits, invented evidence, stale approvals, patch identity, retry limits, canonical-repository mutation, and export ordering. Final project verification included <strong>350 backend tests</strong> plus the frontend test, build, and typecheck gates.') +
        callout('These are small, controlled repository evaluations. The six-case comparison is not SWE-bench, a general model ranking, or an estimate of production repair accuracy.') +
        p('<a href="https://github.com/Mahaboob-Ashraf/Repo-Pilot/tree/main/evaluation/results" target="_blank" rel="noopener noreferrer">Explore the committed evaluation reports ↗</a>')
      },
      { title: 'Current boundaries & next questions', body:
        p('V1 deliberately excludes unrestricted shell access, autonomous Git operations, multi-agent swarms, a full IDE, and multi-language support. Its goal is an inspectable repair loop with bounded authority.') +
        p('The controlled retrieval and repair suites leave a clear next evaluation question: how well do the same boundaries and retrieval choices generalize to a larger, more varied issue set? The README does not claim that result yet.') +
        p('Local CPU latency and embedding-provider instability are also documented limitations. The hosted Gemini path improves the measured workflow latency, but changes where generation context is processed. That remains an explicit configuration choice.')
      },
      { title: 'FAQ', body: faq([
        ['Does RepoPilot change my repository automatically?','No. Repairs are prepared in an isolated workspace and exported only after final approval. RepoPilot does not automatically apply a patch, commit, push, merge, or create a PR.'],
        ['What are the two human checkpoints?','First, approve the evidence-grounded repair plan and exact file scope. Second, review and approve the exact tested patch before export. Approvals are bound to artifact identity.'],
        ['Can it work with a local model?','Yes. Ollama / local Gemma is the default generation path. An optional Gemini provider uses the same workflow and validation boundaries. Local retrieval can remain independently configured.'],
        ['What happens if the tests fail?','A genuine test failure may receive one grounded critic-assisted retry. There are at most two patch attempts; there is no unbounded repair loop.'],
        ['Which repositories does V1 support?','Python repositories. The implementation uses tree-sitter parsing and runs pytest in a restricted Docker sandbox. Multi-language support is outside V1.'],
        ['Do six successful repairs imply production accuracy?','No. The hosted provider repaired six controlled defects in the frozen comparison. That is useful bounded evidence, not an independent benchmark or a production accuracy estimate.']
      ]) }
    ]
  },
  {
    id:'hookrelay', title:'HookRelay', category:'Webhook infrastructure', type:'Webhook delivery system',
    role:'Backend & full-stack engineering', scope:'Durable delivery · local reference implementation',
    repository:'HookRelay', readmeSha:'7413d595555b83aec3be955a78712f575d1d5008',
    summary:'Reliable webhook delivery with durable state, signed requests, bounded retries, and dead-letter recovery. Every attempt stays inspectable.',
    nextSummary:'Durable webhook delivery with bounded retries, signed requests, and complete attempt history.',
    preview:'/assets/work/hookrelay/dashboard.webp', previewAlt:'HookRelay operations dashboard and delivery list',
    stack:[['TypeScript','typescript'],['Node.js','node'],['Fastify'],['PostgreSQL','postgres'],['Drizzle ORM','drizzle'],['Redis','redis'],['BullMQ'],['React','react'],['Vite'],['Zod'],['Vitest'],['Docker','docker']],
    sections:[
      { title:'A successful request is only the beginning', body:
        p('Outbound webhooks need a reliability layer between accepting an event and a receiver actually processing it. Network failures, timeouts, transient HTTP errors, and duplicate requests are normal parts of that path.') +
        p('HookRelay is a production-style local reference implementation of that layer. It accepts events idempotently, commits delivery state to PostgreSQL, schedules asynchronous work through Redis and BullMQ, signs outgoing requests, and records every attempt.') +
        callout('PostgreSQL owns delivery truth. Redis coordinates work. Delivery is at least once, so receivers still need to be idempotent.'),
        media:{src:'/assets/work/hookrelay/dashboard.webp',alt:'HookRelay dashboard showing delivery states and operational metrics',caption:'A PostgreSQL-backed operations view of deliveries, attempts, and recovery.'}
      },
      { title:'Durable state, separate from execution', body:
        p('The Fastify API validates endpoint and event input with Zod. Event acceptance creates an event and its initial delivery in one PostgreSQL transaction, before queue scheduling is attempted.') +
        p('BullMQ carries the durable <code>deliveryId</code>. The worker reloads canonical event and endpoint data from PostgreSQL, starts a persisted attempt, signs and sends the request, classifies the response, and writes the outcome back to the database.') +
        image('/assets/work/hookrelay/architecture.webp','HookRelay architecture showing the API, PostgreSQL, Redis, worker, receiver, and dashboard','Queue infrastructure coordinates execution without becoming the source of delivery truth.') +
        p('The dashboard reads deliveries, attempt timelines, retry scheduling, latency, failures, and replay lineage through the API. Metrics are calculated from PostgreSQL state rather than inferred from transient queue contents.')
      },
      { title:'One event, even when requests race', body:
        p('<code>POST /events</code> requires an <code>Idempotency-Key</code>. The first request creates one event and one initial delivery. Repeating the same key with the same endpoint, event, and payload returns the existing records. Reusing the key for different input returns <code>409 idempotency_conflict</code>.') +
        p('PostgreSQL uniqueness makes concurrent identical requests converge. An in-memory lock would not provide the same database-backed guarantee.') +
        p('Durable acceptance comes before queue scheduling. If Redis scheduling fails, the API returns <code>503</code> with <code>durableAccepted: true</code>, asking the client to retry the same request with the same idempotency key.') +
        callout('This version deliberately exposes the PostgreSQL / Redis dual-write gap. It does not claim a transactional outbox or autonomous queue reconciliation.') +
        p('That boundary is part of the design, not a hidden promise of exactly-once execution. A receiver can process a request before a worker crashes while recording success; a later retry may deliver the same logical event again.')
      },
      { title:'Retry deliberately. Replay without erasing history.', body:
        p('Retries follow a fixed <strong>5s / 15s / 45s / 120s</strong> schedule, for a maximum of five attempts. A five-second request timeout bounds the network operation. Only failures classified as transient consume that retry budget.') +
        table(['Outcome','Classification','Action'],[
          ['HTTP 2xx','Success','Mark delivered'],['HTTP 408, 429, or 5xx','Retryable','Retry if budget remains'],['Network error or timeout','Retryable','Retry if budget remains'],['Other HTTP response','Terminal','Move directly to dead letter'],['Retryable failure on attempt five','Exhausted','Move to dead letter']
        ]) +
        image('/assets/work/hookrelay-timeline.webp','HookRelay attempt timeline with two HTTP 500 responses followed by HTTP 200','The deterministic recovery scenario succeeds on attempt three; the preceding failures remain visible.') +
        p('Only dead-letter deliveries can be replayed. Replay has its own idempotency key and creates a new linked delivery with a fresh retry budget. The source is never reset: its terminal status and original attempt history stay intact.') +
        image('/assets/work/hookrelay/dead-letter.webp','HookRelay dead-letter delivery and linked replay','Recovery creates a new delivery linked by replayedFromDeliveryId, preserving the original evidence.')
      },
      { title:'Trade-offs', body:
        table(['Choice','Why','Cost'],[
          ['PostgreSQL as the source of truth','Delivery state, attempts, metrics, and replay lineage remain durable.','The database participates in the critical execution path.'],
          ['BullMQ jobs carry only delivery IDs','Workers reload canonical records instead of trusting stale queued payloads.','Each execution needs database reads.'],
          ['Fixed retry delays and a five-attempt budget','Recovery is bounded and easy to reproduce.','This version does not implement adaptive retry policies.'],
          ['New delivery for manual replay','Preserve the failed history and give the replay an independent budget.','Operations must understand linked delivery lineage.'],
          ['Durable acceptance before scheduling','Avoid losing or duplicating durable rows when scheduling fails.','The dual-write gap needs client retry; no outbox is implemented.'],
          ['At-least-once semantics','Acknowledge the crash window between remote processing and local persistence.','Receivers must deduplicate events.']
        ],true) +
        p('Every request is authenticated with HMAC-SHA256 over <code>timestamp.rawBody</code>. The included receiver example validates timestamp freshness and compares signatures in constant time. Authentication and multi-tenancy for the platform itself remain outside the current version.')
      },
      { title:'Measured results', body:
        p('The committed local benchmark used one API process, one BullMQ worker, one PostgreSQL instance, one Redis instance, and an immediate local HTTP receiver.') +
        table(['Measurement','Local result'],[
          ['Measured runs','3 × 500 deliveries'],['Terminal success','1,500 / 1,500 · 100%'],['Delivery throughput','71.0–78.6 deliveries / second'],['Mean delivery throughput','76.0 deliveries / second'],['Ingestion throughput','426.7–599.6 events / second'],['Client-observed ingestion p95','48.5–70.0 ms']
        ]) +
        p('Two correctness tests each issued <strong>25 concurrent requests</strong>. Identical ingestion converged to one event and one initial delivery. Identical replay requests converged to one replay delivery, while the source dead letter remained unchanged.') +
        p('The deterministic receiver also exercises immediate success, <code>500 → 500 → 200</code> recovery, and exhaustion after five failures through the real API, queue, worker, signing, and database paths.') +
        callout('These are bounded local measurements, not production capacity, horizontal-scaling, multi-region, or high-availability claims.') +
        p('<a href="https://github.com/Mahaboob-Ashraf/HookRelay/blob/main/benchmarks/results/task-9-local.json" target="_blank" rel="noopener noreferrer">Read the committed benchmark evidence ↗</a>')
      },
      { title:'The boundary of this version', body:
        p('The implemented local scope includes the API, durable data model, queue worker, request signing, bounded retries, dead-letter recovery, idempotent replay, dashboard, deterministic demo, tests, and benchmark evidence.') +
        p('The next reliability extension would address the documented database / queue dual-write gap with an outbox or reconciliation mechanism. That is outside the current implementation and is not represented as shipped.') +
        p('Other deliberate non-goals are platform authentication and multi-tenancy, secret encryption or rotation, horizontal worker-capacity validation, multi-region delivery, and high-availability guarantees. Keeping those boundaries visible makes the local evidence easier to interpret.')
      },
      { title:'FAQ', body:faq([
        ['Does HookRelay guarantee exactly-once delivery?','No. Delivery is at least once. A worker can crash after a receiver processes a request but before local success is recorded, so consumers should deduplicate by event ID.'],
        ['Which responses are retried?','Network errors, five-second timeouts, HTTP 408, HTTP 429, and 5xx responses are retryable. Other non-2xx responses go directly to dead letter. The maximum is five attempts.'],
        ['What happens if queue scheduling fails?','The event and delivery have already been persisted. The API returns 503 with durableAccepted: true and asks the client to retry the same request with the same idempotency key.'],
        ['Does replay overwrite the failed delivery?','No. Replay creates a new delivery linked to the source, with its own attempt history and retry budget. The original remains a dead letter.'],
        ['How can a receiver verify a webhook?','Use the supplied event identity, timestamp, and HMAC-SHA256 signature over timestamp.rawBody. The repository includes a verifier demonstrating freshness checks and constant-time comparison.'],
        ['Is there a hosted production service?','The README describes a local reference implementation with a deterministic receiver, operations dashboard, tests, and bounded benchmarks. It does not claim a hosted production service or high-availability guarantees.']
      ]) }
    ]
  },
  {
    id:'amana', title:'Amana', category:'Agentic commerce', type:'AI commerce platform',
    role:'AI & full-stack engineering', scope:'Two agents · deterministic commerce control plane',
    repository:'Agentic-Commerce-Gateway', readmeSha:'b4b09b4112665ab656879586eda9ca266e8a00fe',
    live:'https://agentic-commerce-gateway-web.vercel.app/',
    summary:'Agentic commerce you can trust. AI understands shopping intent and merchant interfaces; deterministic software controls identity, authority, and money.',
    nextSummary:'Two commerce agents, one deterministic control plane, and explicit authority over payments.',
    preview:'/assets/work/amana-demo.webp',previewAlt:'Amana landing page with Buyer and Merchant experiences',
    stack:[['Java 25'],['Spring Boot','springboot'],['PostgreSQL','postgres'],['Next.js','next'],['React','react'],['TypeScript','typescript'],['Tailwind CSS','tailwind'],['Gemini','gemini'],['pgvector'],['Razorpay'],['JUnit 5'],['Testcontainers'],['Vercel','vercel'],['Supabase']],
    sections:[
      { title:'Let AI reason. Keep authority in software.', body:
        p('AI can understand a shopping request or diagnose a merchant API, but neither ability makes its answer financially authoritative. Amana separates those responsibilities in a deterministic trust layer for agentic commerce.') +
        p('The Merchant Agentization Agent turns merchant-approved interfaces into tested, evidence-backed capabilities. The Safe AI Buyer interprets multimodal intent, discovers eligible products, and prepares a transaction without giving the model independent authority over money.') +
        callout('There is no AI → Razorpay authority path. A purchase needs grounded evidence, an immutable proposal, exact user authorization, and a deterministic execution gate.'),
        media:{src:'/assets/work/amana-demo.webp',alt:'Amana public product landing page',caption:'Two product experiences share one deterministic commerce control plane.'}
      },
      { title:'Two agents. One control plane.', body:
        p('The backend is a Java 25 / Spring Boot 4.1.1 modular monolith. PostgreSQL is the system of record. Authority-critical rules stay inside explicit module and transaction boundaries rather than introducing unnecessary distributed-system failure modes.') +
        p('Gemini handles interpretation, multilingual and visual understanding, interface reasoning, diagnosis, and bounded planning. The application owns readiness, identity, authoritative quotes, policy evidence, proposals, authorization, exact money, execution, payment truth, and refund accounting.') +
        image('/assets/arc.webp','Amana system architecture','The system separates AI reasoning from deterministic execution and financial truth.') +
        p('The frontend uses Next.js, React, TypeScript, Tailwind CSS, and Razorpay Blade. Retrieval combines PostgreSQL full-text search, <code>pg_trgm</code>, <code>pgvector</code>, and Gemini embeddings. The deployed stack uses Vercel, Render, and Supabase; P0 requires no Kafka, BullMQ, or Redis service.')
      },
      { title:'A plausible API is not a ready capability', body:
        p('Merchant catalogues and APIs differ in money units, inventory semantics, fulfilment behaviour, policies, authentication, and response shapes. Amana starts with merchant-approved structured sources, not arbitrary website crawling.') +
        p('The agentization lifecycle moves through inspection, discovery, mapping, contract testing, observation, diagnosis, bounded repair, and retest. AI may propose a mapping or diagnose a failure. Only deterministic evidence reduction can mark a capability <code>READY</code>.') +
        image('/assets/work/amana/merchant-repair.webp','Merchant agentization proposing a money-unit repair and requesting approval','A money-semantics change is proposed for merchant approval, not silently applied.') +
        p('The demo exposes a concrete mismatch: an API returns <code>2999</code> for a ₹2,999 product, while the canonical money contract expects <code>299900</code> minor units. A rupees-to-paise repair must create a new mapping version, receive merchant approval, pass deterministic contract tests, and satisfy the readiness reducer.') +
        image('/assets/work/amana/merchant-ready.webp','Merchant capability after retesting and deterministic readiness reduction','Capability publication follows evidence and retesting, rather than a model’s confidence.')
      },
      { title:'An exact proposal before any payment', body:
        p('The Buyer can interpret typed, spoken, visual, multilingual, and conversational requests. Its execution path is stricter: eligible READY merchants, grounded catalogue records, an authoritative quote, stock and serviceability evidence, an immutable proposal, explicit authorization, and the execution gate.') +
        image('/assets/work/amana/buyer-proposal.webp','Safe AI Buyer proposal awaiting explicit user authorization','The buyer reviews and authorizes a specific transaction before execution.') +
        p('A canonical proposal hash binds authorization to the exact transaction. If execution attempts a modified amount, product, variant, merchant, currency, or provider account, the authorization no longer binds. Safety-critical missing evidence fails closed.') +
        p('Browser callbacks and provider webhooks are observations, not unquestioned financial truth. The backend binds and reduces Razorpay evidence, reconciles ambiguous outcomes, and models proposal, authorization, execution, order, payment, fulfilment, and refunds separately.') +
        p('Stable identities, constraints, and transactional locking make retries and concurrent callers converge. Durable work after commit uses a PostgreSQL transactional outbox. An uncertain provider outcome moves toward reconciliation rather than an invented success.')
      },
      { title:'Trade-offs', body:
        table(['Choice','Why','Cost'],[
          ['Deterministic authority around AI reasoning','Keep readiness, exact money, and execution application-owned.','More explicit contracts, state, and evidence handling.'],
          ['A modular monolith','Keep authority-critical invariants inside clear transaction boundaries.','Modules share a deployment boundary.'],
          ['Merchant-approved structured sources','Test known interfaces and preserve merchant authority.','Arbitrary merchant websites are not automatically supported.'],
          ['Hash-bound proposals and explicit authorization','Bind the buyer’s approval to one exact transaction.','Current purchases need on-screen authorization.'],
          ['Fail closed and reconcile unknown outcomes','Avoid guessing about safety-critical or financial state.','Ambiguity can delay execution or completion.'],
          ['Synthetic merchants and Razorpay Test Mode','Provide a reproducible reviewer-facing demonstration.','The demo does not establish production transaction or revenue claims.']
        ],true)
      },
      { title:'Measured evidence', body:
        p('The verification suites measure distinct boundaries, so their results are kept separate. These figures come from the repository’s committed evidence and README.') +
        table(['Suite','Result'],[
          ['Deterministic safety cases','250 / 250 passed · 0 hard safety violations'],['Guard-removal negative controls','12 / 12 killed'],['Concurrency scenarios','10 / 10 passed'],['Concurrent critical operations','5 operations at N=8 and N=32'],['Backend verification','297 tests · 0 failures · 2 skipped'],['Frontend verification','145 / 145 passed']
        ]) +
        p('The intent and retrieval fixtures report <strong>92.41% buyer intent field accuracy</strong>, <strong>83.58% hybrid-v3 discovery Recall@5</strong>, and <strong>76.12% valid-product Recall@5</strong>. Valid-product recall improved by 20.90 percentage points over hybrid-v2. Exact-identity precision and valid no-match accuracy were both 100% on those fixtures.') +
        p('The safety harness covers proposal integrity, money integrity, callback truth, payment and refund idempotency, capability readiness, evidence, and policy enforcement. The core <code>pnpm proof:verify</code> path runs offline without Gemini, Razorpay, or deployment services.') +
        callout('These are repository-authored deterministic and labelled fixtures. They are not an independent security certification or a production-scale benchmark. Similarity broadens discovery; it does not create transaction authority.') +
        p('<a href="https://github.com/Mahaboob-Ashraf/Agentic-Commerce-Gateway/tree/main/proof/results" target="_blank" rel="noopener noreferrer">Explore the committed proof artifacts ↗</a>')
      },
      { title:'What is live, and what comes next', body:
        p('The public demo includes Buyer, Merchant, Proof, Security, Failure Lab, Architecture, and Performance surfaces. It uses synthetic merchants and products, Razorpay Test Mode, and explicit on-screen authorization for current purchases.') +
        p('The fastest reviewer path is a Buyer request for Auralink Buds under ₹3,000, followed by the merchant money-unit repair and retest. The proof and security surfaces expose the evidence behind the authority boundaries.') +
        p('Unattended scheduled AutoBuy is not presented as complete. Native Buyer applications remain a future direction. The current system makes no production revenue, security certification, or compliance certification claim.') +
        p('The backend uses Render’s free tier and can sleep after inactivity. If the live demo is unavailable, open its <a href="https://agentic-commerce-gateway.onrender.com/actuator/health" target="_blank" rel="noopener noreferrer">health endpoint ↗</a>, wait for an UP response, then reload the product.')
      },
      { title:'FAQ', body:faq([
        ['Can the AI execute a payment on its own?','No. AI interprets and plans; the deterministic execution gate requires an exact, authorized proposal and the necessary evidence. There is no direct AI-to-Razorpay authority path.'],
        ['What makes a merchant capability READY?','Deterministic contract tests, observed evidence, and a readiness reducer. A model can propose mappings and diagnose failures, but it cannot declare readiness.'],
        ['How does Amana handle concurrent checkout attempts?','Stable identities, PostgreSQL constraints, and transactional locking make attempts converge. The documented suite covers five critical operations at eight and thirty-two concurrent callers.'],
        ['Are payments real in the public demo?','The public system uses Razorpay Test Mode and synthetic demo merchants and products. It does not claim production revenue or unattended scheduled purchasing.'],
        ['Does a browser success callback prove a payment succeeded?','No. Callbacks and webhooks are evidence observations. The backend binds provider order and payment evidence and deterministically reduces payment state; ambiguous outcomes are reconciled.'],
        ['Can the core safety proof run without hosted services?','Yes. pnpm proof:verify runs the deterministic core proof offline. Provider-backed evaluation is a separate command and should be interpreted separately.']
      ]) }
    ]
  },
  ...require('./additional-project-data.cjs')({ p, list, table, image, flow, callout, faq })
];
