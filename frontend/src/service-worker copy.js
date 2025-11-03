/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Précache les fichiers générés par le build
precacheAndRoute(self.__WB_MANIFEST);

// Mise en cache des requêtes vers l'API Django
registerRoute(
  ({ url }) => url.origin === 'http://127.0.0.1:8000',
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
  })
);

// Mise en cache des tuiles OpenStreetMap
registerRoute(
  ({ url }) => url.origin.includes('tile.openstreetmap.org'),
  new StaleWhileRevalidate({
    cacheName: 'osm-tiles',
  })
);
