// Summarised from the public repository READMEs on 24 October 2026.
module.exports = ({ p, list, table, image, flow, callout, faq }) => [
  {
    id: 'voteready', title: 'VoteReady', category: 'Full-stack AI application',
    type: 'Synthetic civic-tech prototype', role: 'Full-stack & AI engineering',
    scope: 'Household SIR navigation demo', repository: 'VoteReady',
    readmeSha: '7643b186685486970dcaad07eb53e773b5d2f58b', checked: '24 October 2026',
    live: 'https://voteready-alpha.vercel.app/',
    summary: 'One household. Different voter situations. One clear action plan. A synthetic prototype combining multilingual AI assistance with deterministic rules and explicit citizen confirmation.',
    nextSummary: 'A household navigator combining multilingual interpretation, clear action plans, and explicit confirmation.',
    preview: '/assets/work/voteready/01-landing.webp', previewAlt: 'VoteReady landing page for the synthetic household navigator',
    stack: [['Next.js','next'],['React','react'],['TypeScript','typescript'],['Supabase'],['PostgreSQL','postgres'],['Prisma','prisma'],['Gemini','gemini'],['Zod'],['Playwright'],['Vercel','vercel']],
    sections: [
      { title: 'A household needs more than one status', body:
        p('A family can share an address while its members face very different voter-record situations. A single household-level status hides the difference between a scheduled hearing, an unresolved current record, and a historical record that still needs matching.') +
        p('VoteReady checks each member independently and turns those situations into a prioritised action plan. The demonstration follows four fictional people across three official assignments, with separate record, notice, and preparation states.') +
        callout('Independent synthetic prototype. VoteReady is not affiliated with the Election Commission of India, does not determine voter eligibility, and does not contact government systems. All records, notices, credentials, and official responses in the demo are fictional or simulated.'),
        media: { src:'/assets/work/voteready/03-household-dashboard.png', alt:'VoteReady household dashboard showing separate member situations and actions', caption:'A household view keeps individual situations and next actions visible.' }
      },
      { title: 'AI interprets. Rules decide.', body:
        p('The application separates interpretation from decisions. Gemini reads visible clues from a Telugu historical roll and returns bounded English transliterations. Zod validates the structured output before deterministic rules rank possible matches.') +
        flow(['Visible roll clues', 'Gemini interpretation + transliteration', 'Zod-validated structured output', 'Deterministic candidate ranking', 'Citizen reviews and confirms']) +
        p('The fixture produces similarity scores of 82, 79, and 78 out of 100. These are rule-based ranking scores, not identity probabilities or confidence that a person has been found. The citizen must explicitly confirm the candidate.'),
        media: { src:'/assets/work/voteready/04-telugu-matcher.png', alt:'VoteReady Telugu historical-record matcher with ranked candidates', caption:'Multilingual interpretation assists a reviewable matching workflow; it does not establish identity.' }
      },
      { title: 'Keep missing information missing', body:
        p('An incomplete notice leaves four important fields unknown: the reason, time, venue, and evidence requirements. The application preserves those unknowns instead of filling them with plausible instructions.') +
        p('A separately labelled simulated clarification can supply the missing details and three preparation items. Their provenance remains visible, so extracted notice content and simulated follow-up information stay distinguishable.') +
        image('/assets/work/voteready/06-hearing-preparation.png','VoteReady hearing preparation screen with known details and next steps','Preparation follows known information and explicitly labelled clarification.')
      },
      { title: 'From interface to persistent workflow', body:
        p('Next.js, React, and TypeScript provide the application interface. Supabase PostgreSQL and Prisma persist household and workflow state, while Gemini supplies bounded interpretation behind structured schemas.') +
        p('The repository documents an end-to-end build with Codex, including the application, validation gates, and deployed workflow checks. Session persistence allows the demonstration to continue after a reload.') +
        image('/assets/work/voteready/07-architecture.webp','VoteReady architecture diagram from the repository README','The repository architecture separates application state, AI interpretation, and validation.')
      },
      { title: 'Trade-offs', body: table(['Choice','Reason','Boundary'],[
        ['Synthetic records and simulated responses','Demonstrate the full workflow without using real voter information.','Results do not establish real-world electoral accuracy.'],
        ['Deterministic ranking after AI interpretation','Keep candidate ordering inspectable.','Ranking quality still depends on extraction quality and the chosen rules.'],
        ['Explicit citizen confirmation','Make identity selection a deliberate action.','The demo cannot verify a real person’s identity.'],
        ['Structured output and preserved unknowns','Constrain the interface and expose missing information.','Schema validity alone does not prove factual correctness.']
      ],true) },
      { title: 'What the checks demonstrate', body:
        p('The README reports the following checks for the synthetic demonstration. These validate implementation behaviour against fixtures, rather than voter eligibility or accuracy on real electoral records.') +
        table(['Reported check','Result'],[
          ['Unit tests','53 / 53 passed'],['Browser end-to-end tests','11 / 11 passed'],['Public deployed workflow checks','10 / 10 passed'],['Observed browser console errors','0'],['Responsive viewports','375, 430, 1280, and 1440 px'],['Missing notice fields preserved as unknown','4 / 4']
        ]) +
        p('The fixture contains four household members, two notices, four open actions, and fifteen historical records. Typecheck, lint, build, database, and privacy checks were also completed before deployment.')
      },
      { title: 'Next questions', body:
        p('The next evaluation step is a larger synthetic multilingual set, measuring Top-1 and Top-3 matching accuracy, extraction precision and recall, false inferences, and schema validity.') +
        p('AI request latency is another documented limitation. Repeated p50 and p95 latency and cost measurements would be more useful than treating the README’s single-run observations as a performance guarantee.')
      },
      { title: 'FAQ', body: faq([
        ['Is VoteReady an official government service?','No. It is an independent synthetic prototype with no ECI affiliation or government-system connection.'],
        ['Do I need to enter real voter information?','No. The demonstration uses fictional people and records. Its credentials, notices, and official responses are simulated.'],
        ['Does AI choose a person’s identity or eligibility?','No. AI interprets visible clues, deterministic rules rank candidates, and a citizen explicitly confirms a selection. The prototype does not determine eligibility.'],
        ['What do the test results measure?','Application behaviour on synthetic fixtures, browser workflows, and deployment checks. They do not measure accuracy against real electoral records.']
      ]) }
    ]
  },
  {
    id: 'ps-prep', title: 'PS-Prep', category: 'Learning platform',
    type: 'Programming preparation platform', role: 'Full-stack & AI engineering',
    scope: 'College Project School preparation', repository: 'ps-prep',
    readmeSha: '1bc1ab1e2dbd4d0e8a2e4a2f02b9c01f92a7613e', checked: '24 October 2026',
    summary: 'Programming practice, a browser-based Python editor, detailed solutions, and a problem-aware AI tutor in one place. Built for college Project School preparation and improved through student feedback.',
    nextSummary: 'A programming practice platform with Python execution and a tutor that understands the current problem.',
    preview: '/assets/work/ps-prep/home.webp', previewAlt: 'PS-Prep homepage with programming practice topics and exam preparation overview',
    stack: [['React','react'],['Vite'],['Tailwind CSS','tailwind'],['Monaco Editor'],['Piston API'],['Supabase'],['Gemini','gemini']],
    sections: [
      { title: 'Bring the preparation into one place', body:
        p('Before the college Project School selection test, programming materials, question sets, solutions, compiler tools, and chatbot conversations were scattered. Practising a single problem meant moving between several tools.') +
        p('PS-Prep combines that workflow into a focused preparation platform: browse a problem, write Python, run it, inspect the output, reveal an explanation, and ask for contextual guidance. Its question bank contains more than 200 questions across over ten topics.') +
        callout('Built for a specific student preparation problem, with the interface refined through actual use and feedback.'),
        media: { src:'/assets/work/ps-prep/question-library.webp', alt:'PS-Prep question library with real programming exercises grouped by Strings, Lists, and Tuples', caption:'The live question library groups practice problems by topic and difficulty.' }
      },
      { title: 'A complete practice loop', body:
        p('Students browse questions by topic and difficulty, then write Python in a Monaco-powered browser editor. Piston executes the code and returns standard output or errors. A solution and detailed explanation can be revealed when needed.') +
        flow(['Choose a topic + problem', 'Write Python in Monaco', 'Supply stdin + run with Piston', 'Inspect output or errors', 'Review an explanation or ask the tutor']) +
        p('Questions and topics are stored dynamically in Supabase. React, Vite, React Router, and Tailwind provide the responsive application interface.') +
        image('/assets/work/ps-prep/playground.webp','PS-Prep coding playground with the Maximum Subarray Sum problem, Monaco Python editor, stdin field, output panel, and contextual AI tutor','The coding workspace keeps the problem, editor, input, and tutor together. Captured locally with the real question bank.')
      },
      { title: 'The feedback that changed the editor', body:
        p('The initial version made programs using <code>input()</code> inconvenient to practise. Student feedback made that gap clear: running code was useful, but students also needed a straightforward way to supply input.') +
        p('A dedicated Command Line Input field now collects standard input before the student presses Run. The supplied text goes to Piston with the code, allowing input-based problems without building a full interactive terminal.') +
        callout('This is pre-supplied stdin, not a live terminal conversation. The trade-off keeps the execution workflow simple and directly addresses the reported need.')
      },
      { title: 'A tutor with the problem in context', body:
        p('The tutor receives the current problem’s title and description, the student’s code, and their question. Its instructions favour concise hints and explanations before handing over a complete solution.') +
        flow(['Problem + current code + student question', 'Supabase Edge Function', 'Gemini 2.5 Flash', 'Contextual hint or explanation']) +
        p('The server-side Edge Function provides the boundary to Gemini. Keeping the current exercise in the request avoids asking the student to copy their problem and code into a separate generic chat.')
      },
      { title: 'Trade-offs', body: table(['Choice','Reason','Cost'],[
        ['Pre-supplied stdin','Support common input-based exercises with a small interface.','No interactive input during execution.'],
        ['Python-focused execution','Focus on the immediate preparation workflow.','Other programming languages are outside the execution scope.'],
        ['Problem-aware tutoring','Ground guidance in the actual exercise and current code.','AI suggestions can still be incorrect.'],
        ['Curated college preparation','Make the question bank relevant to the intended test.','It is not a general competitive-programming judge or IDE.']
      ],true) },
      { title: 'Used, then improved', body:
        p('The README reports that the platform was shared through college WhatsApp groups and used by roughly 100+ students during exam preparation. This is the project author’s account of adoption, rather than an independently measured analytics result.') +
        p('The most concrete outcome was the feedback loop: students encountered an execution limitation, reported it, and the platform gained a dedicated stdin workflow. The repository does not publish accuracy, latency, or test-pass benchmarks.')
      },
      { title: 'Boundaries & future improvements', body:
        p('Execution is Python-only and uses input supplied before a run. There is no hidden-test online judge, and AI guidance still needs a student’s judgement.') +
        p('The README proposes automated test cases, more language support, progress tracking, stronger automated testing, structured hint levels, richer question metadata, and student contributions as future improvements. These are next steps, not shipped features.')
      },
      { title: 'FAQ', body: faq([
        ['What is PS-Prep designed for?','Programming practice for the college Project School selection process, bringing questions, Python execution, solutions, and tutoring into one workflow.'],
        ['Can I use input() in a program?','Yes. Enter the expected input in the Command Line Input field before running. It is passed as stdin; it is not an interactive terminal.'],
        ['Does the tutor see the code I am working on?','Yes. Its context includes the current problem, current code, and student question so it can offer relevant hints.'],
        ['Does it grade against hidden tests?','No. A hidden-test online judge is outside the current implementation. Automated test cases are listed as future work.']
      ]) }
    ]
  },
  {
    id: 'contextai', title: 'ContextAI', category: 'Backend RAG system',
    type: 'Team hackathon project', role: 'Core backend developer · RAG pipeline',
    scope: 'WhatsApp chat analysis', repository: 'ContextAI',
    readmeSha: 'ccd67d90cbf6bb938170451b82b4aaff22ad24d4', checked: '24 October 2026',
    summary: 'Turn noisy WhatsApp exports into relevant answers, action items, decisions, and key facts. A retrieval-augmented chat analyser with a Python backend and PostgreSQL vector search.',
    nextSummary: 'A backend RAG pipeline that turns exported conversations into structured, searchable context.',
    preview: '/assets/work/contextai/dashboard.webp', previewAlt: 'ContextAI WhatsApp dashboard with chat selection and analysis controls',
    stack: [['Python','python'],['Gemini','gemini'],['PostgreSQL','postgres'],['pgvector'],['Vector embeddings'],['Regex parsing']],
    sections: [
      { title: 'Find the useful signal in a chat export', body:
        p('Group conversations mix decisions, tasks, repeated messages, and system metadata. Scrolling through a raw WhatsApp export makes it difficult to find an answer or recover the commitments buried in the conversation.') +
        p('ContextAI ingests exported <code>.txt</code> files and builds a retrieval-augmented analysis workflow. A natural-language question retrieves relevant conversation context before Gemini produces a structured response.') +
        callout('A team hackathon project. My responsibility was the core backend architecture and the entire RAG pipeline.'),
        media: { src:'/assets/work/contextai/dashboard.webp', alt:'ContextAI WhatsApp dashboard showing a selected group conversation, message count, analysis depth, and Analyze Chat button', caption:'The WhatsApp workspace brings chat selection and analysis controls into one view. Private chat names are redacted.' }
      },
      { title: 'From raw text to retrieved context', body:
        p('Custom parsing and regular expressions remove timestamps, system messages, and metadata noise. Cleaned message events are embedded and stored in PostgreSQL with pgvector.') +
        flow(['WhatsApp .txt export', 'Parse + clean message events', 'Generate embeddings', 'PostgreSQL + pgvector', 'Cosine similarity · top 5 context items', 'Gemini → structured JSON']) +
        p('For each question, cosine-similarity search retrieves the five most relevant context items. Those retrieved messages form the context for synthesis rather than sending every message as an undifferentiated prompt.')
      },
      { title: 'Structured answers with a clear contract', body:
        p('The response prompt organises output into three categories: <strong>Action Items</strong>, <strong>Decisions Made</strong>, and <strong>Key Facts</strong>. A typed JSON structure gives the consuming application predictable fields.') +
        p('My implementation work covered the vector-storage model, semantic top-five retrieval, preprocessing, and prompt/output structure. The workflow supports natural-language questions and contextual task extraction.') +
        callout('A structured response constrains the output format. It does not, on its own, prove that every extracted fact is correct or eliminate hallucinations.')
      },
      { title: 'Trade-offs', body: table(['Choice','Reason','Open question'],[
        ['Custom export parsing','Remove common metadata and system noise before embedding.','How well does parsing generalise across export formats?'],
        ['PostgreSQL + pgvector','Store vectors and retrieve semantic context in one database.','How should indexing and query cost evolve with larger exports?'],
        ['Top-five semantic retrieval','Keep synthesis context focused.','Are all messages needed for a decision actually retrieved?'],
        ['Typed JSON categories','Offer predictable fields for tasks, decisions, and facts.','How often are outputs valid and grounded in the source messages?']
      ],true) },
      { title: 'Delivered scope & validation questions', body:
        p('The README documents a working backend pipeline for ingestion, noise reduction, vector storage, retrieval, and structured synthesis. It does not report an accuracy benchmark, latency measurements, or a test-pass count.') +
        p('Useful follow-up evaluation would measure retrieval relevance, factual grounding, action-item completeness, JSON validity, and performance across different chat-export formats. These remain validation questions, rather than measured project results.')
      },
      { title: 'FAQ', body: faq([
        ['What does ContextAI ingest?','Exported WhatsApp .txt conversation files. Custom parsing removes system and metadata noise before embedding.'],
        ['What was your contribution?','Core backend development: the RAG architecture, preprocessing, vector-storage model, top-five retrieval, and structured response prompting. It was a team hackathon project.'],
        ['How is relevant context selected?','Cosine-similarity search in PostgreSQL with pgvector retrieves the five most relevant context items for the question.'],
        ['Does structured JSON guarantee correct answers?','No. It gives the application a predictable output format. Retrieval coverage and factual grounding still need evaluation.']
      ]) }
    ]
  }
];
