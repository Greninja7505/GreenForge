import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, RefreshCw, Box, ArrowRight, Zap, Target } from "lucide-react";
import { useStellar } from "../context/StellarContext";

// --- Fix for Leaflet Default Icons (Just in case) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Mock Data ---

const CUSTOMERS = [
    { id: 'C1', name: "Tech Solutions Inc.", location: "Pune, MH", lat: 18.5204, lng: 73.8567, type: 'Customer', status: 'Active' },
    { id: 'C2', name: "Green Earth Cafe", location: "Nashik, MH", lat: 19.9975, lng: 73.7898, type: 'Customer', status: 'Active' },
    { id: 'C3', name: "Urban Retailers", location: "Surat, GJ", lat: 21.1702, lng: 72.8311, type: 'Customer', status: 'Active' },
    { id: 'C4', name: "Eco Mart", location: "Indore, MP", lat: 22.7196, lng: 75.8577, type: 'Customer', status: 'Active' }
];

const WAREHOUSES = [
    { id: 'W1', name: "Central Hub - Mumbai", location: "Mumbai, MH", lat: 19.0760, lng: 72.8777, type: 'Warehouse', capacity: '85%', stock: 4320 },
    { id: 'W2', name: "Northern Distribution", location: "Delhi, DL", lat: 28.7041, lng: 77.1025, type: 'Warehouse', capacity: '60%', stock: 2100 },
    { id: 'W3', name: "Southern Logistics", location: "Bangalore, KA", lat: 12.9716, lng: 77.5946, type: 'Warehouse', capacity: '45%', stock: 1540 }
];

const PACKAGES = [
    { id: "PKG-8821", from: 'W1', to: 'C1', status: 'In Transit', progress: 65, type: 'Reusable Crate', co2Saved: '2.4kg', eta: '2h 15m' },
    { id: "PKG-9932", from: 'W2', to: 'C4', status: 'Sorting', progress: 15, type: 'Bio-Box', co2Saved: '1.2kg', eta: '14h 30m' },
    { id: "PKG-7745", from: 'C2', to: 'W1', status: 'Returning', progress: 40, type: 'Empty Container', co2Saved: '0.8kg', eta: '5h 45m' }, // Circular flow
    { id: "PKG-6623", from: 'W3', to: 'C3', status: 'Delivered', progress: 100, type: 'Reusable Crate', co2Saved: '2.4kg', eta: 'Completed' },
];

// --- Map Component ---

const LogisticsMap = ({ warehouses, customers, packages, selectedNode, onNodeClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef(null); // Initialize as null

    // 1. Initialize Map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        try {
            const map = L.map(mapRef.current, {
                center: [20.5937, 78.9629],
                zoom: 5,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: true
            });

            // Dark/Matrix Theme
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(map);

            // Initialize LayerGroup
            const layerGroup = L.layerGroup().addTo(map);
            markersRef.current = layerGroup;
            mapInstanceRef.current = map;

            // Fix for resize issues
            setTimeout(() => {
                map.invalidateSize();
            }, 500);

        } catch (error) {
            console.error("Error initializing map:", error);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersRef.current = null;
            }
        };
    }, []);

    // 2. Update Markers
    useEffect(() => {
        const map = mapInstanceRef.current;
        const group = markersRef.current;

        // Safety check
        if (!map || !group) return;

        try {
            group.clearLayers();

            const createIcon = (type, isSelected, name) => {
                if (type === 'warehouse') {
                    return L.divIcon({
                        className: 'custom-marker-wh',
                        html: `
                            <div class="relative flex items-center justify-center">
                                <div class="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping"></div>
                                <div class="relative w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)] z-10 transition-transform hover:scale-110">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/><path d="M12 3l9 7h-9V3z"/><path d="M3 10h18"/><path d="M12 10v11"/></svg>
                                </div>
                                ${isSelected ? `<div class="absolute -top-10 bg-blue-900/90 text-blue-100 text-xs px-2 py-1 rounded border border-blue-500/50 whitespace-nowrap">${name}</div>` : ''}
                            </div>
                        `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });
                } else {
                    return L.divIcon({
                        className: 'custom-marker-cust',
                        html: `
                            <div class="relative flex items-center justify-center">
                                 <div class="w-4 h-4 bg-teal-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-transform hover:scale-125"></div>
                                 ${isSelected ? `<div class="absolute -top-8 bg-black/80 text-teal-200 text-xs px-2 py-1 rounded border border-teal-500/30 whitespace-nowrap">${name}</div>` : ''}
                            </div>
                        `,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    });
                }
            };

            // Warehouses
            warehouses.forEach(wh => {
                const marker = L.marker([wh.lat, wh.lng], {
                    icon: createIcon('warehouse', selectedNode?.id === wh.id, wh.name)
                }).addTo(group);

                marker.on('click', () => {
                    onNodeClick(wh);
                    map.flyTo([wh.lat, wh.lng], 9, { duration: 1.5 });
                });
            });

            // Customers
            customers.forEach(cust => {
                const marker = L.marker([cust.lat, cust.lng], {
                    icon: createIcon('customer', selectedNode?.id === cust.id, cust.name)
                }).addTo(group);

                marker.on('click', () => {
                    onNodeClick(cust);
                    map.flyTo([cust.lat, cust.lng], 10, { duration: 1 });
                });
            });

            // Routes
            packages.forEach(pkg => {
                if (pkg.status === 'Delivered') return;

                const fromNode = [...warehouses, ...customers].find(n => n.id === pkg.from);
                const toNode = [...warehouses, ...customers].find(n => n.id === pkg.to);

                if (fromNode && toNode) {
                    const isReturn = pkg.status === 'Returning';
                    const color = isReturn ? '#fbbf24' : '#3b82f6';

                    L.polyline([[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]], {
                        color: color,
                        weight: 2,
                        dashArray: '5, 10',
                        opacity: 0.6
                    }).addTo(group);
                }
            });

        } catch (error) {
            console.error("Error updating markers:", error);
        }

    }, [warehouses, customers, packages, selectedNode]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#111' }} />;
};


