# Vatsalya Bhawan

Ayodhya hospitality website with a satellite journey from Earth to Ayodhya that settles on a sunset skyline, optional Diwali lights, room enquiries, a city guide PDF and a real Google Maps embed.

Live site: https://eye-52.github.io/vatsalya-bhawan/

Run `npm ci` once, then `npm start` for development. Run `CI=true npm test -- --watchAll=false --runInBand` to verify the enquiry and film/theme behaviour.

`npm run deploy` builds the site and publishes the output to the `gh-pages` branch of **EYE-52/vatsalya-bhawan**. GitHub Pages serves the root of that branch. The original property's repository is preserved as the `origin` remote; the redesign repository is the `eye52` remote. Push source changes with `git push eye52 HEAD:main`.

The opening hero film follows real satellite geography, then reveals an artist impression of Ayodhya at sunset. The exterior/room photos are AI-reframed from property photographs; original photo comparisons remain available. The city guide uses real OpenStreetMap streets and footpaths, landmark pins, Google Maps walking directions, and a printable street map. See `REDESIGN_NOTES.md` for asset provenance and `scripts/map-guide/` for map sources and regeneration instructions.
