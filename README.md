# Vatsalya Bhawan

Ayodhya hospitality website with a continuous satellite journey from Earth to Ayodhya, optional Diwali lights, room enquiries, a city guide PDF and a real Google Maps embed.

Live site: https://eye-52.github.io/vatsalya-bhawan/

Run `npm ci` once, then `npm start` for development. Run `CI=true npm test -- --watchAll=false --runInBand` to verify the enquiry and film/theme behaviour.

`npm run deploy` builds the site and publishes the output to the `gh-pages` branch of **EYE-52/vatsalya-bhawan**. GitHub Pages serves the root of that branch. The original property's repository is preserved as the `origin` remote; the redesign repository is the `eye52` remote. Push source changes with `git push eye52 HEAD:main`.

The hero film is cinematic artwork, and the exterior/room photos are AI-reframed from property photographs. Original photo comparisons remain available. See `REDESIGN_NOTES.md` for asset provenance, and `scripts/map-guide/` for the downloadable schematic map.
