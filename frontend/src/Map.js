import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet-routing-machine';

const { BaseLayer } = LayersControl;

//const local = 'http://127.0.0.1:8000/api/concessions/';
const remote = 'https://wanindara.pythonanywhere.com/api/concessions/';
const apiUrl = remote;

// Correction des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Composant légende en JSX
const Legend = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '6px',
      boxShadow: '0 0 8px rgba(0,0,0,0.3)'
    }}>
      <h4>Légende</h4>
      <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px'}}>
        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" width="20" alt="Non visité"/>
        <span>Non visité</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px'}}>
        <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" width="20" alt="Visité"/>
        <span>Visité</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px'}}>
        <img src='./icons/ztt.jpg' width="20" height="20" alt="Zone de tri"/>
        <span>Zone de tri</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{display:'inline-block', width:'14px', height:'14px', borderRadius:'50%', background:'blue'}}></span>
        <span>Position actuelle</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{display:'inline-block', width:'20px', height:'5px', background:'blue'}}></span> Itinéraire</div>

    </div>
  );
};

// Icônes
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const zttIcon = new L.Icon({
  iconUrl: require('./icons/ztt.jpg'),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Map = () => {
  const [concessions, setConcessions] = useState([]);
  const [userPos, setUserPos] = useState([9.638239, -13.588346]);
  const [routingControl, setRoutingControl] = useState(null);


  useEffect(() => {
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
        //whenCreated={map => addLegend(map)}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Carte OSM">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer name="Vue satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>
        </LayersControl>

        <CircleMarker center={userPos} radius={10} color="blue">
          <Popup>Vous êtes ici</Popup>
        </CircleMarker>

        {concessions.map(c => (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={c.type === "ZTT" ? zttIcon : (c.visite ? greenIcon : redIcon)}
            eventHandlers={{
              click: (e) => {
                if (routingControl) {
                  routingControl.setWaypoints([
                    L.latLng(userPos[0], userPos[1]),
                    L.latLng(c.latitude, c.longitude)
                  ]);
                }
              }
            }}
          >
            <Popup>
              <b>{c.nom}</b><br />
              Visité : {c.visite ? "Oui" : "Non"}<br />
              Intérêt : {c.interet}<br />
              Type : {c.type}<br />
              <button onClick={() => markVisited(c.id)}>Marquer comme visité</button> <br/>
              <small>📍 Cliquez sur le marqueur pour générer l'itinéraire</small>
            </Popup>
          </Marker>
        ))}

        <LocateButton userPos={userPos} setRoutingControl={setRoutingControl} />

      </MapContainer>

      {/* Affichage de la légende en JSX */}
      <Legend />
    </div>
  );
};

// Bouton pour centrer sur la position actuelle
function LocateButton({ userPos, setRoutingControl }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const control = L.Routing.control({
      waypoints: [L.latLng(userPos[0], userPos[1]), L.latLng(userPos[0], userPos[1])],
      routeWhileDragging: true,
      show: false,
      addWaypoints: true,
      lineOptions: { styles: [{ color: 'blue', opacity: 0.6, weight: 5 }] },
      createMarker: () => null,    
    }).addTo(map);

    setRoutingControl(control);
  }, [map, setRoutingControl, userPos]);

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
