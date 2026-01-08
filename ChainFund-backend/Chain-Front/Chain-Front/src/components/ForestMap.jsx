import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ForestMap = ({ forestRegions, onRegionClick, onPlantClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [20.5937, 78.9629], // Center of India
            zoom: 5,
            zoomControl: true,
        });

        // Add dark theme tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom tree icon
        const treeIcon = L.divIcon({
            className: 'custom-tree-marker',
            html: `
        <div style="position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 2L7 7h3v5H7l5 5 5-5h-3V7h3l-5-5z"/>
            </svg>
          </div>
          <div style="
            position: absolute;
            top: -8px;
            left: -8px;
            width: 56px;
            height: 56px;
            background: rgba(16, 185, 129, 0.3);
            border-radius: 50%;
            animation: ping 2s infinite;
          "></div>
        </div>
        <style>
          @keyframes ping {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
        </style>
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        // Add markers for each forest
        const bounds = [];
        forestRegions.forEach((region) => {
            const marker = L.marker([region.coordinates.lat, region.coordinates.lng], {
                icon: treeIcon
            }).addTo(map);

            bounds.push([region.coordinates.lat, region.coordinates.lng]);

            // Create popup content
            const popupContent = `
        <div style="background: rgba(0, 0, 0, 0.95); border-radius: 12px; padding: 16px; min-width: 280px; color: white;">
          <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">${region.name}</h3>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 12px;">${region.location}</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: rgba(16, 185, 129, 0.2); border-radius: 8px; padding: 8px;">
              <div style="color: #10b981; font-weight: bold; font-size: 18px;">${region.treesPlanted.toLocaleString()}</div>
              <div style="color: #9ca3af; font-size: 12px;">Trees Planted</div>
            </div>
            <div style="background: rgba(59, 130, 246, 0.2); border-radius: 8px; padding: 8px;">
              <div style="color: #3b82f6; font-weight: bold; font-size: 18px;">${region.totalPlots}</div>
              <div style="color: #9ca3af; font-size: 12px;">Total Plots</div>
            </div>
          </div>

          <div style="font-size: 12px; color: #9ca3af; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>${region.coordinates.lat.toFixed(4)}, ${region.coordinates.lng.toFixed(4)}</span>
            </div>
            <div>Partner: ${region.partner}</div>
            <div>Verification: ${region.verificationMethod}</div>
          </div>

          <button 
            onclick="window.plantTreeClick(${region.id})"
            style="
              width: 100%;
              padding: 8px 16px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: background 0.3s;
            "
            onmouseover="this.style.background='#059669'"
            onmouseout="this.style.background='#10b981'"
          >
            Plant Tree Here (${region.priceInXLM} XLM)
          </button>
        </div>
      `;

            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            marker.on('click', () => {
                onRegionClick && onRegionClick(region);
            });
        });

        // Fit map to show all markers
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        // Global function for popup button
        window.plantTreeClick = (regionId) => {
            const region = forestRegions.find(r => r.id === regionId);
            if (region && onPlantClick) {
                onPlantClick(region);
            }
        };

        mapInstanceRef.current = map;

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            delete window.plantTreeClick;
        };
    }, [forestRegions, onRegionClick, onPlantClick]);

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10">
            <div ref={mapRef} className="w-full h-full z-0" />

            {/* Map Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 max-w-xs z-[1000] pointer-events-none">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Real Forest Locations</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                    Click on any green tree marker to view forest details and plant your tree NFT
                </p>
                <div className="text-xs text-gray-500">
                    Powered by OpenStreetMap
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-[1000] pointer-events-none">
                <div className="text-white font-semibold text-sm mb-2">Legend</div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-black"></div>
                    <span className="text-gray-300">Active Forest</span>
                </div>
            </div>
        </div>
    );
};

export default ForestMap;
