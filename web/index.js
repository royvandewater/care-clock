import { render } from "preact";
import { html } from "htm/preact";

import { App } from "./App.js";

await window.navigator.serviceWorker.ready;

render(html`<${App} />`, document.getElementById("app"));
