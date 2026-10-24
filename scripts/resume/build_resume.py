"""One-page resume review draft. Source facts: the user's three Oct 2026 resumes.

Open-source statuses verified against GitHub on 24 October 2026:
  https://github.com/Agenta-AI/agenta/pull/7701 (merged)
  https://github.com/pydantic/logfire/pull/2650 (open)
  https://github.com/stanfordnlp/dspy/pull/10563 (open)
Validation counts are the local results documented in the contributions.
The approved PDF is linked from the portfolio navigation.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
import pymupdf
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/assets/resume/Mohammad_Mahaboob_Ashraf_Resume.pdf'
QA = ROOT / 'tmp/pdfs/resume-review'
OUT.parent.mkdir(parents=True, exist_ok=True)
QA.mkdir(parents=True, exist_ok=True)

for name, filename in [('Arial', 'arial.ttf'), ('Arial-Bold', 'arialbd.ttf'), ('Arial-Italic', 'ariali.ttf'), ('Arial-BoldItalic', 'arialbi.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / filename)))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic', boldItalic='Arial-BoldItalic')

W, H = 612, 792
LEFT, RIGHT = 54, 54
WIDTH = W - LEFT - RIGHT
BODY_SIZE, LEADING = 9.1, 11
INK = colors.HexColor('#111111')
LINK = '#164578'
styles = {
    'body': ParagraphStyle('body', fontName='Arial', fontSize=BODY_SIZE, leading=LEADING, textColor=INK),
    'bullet': ParagraphStyle('bullet', fontName='Arial', fontSize=BODY_SIZE, leading=LEADING, leftIndent=11, firstLineIndent=0, bulletIndent=2, textColor=INK, bulletFontName='Arial', bulletFontSize=9.1),
    'title': ParagraphStyle('title', fontName='Arial-Bold', fontSize=9, leading=11, textColor=INK),
    'meta': ParagraphStyle('meta', fontName='Arial-Italic', fontSize=8.1, leading=9.6, textColor=colors.HexColor('#333333')),
    'center': ParagraphStyle('center', fontName='Arial', fontSize=8.8, leading=10.6, alignment=TA_CENTER, textColor=INK),
}
c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
c.setTitle('Mohammad Mahaboob Ashraf | Software & AI Engineer')
c.setAuthor('Mohammad Mahaboob Ashraf')
c.setSubject('Software and AI engineering resume with open-source contributions')
y = H - 43
positions = []

def link(label, url):
    return f'<a href="{url}" color="{LINK}"><u>{label}</u></a>'

def para(text, style='body', after=1.2, bullet=False):
    global y
    p = Paragraph(text, styles[style], bulletText='\u2022' if bullet else None)
    _, height = p.wrap(WIDTH, 1000)
    positions.append((style, y - height, y, text))
    p.drawOn(c, LEFT, y - height)
    y -= height + after

def centered(text, size, bold=False, after=2):
    global y
    st = ParagraphStyle('centered', parent=styles['center'], fontSize=size, leading=size+1.6, fontName='Arial-Bold' if bold else 'Arial')
    p = Paragraph(text, st)
    _, h = p.wrap(WIDTH, 1000)
    p.drawOn(c, LEFT, y-h)
    y -= h+after

def section(text):
    global y
    y -= 4.2
    c.setFont('Arial-Bold', 9.6)
    c.setFillColor(INK)
    c.drawString(LEFT, y-9.6, text)
    c.setStrokeColor(colors.HexColor('#444444'))
    c.setLineWidth(.5)
    c.line(LEFT, y-12.2, W-RIGHT, y-12.2)
    y -= 17

def entry(title, date='', meta=None):
    global y
    date_width = pdfmetrics.stringWidth(date, 'Arial', 8.6) if date else 0
    p = Paragraph(title, styles['title'])
    _, h = p.wrap(WIDTH-date_width-(10 if date else 0), 1000)
    p.drawOn(c, LEFT, y-h)
    if date:
        c.setFont('Arial', 8.6)
        c.setFillColor(INK)
        c.drawRightString(W-RIGHT, y-8.9, date)
    y -= h+1
    if meta:
        para(meta, 'meta', after=1.2)

def bullet(text, after=1.35):
    para(text, 'bullet', after=after, bullet=True)

centered('MOHAMMAD MAHABOOB ASHRAF', 16.5, bold=True, after=1)
centered('Software &amp; AI Engineer', 9.6, after=2.5)
centered('Hyderabad, India  |  +91 91542 10067  |  '+link('mahaboobashraf12@gmail.com', 'mailto:mahaboobashraf12@gmail.com')+'  |  '+link('LinkedIn','https://www.linkedin.com/in/mohammad-mahaboob-ashraf-a0b17b321/')+'  |  '+link('GitHub','https://github.com/Mahaboob-Ashraf'), 8.5, after=5)
para('Computer Science undergraduate and AI Research Intern building evaluated AI systems, full-stack products, and reliable backend services. Open-source contributor to Agenta, Pydantic Logfire, and DSPy.', 'center', after=1.5)

section('EDUCATION')
entry('Osmania University<span fontName="Arial">, Hyderabad</span>', 'Expected Aug 2028')
para('B.E. Computer Science Engineering  |  <b>CGPA: 8.9/10</b>', after=0)

section('PROJECTS')
entry('Amana - Agentic Commerce Gateway <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/Agentic-Commerce-Gateway')+' / '+link('Live','https://agentic-commerce-gateway-web.vercel.app/')+'</span>', 'Aug 2026 - Present', 'Java, Spring Boot, Next.js, React, TypeScript, PostgreSQL/pgvector, Gemini, Razorpay')
bullet('Built a full-stack <b>agentic commerce system</b>: Gemini interprets multimodal intent and plans; deterministic Spring Boot services control authorization, payment execution, reconciliation, and refunds.')
bullet('Improved valid-product <b>Recall@5 from 55% to 76%</b> on 80 labelled cases; achieved <b>92% intent-field accuracy</b> across 52 utterances and validated <b>250/250 deterministic safety cases</b> through automated CI.')

y -= 2
entry('RepoPilot - Evidence-Grounded Coding Agent <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/Repo-Pilot')+'</span>', 'Aug 2026 - Sep 2026', 'Python, FastAPI, Tree-sitter, BM25, Chroma, LangGraph, React/TypeScript, Docker')
bullet('Built a local-first repair agent with hybrid repository retrieval, <b>hash-bound human approvals</b>, scoped patches, and Docker-isolated testing; passed <b>33/33 deterministic safety scenarios</b>.')
bullet('On the same six frozen defects, hosted Gemini repaired <b>6/6</b> versus local CPU Gemma\'s <b>1/6</b>; median workflow latency fell from <b>111s to 21s</b> with retrieval, prompts, and approval policy held fixed.')

y -= 2
entry('HookRelay - Reliable Webhook Delivery Platform <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/HookRelay')+'</span>', 'Aug 2026', 'TypeScript, Node.js, Fastify, PostgreSQL, Redis/BullMQ, React, Docker')
bullet('Built durable webhook delivery with signed requests, bounded retries, dead-letter recovery, idempotent ingestion, and a React dashboard; <b>PostgreSQL owns delivery truth</b>, while Redis/BullMQ coordinates work.')
bullet('Verified idempotency under <b>25 parallel ingestion and replay requests</b>; measured <b>100% terminal success</b> across 3 x 500 local deliveries at <b>71-79 deliveries/second</b>.')

section('OPEN SOURCE')
entry('Agenta <span fontName="Arial"> |  '+link('PR #7701','https://github.com/Agenta-AI/agenta/pull/7701')+'  |  </span>Merged', 'Oct 2026')
bullet('Merged <b>bounded HTTPX streaming</b> for Slack-media downloads, enforcing attachment limits on decoded bytes before buffering each chunk and closing oversized responses early.', after=.5)
bullet('Added regression coverage for missing or understated metadata, gzip responses, exact byte limits, and stream cleanup; <b>216 local Slack tests passed</b>.', after=.5)
entry('Pydantic Logfire <span fontName="Arial"> |  '+link('PR #2650','https://github.com/pydantic/logfire/pull/2650')+'  |  Open PR</span>', 'Oct 2026')
bullet('Implemented separate root traces for FastAPI background-task batches, linked to the original request through <b>OpenTelemetry span links</b>, enabling independent tail-sampling decisions.', after=.5)
bullet('Preserved callback ordering, exceptions, cancellation, and context restoration; documented scope and tested all four request/background sampling combinations. <b>35 focused tests passed</b>.', after=.5)
entry('DSPy <span fontName="Arial"> |  '+link('PR #10563','https://github.com/stanfordnlp/dspy/pull/10563')+'  |  Open PR</span>', 'Oct 2026')
bullet('Proposed exact prerelease-docs cleanup with <b>atomic stable publication</b>, immutable snapshots, and retry safety; <b>24 versioned-documentation tests passed</b>.')

section('EXPERIENCE')
entry('Drugparadigm <span fontName="Arial"> - AI Research Intern  |  Hyderabad</span>', 'Oct 2025 - Present')
bullet('Developed antibody heavy/light-chain pairing models using protein-sequence embeddings over <b>1.3M+ heavy-chain sequences</b>; built preprocessing, leakage detection, and training-data validation pipelines.')
bullet('Outperformed ImmunoMatch on the same held-out benchmark: <b>Kappa 0.798 vs 0.750 ROC-AUC; Lambda 0.823 vs 0.783</b>. Benchmark analysis also exposed shortcuts in synthetic negative-pair construction.')
entry('iHub-Data, IIIT Hyderabad <span fontName="Arial"> - AI Research Intern</span>', 'Aug 2025 - Oct 2025')
bullet('Fine-tuned <b>YOLOv8m</b> on 1,350+ annotated UAV images, achieving <b>96.7% mAP@50, 94.7% precision, and 93.2% recall</b>; applied targeted augmentation and AdamW tuning.')

section('TECHNICAL SKILLS')
para('<b>Languages:</b> Java, Python, TypeScript/JavaScript, SQL', after=.6)
para('<b>Full Stack:</b> React, Next.js, Vite, Node.js, Fastify, Spring Boot, FastAPI, REST APIs, PostgreSQL, Redis, BullMQ', after=.6)
para('<b>AI / ML:</b> LLMs, Agentic Workflows, Tool Calling, RAG, AI Evaluation, Embeddings, LangGraph, PyTorch, Gemini, Ollama', after=.6)
para('<b>Engineering:</b> Codex, Docker, GitHub Actions, Testing, Data Pipelines, API Integrations, Git', after=.6)
para('<b>Fundamentals:</b> Data Structures &amp; Algorithms, OOP, DBMS', after=0)

if y < 35:
    raise RuntimeError(f'Resume content extends below the bottom margin: y={y:.2f}')
c.showPage()
c.save()
doc = pymupdf.open(OUT)
assert len(doc) == 1
doc[0].get_pixmap(matrix=pymupdf.Matrix(2, 2)).save(QA / 'resume-page-1.png')
reader = PdfReader(OUT)
text = reader.pages[0].extract_text()
assert all(s in text for s in ['OPEN SOURCE', 'Agenta', 'Pydantic Logfire', 'DSPy', 'Open PR', 'Merged', 'TECHNICAL SKILLS'])
assert len(reader.pages) == 1
assert '\ufffd' not in text
links = [a.get_object().get('/A', {}).get('/URI') for a in reader.pages[0].get('/Annots', [])]
assert all(url in links for url in ['https://github.com/Agenta-AI/agenta/pull/7701','https://github.com/pydantic/logfire/pull/2650','https://github.com/stanfordnlp/dspy/pull/10563'])
print(f'Created {OUT}\nPages: 1; bottom margin: {y:.1f}pt; links: {len(links)}; words: {len(text.split())}')
