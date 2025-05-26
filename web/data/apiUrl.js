import { isLocal } from "./isLocal.js";

export const apiUrl = (path) => new URL(path, window.location.origin);
