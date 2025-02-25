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
