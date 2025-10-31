import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const Map = () => {
  const [concessions, setConcessions] = useState([]);
  const [userPos, setUserPos] = useState([9.518, 13.677]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/concessions/')
      .then(res => setConcessions(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const markVisited = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/concessions/${id}/`, {visite: true, interet: "Oui"})
      .then(() => {
        setConcessions(concessions.map(c => c.id === id ? {...c, visite: true, interet:"Oui"} : c))
      })
  }

  return (
    <MapContainer center={userPos} zoom={16} style={{height:"100vh", width:"100%"}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      
      <CircleMarker center={userPos} radius={10} color="blue">
        <Popup>Vous êtes ici</Popup>
      </CircleMarker>

      {concessions.map(c => (
        <Marker position={[c.latitude, c.longitude]} key={c.id}>
          <Popup>
            <b>{c.nom}</b><br/>
            Visité : {c.visite ? "Oui" : "Non"}<br/>
            Intérêt : {c.interet}<br/>
            <button onClick={() => markVisited(c.id)}>Marquer comme visité</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map;
