import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PopupContent = ({ region, onPlantClick }) => (
  <div className="bg-black/95 rounded-xl p-4 min-w-[280px] text-white">
    <h3 className="font-bold text-lg mb-1">{region.name}</h3>
    <p className="text-gray-400 text-sm mb-3">{region.location}</p>

    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="bg-blue-500/20 rounded-lg p-2">
        <div className="text-blue-400 font-bold text-lg">{region.currentStock.toLocaleString()}</div>
        <div className="text-gray-400 text-xs">Current Stock</div>
      </div>
      <div className="bg-green-500/20 rounded-lg p-2">
        <div className="text-green-400 font-bold text-lg">{region.capacity.toLocaleString()}</div>
        <div className="text-gray-400 text-xs">Capacity</div>
      </div>
    </div>

    <div className="text-xs text-gray-400 mb-3 space-y-1">
      <div className="flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{region.coordinates.lat.toFixed(4)}, {region.coordinates.lng.toFixed(4)}</span>
      </div>
      <div>Manager: {region.manager}</div>
      <div>Contact: {region.contact}</div>
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent map click
        onPlantClick(region);
      }}
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
    >
      View Location Details
    </button>
  </div>
);

const ForestMap = ({ forestRegions, routes = [], onRegionClick, onPlantClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: false // Prevent scrolling page from zooming map accidentally
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer || !forestRegions) return;

    markersLayer.clearLayers();

    const bounds = [];

    const warehouseIcon = L.divIcon({
      className: 'custom-warehouse-marker',
      html: `
        <div style="position: relative; width: 40px; height: 40px;">
          <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #000;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
            z-index: 2;
            position: relative;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/>
              <path d="M3 7h18"/>
              <path d="M7 7v14"/>
              <path d="M11 7v14"/>
              <path d="M15 7v14"/>
              <path d="M19 7v14"/>
            </svg>
          </div>
          <div style="
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: ping 2s infinite;
            z-index: 1;
          "></div>
        </div>
        <style>
          @keyframes ping {
            0% { transform: scale(0.5); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 0; }
          }
        </style>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -45]
    });

    forestRegions.forEach((region) => {
      const marker = L.marker([region.coordinates.lat, region.coordinates.lng], {
        icon: warehouseIcon
      });

      // Bind a div for now
      const popupDiv = document.createElement('div');

      marker.bindPopup(popupDiv, {
        maxWidth: 300,
        className: 'custom-popup-container', // We'll add styles for this if needed
        closeButton: false
      });

      // Render React component into the popup div when it opens
      marker.on('popupopen', () => {
        const root = createRoot(popupDiv);
        root.render(
          <PopupContent
            region={region}
            onPlantClick={(r) => {
              marker.closePopup();
              onPlantClick(r);
            }}
          />
        );

        // Cleanup on close to avoid memory leaks
        marker.once('popupclose', () => {
          setTimeout(() => root.unmount(), 0);
        });
      });

      marker.on('click', () => {
        if (onRegionClick) onRegionClick(region);
        // Force fly to the location for better UX
        map.flyTo([region.coordinates.lat, region.coordinates.lng], 8, {
          duration: 1.5
        });
      });

      markersLayer.addLayer(marker);
      bounds.push([region.coordinates.lat, region.coordinates.lng]);
    });

    // Add route polylines
    routes.forEach((route) => {
      const routeCoords = route.locations.map(locId => {
        const location = forestRegions.find(r => r.id === locId);
        return location ? [location.coordinates.lat, location.coordinates.lng] : null;
      }).filter(coord => coord !== null);

      if (routeCoords.length > 1) {
        const polyline = L.polyline(routeCoords, {
          color: '#3b82f6', // blue-500
          weight: 3,
          opacity: 0.8,
          dashArray: '10, 10', // dashed line
          lineCap: 'round',
          lineJoin: 'round'
        });
        markersLayer.addLayer(polyline);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [forestRegions, routes, onRegionClick, onPlantClick]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapRef} className="w-full h-full z-0" style={{ background: '#1a1a1a' }} />

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 max-w-xs z-[400] pointer-events-none">
        <div className="flex items-center gap-2 text-white font-semibold mb-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Logistics Network</span>
        </div>
        <p className="text-gray-400 text-sm mb-2">
          Click locations to view details. Blue lines show package routes.
        </p>
      </div>
    </div>
  );
};

export default ForestMap;
