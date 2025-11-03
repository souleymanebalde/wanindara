import { useEffect } from "react";

export default function useServiceWorkerUpdater() {
  useEffect(() => {
    const onUpdate = () => {
      if (window.confirm("Une nouvelle version est disponible. Recharger ?")) {
        window.location.reload();
      }
    };
    window.addEventListener("swUpdated", onUpdate);
    return () => window.removeEventListener("swUpdated", onUpdate);
  }, []);
}
