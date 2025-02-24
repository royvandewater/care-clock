export const isLocal = () => {
  const hostname = window.location.hostname;

  return ["localhost", "127.0.0.1"].includes(hostname);
};
