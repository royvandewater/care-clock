export const registerServiceWorker = async () => {
  if (!"serviceWorker" in navigator) {
    document.getElementById("service-worker-errors").textContent = "This application requires a browser that supports service workers";
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(`serviceWorker.js`, { type: "module" });
    await navigator.serviceWorker.ready;
    return registration.active;
  } catch (error) {
    document.getElementById("service-worker-errors").textContent = error;
  }
};
