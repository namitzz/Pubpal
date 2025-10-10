'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Pub } from '@/types';

// Fix for default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
  pubs: Pub[];
  center: { lat: number; lon: number };
}

export default function Map({ pubs, center }: MapProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl h-96">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pubs.map((pub) => (
          <Marker key={pub.id} position={[pub.lat, pub.lon]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-purple-600">{pub.name}</h3>
                {pub.address && <p className="text-sm text-gray-600">{pub.address}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
