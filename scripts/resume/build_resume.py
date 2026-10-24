"""One-page resume in the portfolio's established Arial/black-rule format.

Content updated from the user's supplied Mohammad_Mahaboob_Ashraf_Resume.pdf.

Open-source statuses verified against GitHub on 24 October 2026:
  https://github.com/Agenta-AI/agenta/pull/7701 (merged)
  https://github.com/pydantic/logfire/pull/2650 (open)
  https://github.com/stanfordnlp/dspy/pull/10563 (open)
Validation counts are the local results documented in the contributions.
The approved PDF is linked from the portfolio navigation.
"""
from pathlib import Path
import argparse
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
parser = argparse.ArgumentParser(description='Build the resume and render a local review image.')
parser.add_argument('--output', type=Path, default=ROOT / 'public/assets/resume/Mohammad_Mahaboob_Ashraf_Resume.pdf')
args = parser.parse_args()
OUT = args.output.resolve()
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
para('I build LLM systems where deterministic code owns money, safety, and correctness. Two AI research internships during undergrad; open-source contributor to Agenta (merged), Pydantic Logfire, and DSPy.', 'center', after=1.5)

section('EDUCATION')
entry('Osmania University<span fontName="Arial">, Hyderabad</span>', 'Expected Aug 2028')
para('B.E. Computer Science Engineering  |  <b>CGPA: 8.9/10</b>', after=0)

section('EXPERIENCE')
entry('Drugparadigm <span fontName="Arial"> |  AI Research Intern, Hyderabad</span>', 'Oct 2025 - Present')
bullet('Built antibody heavy/light-chain pairing models on protein-sequence embeddings over <b>1.3M+ heavy-chain sequences</b>, including preprocessing, leakage-detection, and training-data validation pipelines.')
bullet('Outperformed ImmunoMatch on the same held-out benchmark: <b>ROC-AUC 0.798 vs 0.750</b> on kappa light chains and <b>0.823 vs 0.783</b> on lambda. Benchmark analysis also exposed shortcuts in synthetic negative-pair construction.')
entry('iHub-Data, IIIT Hyderabad <span fontName="Arial"> |  AI Research Intern</span>', 'Aug 2025 - Oct 2025')
bullet('Fine-tuned <b>YOLOv8m</b> on 1,350+ annotated UAV images, reaching <b>96.7% mAP@50, 94.7% precision, and 93.2% recall</b> through targeted augmentation and AdamW tuning.')

section('PROJECTS')
entry('Amana - Agentic Commerce Gateway <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/Agentic-Commerce-Gateway')+' / '+link('Live','https://agentic-commerce-gateway-web.vercel.app/')+'</span>', meta='Java, Spring Boot, Next.js, React, TypeScript, PostgreSQL/pgvector, Gemini, Razorpay')
bullet('Shopping agent that turns text and image requests into <b>paid orders</b>. Gemini interprets intent and plans; deterministic Spring Boot services own authorization, Razorpay payment execution, reconciliation, and refunds.')
bullet('Raised valid-product <b>Recall@5 from 55% to 76%</b> on a labelled eval set, hit <b>92% intent-field accuracy</b>, and enforced <b>250/250 deterministic safety cases</b> in CI.')

y -= 2
entry('RepoPilot - Evidence-Grounded Coding Agent <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/Repo-Pilot')+'</span>', meta='Python, FastAPI, Tree-sitter, BM25, Chroma, LangGraph, React/TypeScript, Docker')
bullet('Local-first agent that locates and repairs bugs in a codebase using hybrid retrieval, <b>human approvals bound to the exact patch hash</b>, scoped edits, and Docker-isolated test runs; passed <b>33/33 safety scenarios</b>.')
bullet('Controlled model comparison (retrieval, prompts, and approval policy fixed): hosted Gemini repaired <b>6/6 frozen defects</b> vs. <b>1/6 for local Gemma</b>, and median workflow latency fell from <b>111s to 21s</b>.')

y -= 2
entry('HookRelay - Reliable Webhook Delivery Platform <span fontName="Arial"> |  '+link('GitHub','https://github.com/Mahaboob-Ashraf/HookRelay')+'</span>', meta='TypeScript, Node.js, Fastify, PostgreSQL, Redis/BullMQ, React, Docker')
bullet('Service that guarantees webhook events reach their destination: signed requests, bounded retries, dead-letter recovery, idempotent ingestion, and a React dashboard. <b>PostgreSQL owns delivery state</b>; Redis/BullMQ coordinates work.')
bullet('Verified idempotency under <b>25 concurrent ingest and replay requests</b>; <b>100% terminal success</b> across 3 × 500 deliveries at <b>71-79 deliveries/s</b>.')

section('OPEN SOURCE')
entry('Agenta <span fontName="Arial"> |  '+link('PR #7701','https://github.com/Agenta-AI/agenta/pull/7701')+'  |  </span>Merged')
bullet('Added <b>bounded HTTPX streaming</b> for Slack media downloads, enforcing attachment limits on decoded bytes before buffering and closing oversized responses early. Regression tests cover missing or understated metadata, gzip, exact byte limits, and stream cleanup (<b>216 Slack tests passing</b>).')
entry('Pydantic Logfire <span fontName="Arial"> |  '+link('PR #2650','https://github.com/pydantic/logfire/pull/2650')+'  |  Open PR</span>')
bullet('Gave FastAPI background-task batches their own <b>root traces</b>, linked to the originating request via <b>OpenTelemetry span links</b> so each can be tail-sampled independently, while preserving callback ordering, exceptions, and cancellation.')
entry('DSPy <span fontName="Arial"> |  '+link('PR #10563','https://github.com/stanfordnlp/dspy/pull/10563')+'  |  Open PR</span>')
bullet('Proposed safer prerelease-docs cleanup with <b>atomic stable publication</b>, immutable snapshots, and retry safety.')

section('TECHNICAL SKILLS')
para('<b>Languages:</b> Java, Python, TypeScript/JavaScript, SQL', after=.6)
para('<b>Full Stack:</b> React, Next.js, Node.js, Fastify, Spring Boot, FastAPI, REST APIs, PostgreSQL, Redis, BullMQ', after=.6)
para('<b>AI / ML:</b> LLMs, Agentic Workflows, Tool Calling, RAG, AI Evaluation, Embeddings, LangGraph, PyTorch, Gemini, Ollama', after=.6)
para('<b>Engineering:</b> Docker, GitHub Actions, Testing, Data Pipelines, API Integrations, Git', after=.6)
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
