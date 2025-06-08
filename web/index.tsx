import { render } from "preact";
import { registerServiceWorker } from "./registerServiceWorker";
import { App } from "./App";
import { connectToDatabase } from "./data/database";
import { assert } from "@/assert";

import "./index.css";

(async () => {
  const database = await connectToDatabase();
  const app = document.getElementById("app");
  assert(app, "App element not found");

  render(<App database={database} />, app);

  registerServiceWorker();
})();
