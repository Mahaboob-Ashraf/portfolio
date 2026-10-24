# Mahaboob Ashraf — Portfolio

Personal portfolio for software and AI engineering projects, open-source contributions, and experience.

## Local preview

Requires Node.js 18 or newer. The website has no npm dependencies.

```sh
npm run build
npm run check
npm run dev
```

Open `http://localhost:4173`. Set `PORT` to use another port.

## Editing

- `index.html` contains the homepage and shared navigation, contact section, and footer.
- `work/project-data.cjs` and `work/additional-project-data.cjs` contain project case studies.
- `contributions/contribution-data.cjs` contains open-source contribution articles.
- `scripts/build-*.cjs` generate the project, contribution, catalogue, and 404 pages. Run `npm run build` after editing shared content or data.
- Generated HTML is committed so the complete site is reviewable without running a build.
- `public/assets/` contains the images, icons, fonts, and downloadable resume used by the site. The preview server maps `/assets/` to this directory.
- `style.css` contains the base styles; `white-orange.css` applies the beige, black, and orange theme. Other stylesheets cover individual sections.

`npm run check` checks local page references, assets, anchors, duplicate IDs, and page headings. It does not contact external services.

## Resume source

The approved PDF is `public/assets/resume/Mohammad_Mahaboob_Ashraf_Resume.pdf`.
Its optional source is `scripts/resume/build_resume.py`; the website does not require Python.
To rebuild it on Windows with Arial installed:

```sh
python -m pip install -r scripts/resume/requirements.txt
python scripts/resume/build_resume.py
```

The script also renders a review image under `tmp/`, which is excluded from Git.

## Attribution

Third-party font and icon source/license notes are retained alongside their assets.
The Ghost Fibers adaptation is documented in `react-bits-license.txt`.
Open-source articles and project pages link to the original implementation evidence.

Review screenshots, recordings, temporary files, environment files, and dependency folders are excluded from Git.
