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
12. [x] Move Therapist Name input into settings panel
13. [x] Toggle dark mode in settings panel
14. [x] Migrate to TS and serve everything up from one app
15. [ ] Fix Group/WithWho in edit activity from history (currently always shows Group)
16. [ ] Fix opening the CamperModal when editing an activity from history (renders white page with no recourse, maybe just render an input box and don't have a modal?)
17. [ ] [Migrate to JSX](https://preactjs.com/guide/v10/getting-started/#setting-up-jsx)
18. [ ] Pre-curated groups
19. [ ] ~Have it show up as a widget on lock screen~ I looked into it and it doesn't look like it's possible without a native app
20. [ ] [Create maskable icon](https://web.dev/articles/maskable-icon)
