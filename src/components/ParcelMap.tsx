
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { Locate } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

// Correction pour le problème de chemin d'icône par défaut de Leaflet avec les bundlers
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Ceci est un problème connu avec Leaflet et les bundlers comme Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});


interface Coordinates {
  lat: number;
  lng: number;
}

interface ParcelMapProps {
  coordinates: Coordinates;
  parcelName: string;
  isEditing: boolean;
  onCoordinatesChange?: (coordinates: Coordinates) => void;
}

// Composant pour gérer les mises à jour de la vue de la carte lorsque les props changent
const MapUpdater = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Composant pour gérer les événements de la carte
const MapEventsHandler = ({ onCoordinatesChange }: { onCoordinatesChange: (coords: Coordinates) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onCoordinatesChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};


const ParcelMap = ({ coordinates, parcelName, isEditing, onCoordinatesChange }: ParcelMapProps) => {
  const [position, setPosition] = useState<Coordinates>(coordinates);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setPosition(coordinates);
  }, [coordinates]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          const newCoords = { lat, lng };
          setPosition(newCoords);
          if (onCoordinatesChange) {
            onCoordinatesChange(newCoords);
          }
        }
      },
    }),
    [onCoordinatesChange],
  );

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = { lat: latitude, lng: longitude };
          if (onCoordinatesChange) {
            onCoordinatesChange(newCoords);
          }
          toast.success('Localisation réussie!');
        },
        () => {
          toast.error("Impossible d'obtenir votre position.");
        }
      );
    } else {
      toast.warning('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };
  
  const mapCenter: LatLngExpression = [position.lat, position.lng];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={mapCenter} 
          draggable={isEditing} 
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup>{parcelName}</Popup>
        </Marker>
        <MapUpdater center={mapCenter} />
        {isEditing && onCoordinatesChange && <MapEventsHandler onCoordinatesChange={(coords) => {
            onCoordinatesChange(coords);
        }} />}
      </MapContainer>
      <div className="absolute top-2 right-2 bg-white/80 p-2 rounded-md shadow-md flex flex-col gap-2 z-[1000]">
        {isEditing && (
           <Button size="icon" variant="outline" onClick={handleLocateUser} title="Me localiser">
             <Locate className="h-4 w-4" />
           </Button>
        )}
      </div>
       {isEditing && (
        <div className="absolute bottom-0 left-0 right-0 text-center bg-white/80 py-1 text-xs text-muted-foreground z-[1000]">
          Cliquez sur la carte ou déplacez le marqueur pour définir la position
        </div>
      )}
       <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 text-xs rounded shadow z-[1000]">
          Lat: {position.lat.toFixed(4)} | Lng: {position.lng.toFixed(4)}
        </div>
    </div>
  );
};

export default ParcelMap;
