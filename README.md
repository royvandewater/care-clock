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
3. [ ] Add optional group name
4. [ ] Type of session (enum)
5. [ ] Manually modify a record
6. [ ] Multiple campers at a time
7. [ ] Pre-curated groups
8. [ ] Have it show up as a widget on lock screen
