import { render } from "preact";
import { html } from "htm/preact";
import { assert } from "./assert.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { App } from "./App.js";

const service = await registerServiceWorker();
assert(service, "Service worker not found");

render(html`<${App} service=${service} />`, document.getElementById("app"));
