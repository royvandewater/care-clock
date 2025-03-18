import { render } from "preact";
import { html } from "htm/preact";
// import { registerServiceWorker } from "./registerServiceWorker.js";
import { App } from "./App.js";
import { connectToDatabase } from "./data/database.js";

const database = await connectToDatabase();

render(html`<${App} database=${database} />`, document.getElementById("app"));

// registerServiceWorker();
