const isLocal = () => {
  const hostname = window.location.hostname;

  return ["localhost", "127.0.0.1"].includes(hostname);
};

export const apiUrl = isLocal()
  ? "http://localhost:8787"
  : "https://api.care-clock.workers.dev";
