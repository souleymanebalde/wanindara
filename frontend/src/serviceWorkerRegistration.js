// frontend/src/serviceWorkerRegistration.js

// Ce fichier gère l’enregistrement du service worker pour la PWA
// afin que ton appli fonctionne hors ligne et se charge plus vite.


export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('Nouvelle version disponible');
                window.dispatchEvent(new Event('swUpdated'));
              }
            }
          };
        };
      });
    });
  }
}