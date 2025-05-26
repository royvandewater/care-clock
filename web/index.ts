import { render } from "preact";
import { html } from "htm/preact";
import { registerServiceWorker } from "./registerServiceWorker";
import { App } from "./App.js";
import { connectToDatabase } from "./data/database.js";
import { assert } from "@/assert";

import "./index.css";

(async () => {
  const database = await connectToDatabase();
  const app = document.getElementById("app");
  assert(app, "App element not found");

  render(html`<${App} database=${database} />`, app!);

  registerServiceWorker();
})();
