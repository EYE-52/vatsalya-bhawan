# Link preview artwork

`card.html` composes the existing outlined Devanagari logo, Lora/Manrope type and the approved `exterior-cutout.png` into a 1200 × 630 share image. The facade is the existing AI-refined reference image; this change does not generate or alter the building. The original photograph remains in the site gallery and Hotel structured data.

Serve the repository root, open `/scripts/social-preview/card.html`, and capture the page at a 1200 × 630 viewport after its fonts and images load. Encode that capture as a JPEG at quality 90, 4:4:4 chroma, to `public/assets/vatsalya-share-v2.jpg`. The current export is approximately 124 KB. Inspect it at full size and thumbnail size before replacing it. Use a new filename when changing artwork to avoid reusing a cached image URL.

`render-icons.cjs` renders the approved `public/favicon.svg` into the PNG/ICO sizes referenced by the HTML and manifest. Run with bundled `sharp` on `NODE_PATH`; no new website dependency is required.

The Open Graph and Twitter metadata are static in `public/index.html`, so crawlers do not need to execute React. Image fields include an absolute HTTPS URL, JPEG MIME type, dimensions and alternative text, following the [Open Graph image properties](https://ogp.me/#structured).
