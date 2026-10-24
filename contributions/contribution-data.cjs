// Verified against the upstream PR descriptions and diffs on 23 October 2026.
// Quoted code is an excerpt of the submitted patch, not a replacement implementation.
module.exports = ({ p, list, code, table, callout, traceDiagram, streamDiagram, releaseDiagram }) => [
  {
    slug:'logfire-background-tracing', project:'Pydantic · Logfire', title:'Tracing FastAPI background tasks',
    description:'Separate, linked traces for FastAPI background-task batches, so request and background work can be sampled independently.',
    cardDescription:'Implemented separate, linked traces for background task batches. Added regression tests and documentation.',
    repository:'pydantic/logfire', number:2650, state:'open', merged:false, assigned:true, issue:1034,
    opened:'2026-10-22', checked:'2026-10-24', head:'12d2b55923612f5fa3461c1318bd68197e50c330',
    cover:'/assets/pydantic.webp', coverAlt:'Pydantic Logfire illustration of linked request and background traces',
    headerArt:'/assets/contributions/logfire-header.webp',
    intro:p('A request can finish before its background work starts. That becomes an observability problem when tail sampling has already discarded the request trace: later spans can bypass its sampling decision and arrive with missing parents.') +
      p('This contribution addresses the FastAPI part of that problem. The proposed change creates a separate root trace for each non-empty background-task batch, and links it to the original request span.'),
    sections:[
      {title:'Linked work, independent sampling',body:
        p('A span link preserves the relationship without making the background batch a child of an already-finished request trace. The request and background work can then have independent keep-or-discard decisions. Callbacks within the same batch share one background-trace decision.') +
        traceDiagram() +
        p('That separation also lets a background error retain earlier buffered records from its own trace. The request trace does not have to be retained for the background trace to remain useful. A link can legitimately point to a request span that sampling discarded.')
      },
      {title:'Change the trace boundary, preserve execution',body:
        p('The wrapper runs the original task batch rather than replacing its callback machinery. Ordering remains unchanged, synchronous callbacks still use Starlette’s thread pool, and exceptions and cancellation continue to propagate.') +
        code('Proposed batch wrapper · Python',"token = context_api.attach(trace_api.set_span_in_context(trace_api.INVALID_SPAN))\ntry:\n    with self.logfire_instance.span('FastAPI background tasks', _links=[(self.request_context, None)]):\n        return await self.original_tasks()\nfinally:\n    context_api.detach(token)") +
        p('Clearing the active span starts a new root while keeping the surrounding telemetry context. The <code>finally</code> block restores the previous context. The patch preserves baggage, instrumentation suppression, and FastAPI’s own background-operation spans as children of the new trace.') +
        p('Empty batches delegate directly to the original implementation; they do not create an extra trace.')
      },
      {title:'Regression tests around the boundary',body:
        p('Coverage exercises all four combinations of retaining or discarding the request and background traces. It checks distinct trace IDs, request links, parent relationships, completed spans, background errors, synchronous and asynchronous callbacks, failures, cancellation, and context restoration.') +
        table(['Reported local validation','Result'],[
          ['Focused background-task and tail-sampling tests','35 passed'],
          ['Broader relevant run before final test additions','72 passed · 6 existing skips'],
          ['Targeted fastapi.py coverage','100%'],
          ['Ruff checks, formatting, Linux-targeted Pyright','Passed']
        ]) +
        p('These are the validation results reported in the PR, not a claim that the full upstream CI matrix has completed.')
      },
      {title:'A deliberately narrow scope',body:
        p('The implementation covers FastAPI <code>BackgroundTasks</code>, including injected batches and directly returned responses carrying one. Plain Starlette background tasks and generic <code>asyncio</code> tasks remain outside this patch.') +
        callout('The implementation, regression tests, and sampling-guide changes are proposed in PR #2650. The PR is open, and issue #1034 is assigned to Mahaboob-Ashraf.')
      }
    ],
    faqs:[
      ['Why use a span link instead of a parent span?','The background batch needs its own root and sampling decision. A span link keeps its relationship to the request without putting it back inside the request’s trace.'],
      ['Does every background callback get a separate trace?','No. One non-empty FastAPI batch creates one background trace. Its callbacks share that trace’s sampling decision.'],
      ['Does this apply to plain Starlette or asyncio tasks?','No. The patch is scoped to FastAPI BackgroundTasks. The sampling guide documents the boundary and the manual alternative for other cases.']
    ]
  },
  {
    slug:'agenta-slack-downloads', project:'Agenta', title:'Bounding Slack media downloads',
    description:'Enforce attachment limits as bytes arrive, instead of downloading the full Slack response before checking its size.',
    cardDescription:'Implemented bounded HTTPX streaming to stop oversized Slack attachments without consuming the remaining response.',
    repository:'Agenta-AI/agenta', number:7701, state:'closed', merged:true,
    mergedAt:'2026-10-23T18:36:39Z',
    opened:'2026-10-20', checked:'2026-10-24', head:'e4933d65ff00eaeaf00889e71bea6ca9942144e1',
    cover:'/assets/agenta.webp',coverAlt:'Agenta illustration of Slack media passing through a download size boundary',
    headerArt:'/assets/contributions/agenta-header-v2.webp',
    intro:p('A size check after an eager download is too late to bound the download itself. Slack media could be fetched in full before the adapter compared the response length with <code>max_bytes</code>.') +
      p('The merged fix switches the file request to HTTPX streaming and applies the limit while reading chunks. Oversized responses return without consuming the rest of the stream.'),
    sections:[
      {title:'Metadata is a hint. Streamed bytes are the boundary.',body:
        p('Slack’s file metadata can be missing or understate the actual content. The response can also omit <code>Content-Length</code>. Neither is a sufficient substitute for checking the bytes actually read.') +
        streamDiagram() +
        code('Streamed byte limit · Python',"data = bytearray()\nasync for chunk in response.aiter_bytes():\n    if max_bytes is not None and len(data) + len(chunk) > max_bytes:\n        return None\n    data.extend(chunk)") +
        p('The guard checks the next chunk before appending it to the accumulated buffer. Content exactly at the limit remains valid; content above it is rejected. The asynchronous response context closes the stream on early return and on errors.')
      },
      {title:'Preserve the existing download contract',body:
        p('A usable, oversized <code>Content-Length</code> still permits rejection before reading the body. That shortcut is used only when there is no content encoding: a compressed response’s header length is not the same as its decoded content length.') +
        p('The streamed-byte guard remains in place regardless of metadata. For gzip responses, it applies to the bytes yielded by <code>aiter_bytes()</code>, rather than trusting the compressed wire size.') +
        list(['Bot-token authentication, redirects, and the existing timeout remain in place.','An HTML login response is still treated as denied file access.','The existing MIME-type fallback is preserved.','Response cleanup does not close the shared HTTPX client.'])
      },
      {title:'Tests for early termination and cleanup',body:
        p('The regressions use controlled asynchronous byte streams, so tests can inspect how much was consumed and whether the stream was closed. They cover missing or understated file-size metadata, size boundaries, Content-Length handling, gzip responses, and cleanup when a stream raises.') +
        table(['Reported local validation','Result'],[
          ['Slack unit suite','216 passed'],['Focused streaming regression cases','6 passed'],['Ruff formatting and git diff --check','Passed'],['Lint comparison','No new violations; existing violations remain']
        ]) +
        callout('Validation used mocked HTTPX responses. Live Slack downloads were not part of the reported local test run.')
      },
      {title:'Merged upstream',body:
        p('PR #7701 was merged into Agenta’s <code>release/v0.123.0</code> branch on 24 October 2026 (IST). The implementation and regression tests are now part of the upstream repository.')
      }
    ],
    faqs:[
      ['Why is Content-Length not enough?','It can be absent, understated, or describe compressed rather than decoded bytes. The patch keeps a streamed-byte check even when metadata is available.'],
      ['What happens when the attachment exceeds the limit?','The adapter returns None without appending the chunk that would exceed the accumulated-buffer limit. Exiting the HTTPX response context closes the stream.'],
      ['Were real Slack downloads tested?','No. The reported validation uses mocked HTTPX responses and controlled streams. The PR explicitly records live Slack downloads as untested.']
    ]
  },
  {
    slug:'dspy-deployment-snapshots',project:'DSPy',title:'Cleaning up deployment snapshots',
    description:'Remove superseded prerelease documentation when its exact stable release is published, without disturbing other versions or retry safety.',
    cardDescription:'Proposed exact prerelease cleanup with atomic publication, immutable stable snapshots, and retry-safe deployment.',
    repository:'stanfordnlp/dspy',number:10563,state:'open',merged:false,
    opened:'2026-10-03',checked:'2026-10-23',head:'80e78cae7b47c5bfbd61c157570146ce3834198a',
    cover:'/assets/dspy.webp',coverAlt:'DSPy illustration of superseded documentation snapshots being cleaned up',
    headerArt:'/assets/contributions/dspy-header.webp',
    intro:p('Versioned documentation snapshots were append-only. A beta such as <code>3.4.0b1</code> could stay deployed and visible after stable <code>3.4.0</code> was published.') +
      p('This contribution proposes cleaning up only the alpha, beta, and release-candidate snapshots for that exact stable release. The difficult part is preserving publication guarantees while removing stale routes and inventory entries.'),
    sections:[
      {title:'Match the exact release, not a broad prefix',body:
        p('Publishing <code>3.4.0</code> can remove <code>3.4.0a1</code>, <code>3.4.0b12</code>, and <code>3.4.0rc2</code>. It must preserve other patch or minor releases, unrelated prereleases, and stable snapshots.') +
        releaseDiagram() +
        code('Exact prerelease matching · Python',"prerelease = re.compile(re.escape(identifier) + r\"(?:a|b|rc)[0-9]+\")\nsuperseded = [\n    str(entry.version)\n    for entry in versions\n    if prerelease.fullmatch(str(entry.version))\n]") +
        p('Escaping the stable identifier and using <code>fullmatch</code> keeps the candidate set tied to one release. Multi-digit prerelease suffixes are included without broad directory or minor-line deletion.')
      },
      {title:'One deployment update, not a partial state',body:
        p('Mike’s ordinary deploy and delete commands each create a commit. Running them separately would expose an intermediate state where the stable release is published but cleanup has not completed.') +
        p('The proposed publisher uses Mike’s Git primitives to put stable publication, alias updates, inventory changes, and prerelease removal into one Git commit. Missing or malformed inventory fails before cleanup; prereleases with unexpected alias ownership are not silently removed.') +
        p('Stable content remains immutable. An identical existing stable snapshot can clean up retained prereleases without rewriting its content. Different content is rejected. Once publication and cleanup have succeeded, an identical retry is a no-op.') +
        callout('A delayed older patch must not move the minor alias backward. Existing caller-provided aliases and unrelated releases remain protected.')
      },
      {title:'Regression coverage for publication guarantees',body:
        p('Tests exercise real Mike publication in temporary Git repositories. They check exact alpha/beta/RC removal, unrelated-version preservation, one-commit publication, immutable stable content, forward-only aliases, and retry behaviour.') +
        p('An injected inventory-write failure verifies that the combined update leaves the deployment branch unchanged and allows a later successful retry.') +
        table(['Reported local validation','Result'],[
          ['Relevant versioned-documentation tests','24 passed'],['Ruff lint and formatting','Passed'],['Applicable pre-commit hooks','Passed'],['git diff --check','Passed']
        ])
      },
      {title:'Implementation available for review',body:
        p('PR #10563 contains the publisher change, documentation, and regression tests. It remains open. The implementation preserves the existing publication model while adding exact cleanup; it does not claim that deployment changes have already shipped upstream.')
      }
    ],
    faqs:[
      ['Which snapshots does a stable publication remove?','Only alpha, beta, and release-candidate versions belonging to that exact stable release, such as 3.4.0a1, 3.4.0b12, and 3.4.0rc2 when publishing 3.4.0.'],
      ['What happens if publication is repeated?','After successful publication and cleanup, an identical retry is a no-op. An identical already-published stable snapshot can also clean up stale prereleases without rewriting its content.'],
      ['Can cleanup overwrite a stable snapshot or move its alias backward?','No. Different content for an existing stable snapshot is rejected, and the forward-only minor-alias behaviour is preserved. The regression suite covers both guarantees.']
    ]
  }
].sort((a, b) => Number(b.merged) - Number(a.merged));
