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
8. [x] Instead of group , co treat, who is your student? Call it "with who"
9. [x] Check what the description character limit is (It's 50k characters)
10. [x] Add edit icon to unsynced activities
11. [x] Deal with multiple tabs being open better (starting an activity in one tab and switching to another overwrites the running activity)
12. [ ] Move Therapist Name input into settings panel
13. [ ] Toggle dark mode in settings panel
14. [ ] Pre-curated groups
15. [ ] ~Have it show up as a widget on lock screen~ I looked into it and it doesn't look like it's possible without a native app
16. [ ] [Create maskable icon](https://web.dev/articles/maskable-icon)
