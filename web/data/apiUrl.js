import { isLocal } from "./isLocal.js";

export const apiUrl = isLocal() ? "http://localhost:8787" : "https://api.care-clock.workers.dev";
