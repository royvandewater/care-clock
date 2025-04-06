# Care Clock

A simple tool to track the time spent on activities with campers.

## Development

```bash
npm install
npm run dev # runs the dev API server at http://localhost:8787
npm run live-server # runs a local web server at http://localhost:8080
```

> [!TIP]
> Disable Service Worker static asset caching in local development by going into:
> Chrome Inspector -> Application -> Service Workers -> and check "Bypass for Network"

## Deployment

This project is setup to automatically deploy on pushes to the `main` branch. To deploy manually, run:

```bash
npm run deploy
```

## Icons

Icons are from https://heroicons.com/

## TODO

1. [x] Fix duplicate records (unique ID?)
2. [x] Store previous campers and suggest in camper input
3. [x] Add optional group name
4. [x] Type of session (enum)
5. [x] Add app screenshots to manifest
6. [x] Manually modify a record
7. [x] Multiple campers at a time
8. [ ] Move Therapist Name input into settings panel
9. [ ] Toggle dark mode in settings panel
10. [ ] Pre-curated groups
11. [ ] Have it show up as a widget on lock screen
12. [ ] [Create maskable icon](https://web.dev/articles/maskable-icon)
