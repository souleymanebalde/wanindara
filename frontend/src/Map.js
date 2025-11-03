import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const local = 'http://127.0.0.1:8000/api/concessions/';
const remote = 'https://wanindara.pythonanywhere.com/api/concessions/';

const apiUrl = remote; // Choisir l'URL de l'API
// Correction des icônes Leaflet dans React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 🟢 Icône verte pour "visité"
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//test
const test = 'testfd'

// 🔴 Icône rouge pour "non visité"
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const zttIcon =  new L.Icon({
  iconUrl: require('./icons/ztt.jpg'),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Map = () => {
  const [concessions, setConcessions] = useState([]);
  const [userPos, setUserPos] = useState([9.638239, -13.588346]);
  //9.543834,-13.669302
  //9.638239, -13.588346

  useEffect(() => {
    //axios.get('http://127.0.0.1:8000/api/concessions/')
    axios.get(apiUrl)
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
    //axios.patch(`http://127.0.0.1:8000/api/concessions/${id}/`, { visite: true, interet: "Oui" })
    axios.patch(`${apiUrl}/${id}/`, { visite: true, interet: "Oui" })
      .then(() => {
        setConcessions(concessions.map(c => c.id === id ? { ...c, visite: true, interet: "Oui" } : c))
      });
  };

  return (
  <div style={{ position: "relative" }}>
    <MapContainer
      center={userPos}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <CircleMarker center={userPos} radius={10} color="blue">
        <Popup>Vous êtes ici</Popup>
      </CircleMarker>

      {concessions.map(c => (
        <Marker
          position={[c.latitude, c.longitude]}
          key={c.id}
          //icon={c.visite ? greenIcon : redIcon}
          icon={c.type === "ZTT" ? zttIcon : (c.visite ? greenIcon : redIcon)}
        >
          <Popup>
            <b>{c.nom}</b><br />
            Visité : {c.visite ? "Oui" : "Non"}<br />
            Intérêt : {c.interet}<br />
            Type : {c.type}<br />
            <button onClick={() => markVisited(c.id)}>Marquer comme visité</button>
          </Popup>
        </Marker>
      ))}

       <LocateButton userPos={userPos} /> 
    </MapContainer>
  </div>
);

}; 

function LocateButton({ userPos }) {
  const map = useMap();
  const handleClick = () => {
    if (userPos && map) {
      map.setView(userPos, 17, { animate: true });
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 12px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }}
    >
      📍 Ma position
    </button>
  );
}


export default Map;
