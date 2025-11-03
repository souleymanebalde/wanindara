import React, { useState, useEffect } from "react";
import Map from "./Map";
import useServiceWorkerUpdater from "./updateServiceWorker";

function App() {
  const [online, setOnline] = useState(true);
  useServiceWorkerUpdater();

  useEffect(() => {
    const handleChange = () => setOnline(navigator.onLine);
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);

  return (
    <>
      {!online && (
        <div style={{background: "orange", color: "white", textAlign: "center", padding: "5px"}}>
          ⚠️ Vous êtes hors ligne — les données sont consultées depuis le cache
        </div>
      )}
      <Map />
    </>
  );
}

export default App;
