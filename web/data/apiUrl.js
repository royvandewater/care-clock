import { isLocal } from "./isLocal.js";

const url = isLocal() ? "http://localhost:8787" : "https://api.care-clock.workers.dev";

export const apiUrl = (path) => new URL(path, url);
