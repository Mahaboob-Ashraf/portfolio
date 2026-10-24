// Rebuild every generated page after shared navigation, footer, or content changes.
for (const script of ['build-project-pages','build-work-page','build-contribution-pages','build-not-found-page']) require(`./${script}.cjs`);
