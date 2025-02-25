const registerServiceWorker = async () => {
  if (!"serviceWorker" in navigator) {
    alert("This application requires a browser that supports service workers");
    return;
  }

  try {
    await navigator.serviceWorker.register(`serviceWorker.js`);
  } catch (error) {
    document.getElementById("service-worker-errors").textContent = error;
  }
};

registerServiceWorker();
