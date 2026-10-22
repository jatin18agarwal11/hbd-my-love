# Our Little Universe

A private, local-first birthday adventure for 23 October 2026. Built with React, Vite, Tailwind CSS v4, Motion, and Lucide. All 50 original portraits remain untouched in `img/`; Vite discovers them automatically.

## Run

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open http://localhost:5173. Vite updates the page when source files change.

```sh
npm test
npm run build
npm run preview
```

## Personalize

- `src/config.js`: birthday, recipient, featured portrait filename, and captions keyed by original image filename.
- `src/personalCopy.js`: Bubu's nickname, personal letter, dialogue, proposal, and signature.
- `src/distanceStory.js`: the supplied approximate 2,200 km story, long-distance letter, and editable imaginary co-op dialogue.
- `src/navigation.js`: ordered list of 12 pages, direct hash links, and next/back navigation. Page 7 (proposal) continues to page 8 (co-op). Only explicit replay returns to page 1.
- `src/PersonalScenes.jsx` and `src/DistanceScenes.jsx`: photo slides, character profile, folding letter, and illustrative map scenes.
- `src/styles.css`: colors, typography, scene illustration, responsive layouts, and reduced-motion / print styles.
- `src/App.jsx`: chapter components, activity choices, invitation message, and controls.
- `src/date.js`: isolated calendar and timezone logic with tests in `src/date.test.js`.

The opening landscape is an original SVG/CSS illustration. Optional music is generated locally with Web Audio and starts only after a click. No stock assets, remote fonts, analytics, backend, or external audio requests are used.

## Interactions

The gallery offers a swipeable slideshow and a grid revealing ten portraits at a time; its lightbox navigates all 50. Slideshow playback is optional. Escape closes dialogs, focus stays inside them, and closing restores the previous focus. Calendar arrow keys move between days; Enter/Space selects a date. Past dates are disabled in the selected timezone. Both cities share IST, but the timezone still requires explicit confirmation. Nonexistent or ambiguous daylight-saving times require a different choice.

The invitation requires a future date/time, a timezone, one or more activities, and an editable message. It generates a local card with copy and print/save-PDF actions. **It is prepared, not delivered.** Share the copied text yourself. No selection is stored persistently; refreshing clears it. Navigating pages and replaying retains current choices until refresh. The map is a hand-drawn illustration with approximate positions, not live location data or navigation guidance.

With the dev server running, `npm run check:pages` server-renders all 12 routes, checks that only the requested scene is present, and verifies that all 50 original images return HTTP 200. Browser visual checks remain separate from these smoke tests.

## Future delivery integration

The local confirmation is created in `DateQuest.submit`. A real backend can accept the validated `{date,time,zone,activities,message,instant}` object there. Keep secrets on the server, await a successful server response before reporting delivery, and retain the current local card/copy flow on failure. No simulated endpoint is included.

## Privacy

The repository and built output contain personal portraits. The dev server binds to loopback only. This project has not been published.