// --- Main Component ---

const PackageTracker = () => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    // Safely get user context, fallback if not available
    // Use Context (Must be top level)
    const stellar = useStellar();
    const publicKey = stellar?.publicKey;

    // Filter Packages
    const filteredPackages = PACKAGES.filter(pkg => {
        if (activeTab === 'active') return pkg.status !== 'Delivered';
        if (activeTab === 'completed') return pkg.status === 'Delivered';
        return true;
    });

    // Stats for Circular Economy
    const stats = {
        totalCirculating: 142,
        returnRate: '94%',
        activeRoutes: 12,
        co2Avoided: '458kg'
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden pt-16">
            
            <div className="flex-1 flex h-full relative z-0">

                {/* LEFT: Map Visualization (60%) */}
                <div className="w-[60%] relative border-r border-white/10 z-0">

                    {/* Header Overlay */}
                    <div className="absolute top-6 left-6 z-[400] pointer-events-none">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-black/90 backdrop-blur border border-white/10 p-5 rounded-2xl shadow-2xl"
                        >
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <RefreshCw className="w-6 h-6 text-green-500 animate-spin-slow" />
                                Circular<span className="text-gray-400 font-light">Flow</span>
                            </h1>
                            <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
                                Sustainable Logistics Network
                            </div>
                        </motion.div>
                    </div>

                    <LogisticsMap
                        warehouses={WAREHOUSES}
                        customers={CUSTOMERS}
                        packages={PACKAGES}
                        selectedNode={selectedNode}
                        onNodeClick={setSelectedNode}
                    />

                    {/* Legend / Key */}
                    <div className="absolute bottom-6 left-6 z-[400] flex gap-4 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded-full border border-blue-500/30 flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> Warehouse
                        </div>
                        <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded-full border border-teal-500/30 flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 bg-teal-500 rounded-full" /> Customer
                        </div>
                        <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded-full border border-yellow-500/30 flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 border-b-2 border-dashed border-yellow-500" /> Return Loop
                        </div>
                    </div>
                </div>

                {/* RIGHT: Control Panel (40%) */}
                <div className="w-[40%] flex flex-col bg-[#050505] relative z-10">

                    {/* 1. Top Section: Node Details or Network Stats */}
                    <div className="h-1/2 border-b border-white/10 flex flex-col">
                        <div className="p-5 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                {selectedNode ? 'Node Inspector' : 'Network Pulse'}
                            </h2>
                            <div className="flex gap-2">
                                {['active', 'completed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => !selectedNode && setActiveTab(tab)}
                                        className={`text-[10px] px-2 py-1 rounded uppercase font-bold transition-colors ${activeTab === tab && !selectedNode ? 'bg-white text-black' : 'text-gray-600 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            <AnimatePresence mode="wait">
                                {selectedNode ? (
                                    <motion.div
                                        key="node-details"
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 50, opacity: 0 }}
                                        className="p-6"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="text-xs text-blue-500 font-mono mb-1">{selectedNode.type.toUpperCase()}</div>
                                                <h3 className="text-3xl font-bold text-white mb-1">{selectedNode.name}</h3>
                                                <p className="text-gray-400 flex items-center gap-1.5 text-sm">
                                                    <MapPin className="w-3.5 h-3.5" /> {selectedNode.location}
                                                </p>
                                            </div>
                                            <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                                <ArrowRight className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>

                                        {/* Detailed Stats for Node */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="text-gray-500 text-xs uppercase mb-1">Active Shipments</div>
                                                <div className="text-2xl font-mono text-white">24</div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="text-gray-500 text-xs uppercase mb-1">Efficiency Score</div>
                                                <div className="text-2xl font-mono text-green-400">98.2%</div>
                                            </div>
                                            {selectedNode.type === 'Warehouse' && (
                                                <div className="col-span-2 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/20">
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-sm text-blue-300">Storage Capacity</span>
                                                        <span className="text-xl font-bold text-white">{selectedNode.capacity}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-blue-500 h-full" style={{ width: selectedNode.capacity }}></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500 font-mono text-center">
                                            NODE ID: {selectedNode.id} • LAT: {selectedNode.lat} • LNG: {selectedNode.lng}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {filteredPackages.length > 0 ? filteredPackages.map((pkg, i) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={pkg.id}
                                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pkg.status === 'Returning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                            {pkg.status === 'Returning' ? <RefreshCw className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{pkg.id}</div>
                                                            <div className="text-[10px] text-gray-500 uppercase">{pkg.type}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded font-mono ${pkg.status === 'Returning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {pkg.status}
                                                    </div>
                                                </div>

                                                {/* Progress Bar for Transit */}
                                                <div className="mt-3">
                                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                        <span>{pkg.from}</span>
                                                        <span>{pkg.eta}</span>
                                                        <span>{pkg.to}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden relative">
                                                        <div className={`h-full ${pkg.status === 'Returning' ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${pkg.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="p-8 text-center text-gray-500 text-sm font-mono">
                                                No {activeTab} packages found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 2. Bottom Section: Circular Economy Impact Terminal */}
                    <div className="h-1/2 flex flex-col bg-black border-t border-white/10">
                        <div className="p-3 bg-[#111] border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-mono text-green-500 tracking-wider">ECO_RATING_LIVE</span>
                            </div>
                            <div className="text-[10px] text-gray-600 font-mono">UPDATED: {new Date().toLocaleTimeString()}</div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-center">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-green-900/10 to-transparent border border-green-500/20 p-5 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <RefreshCw className="w-16 h-16 text-green-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stats.returnRate}</div>
                                    <div className="text-xs text-green-400 uppercase tracking-wider font-semibold">Packaging Return Rate</div>
                                    <div className="text-[10px] text-gray-500 mt-2">Target: 95% by 2026</div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Target className="w-16 h-16 text-blue-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stats.co2Avoided}</div>
                                    <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold">CO₂ Emissions Avoided</div>
                                    <div className="text-[10px] text-gray-500 mt-2">Vs. Single-Use Plastics</div>
                                </div>

                                <div className="col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 font-mono text-xs">
                                    <div className="text-gray-500 mb-2">System Events</div>
                                    <div className="space-y-1.5 h-24 overflow-y-auto custom-scrollbar">
                                        <div className="flex gap-2 text-gray-400"><span className="text-green-500">{">>>"}</span> PKG-7745 returned to Central Hub</div>
                                        <div className="flex gap-2 text-gray-400"><span className="text-blue-500">{">>>"}</span> New delivery scheduled for Tech Solutions</div>
                                        <div className="flex gap-2 text-gray-400"><span className="text-green-500">{">>>"}</span> CO2 Validation complete block #992831</div>
                                        <div className="flex gap-2 text-gray-400"><span className="text-yellow-500">{">>>"}</span> Optimizing route for Driver-04</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Wallet Status */}
                        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 text-xs text-gray-500 flex justify-between items-center font-mono">
                            <div>NETWORK: STELLAR MAINNET</div>
                            <div className={publicKey ? "text-green-500" : "text-gray-500"}>
                                {publicKey ? `PAIRED: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "WALLET NOT DETECTED"}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
};

export default PackageTracker;
