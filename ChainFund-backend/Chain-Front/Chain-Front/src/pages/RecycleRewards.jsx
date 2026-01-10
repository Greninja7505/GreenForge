import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SMART_BINS, MOCK_PRODUCT_DB } from '../data/recycleData';
import Navbar from '../components/layout/Navbar';

// --- Sub-Components ---

const BinMap = ({ bins, selectedBin, onBinClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: [21.0, 78.0],
            zoom: 5,
            zoomControl: false,
            scrollWheelZoom: true,
            attributionControl: false
        });

        // High-end Dark Theme Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;

        setTimeout(() => map.invalidateSize(), 500);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear layers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        bins.forEach(bin => {
            const isOnline = bin.status === 'Online';
            const isSelected = selectedBin?.id === bin.id;
            const color = isOnline ? '#22c55e' : '#ef4444'; // Green-500 : Red-500

            const binIcon = L.divIcon({
                className: 'custom-bin-marker',
                html: `
                     <div class="relative flex items-center justify-center w-12 h-12 group cursor-pointer">
                         <div class="absolute w-full h-full rounded-full animate-ping" style="background-color: ${color}; opacity: 0.2;"></div>
                         <div class="relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style="background-color: ${color}; box-shadow: 0 0 15px ${color}80;">
                            ${isSelected ? '<div class="w-3 h-3 bg-white rounded-full"></div>' : ''}
                         </div>
                         ${isSelected ? `<div class="absolute -bottom-8 bg-black/80 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap border border-white/20">${bin.name}</div>` : ''}
                     </div>
                 `,
                iconSize: [48, 48],
                iconAnchor: [24, 24]
            });

            const marker = L.marker([bin.coordinates.lat, bin.coordinates.lng], { icon: binIcon }).addTo(map);
            marker.on('click', () => {
                onBinClick(bin);
            });
        });

        if (selectedBin) {
            map.flyTo([selectedBin.coordinates.lat, selectedBin.coordinates.lng], 13, { duration: 1.2 });
        }
    }, [bins, selectedBin, onBinClick]);

    return <div ref={mapRef} className="w-full h-full bg-[#050505]" />;
};

const StrictLog = ({ logs }) => {
    const endRef = useRef(null);
    useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [logs]);

    return (
        <div className="font-mono text-xs space-y-1 h-full overflow-y-auto custom-scrollbar p-4 bg-black/90">
            {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 border-l-2 pl-2 ${log.type === 'error' ? 'border-red-500 text-red-500' : log.type === 'success' ? 'border-green-500 text-green-400' : 'border-gray-700 text-gray-400'}`}>
                    <span className="opacity-50 w-16 shrink-0 text-[10px]">{log.time}</span>
                    <span className="break-words">{log.msg}</span>
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

// --- Main Component ---

const RecycleRewards = () => {
    const [bins, setBins] = useState(SMART_BINS);
    const [selectedBin, setSelectedBin] = useState(null);
    const [productId, setProductId] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [logs, setLogs] = useState([]);
    const [successData, setSuccessData] = useState(null);

    // Live Stats Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setBins(curr => curr.map(b => b.status === 'Online' && Math.random() > 0.6 ? {
                ...b,
                capacity: Math.min(100, Math.max(0, b.capacity + (Math.random() > 0.5 ? 1 : -0.5))),
                stats24h: { ...b.stats24h, transactions: b.stats24h.transactions + 1 }
            } : b));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (msg, type = 'info') => {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        setLogs(prev => [...prev, { time, msg, type }]);
    };

    const runStrictValidation = async () => {
        if (!productId) return;
        setIsValidating(true);
        setLogs([]);
        setSuccessData(null);

        try {
            addLog("INITIATING SECURE HANDSHAKE PROTOCOL...", 'info');
            await new Promise(r => setTimeout(r, 600));

            // Check 1: Input Format
            if (!productId.startsWith("PKG-")) {
                throw new Error("INVALID_FORMAT: ID must start with 'PKG-'. Security Denied.");
            }
            addLog(`PASSPORT ID: ${productId} [FORMAT OK]`, 'info');

            // Check 2: Bin Selection
            if (!selectedBin) {
                throw new Error("LOCATION_MISSING: No Smart Bin node targeted. Select node on map.");
            }
            addLog(`TARGET NODE: ${selectedBin.deviceID} [LOCKED]`, 'info');

            // Check 3: Blockchain
            await new Promise(r => setTimeout(r, 800));
            addLog("QUERYING IMMUTABLE LEDGER...", 'info');

            const product = MOCK_PRODUCT_DB[productId];
            if (!product) {
                throw new Error("ASSET_NOT_FOUND: Hash verification failed on-chain.");
            }
            if (product.isRecycled) {
                throw new Error(`DOUBLE_SPEND_ATTEMPT: Asset burn timestamp found at ${product.recyclingTimestamp}`);
            }
            addLog(`VERIFIED ASSET: ${product.name}`, 'success');

            // Check 4: Bin Status (Strict)
            await new Promise(r => setTimeout(r, 800));
            if (selectedBin.status !== "Online") {
                throw new Error(`HARDWARE_FAILURE: Node ${selectedBin.deviceID} is offline/maintenance.`);
            }
            addLog("HARDWARE DIAGNOSTIC: PASS", 'success');

            // Success
            await new Promise(r => setTimeout(r, 1000));
            addLog("CRYPTOGRAPHIC PROOF GENERATED.", 'success');
            addLog("SMART CONTRACT EXECUTED. TOKENS RELEASED.", 'success');

            setSuccessData(product);
            setIsValidating(false);

        } catch (err) {
            addLog(`CRITICAL ERROR: ${err.message}`, 'error');
            addLog("PROTOCOL TERMINATED.", 'error');
            setIsValidating(false);
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
            <Navbar />

            {/* Dashboard Container (Takes remaining height below Navbar) */}
            <div className="flex-1 flex pt-20 h-full">

                {/* LEFT: The Map (Hero) - 60% */}
                <div className="w-[60%] relative bg-[#0a0a0a] border-r border-white/10">
                    <div className="absolute top-4 left-4 z-[400] bg-black/80 backdrop-blur p-4 rounded border border-white/10 shadow-2xl">
                        <h1 className="text-2xl font-bold text-white mb-1"><span className="text-green-500">Green</span>Forge</h1>
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Global Recycling Matrix</div>
                    </div>

                    <BinMap bins={bins} selectedBin={selectedBin} onBinClick={setSelectedBin} />

                    {/* Telemetry Overlay Card (Bottom Center) */}
                    {selectedBin ? (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-black/80 backdrop-blur-xl border border-green-500/30 p-4 rounded-xl z-[400] flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom-10">
                            <div>
                                <div className="text-[10px] font-mono text-gray-500">CONNECTED NODE</div>
                                <div className="text-xl font-bold text-white">{selectedBin.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${selectedBin.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    <span className="text-xs font-mono">{selectedBin.deviceID}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="flex gap-8 text-right">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">Load</div>
                                    <div className="font-mono text-xl">{selectedBin.capacity}%</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">Temp</div>
                                    <div className="font-mono text-xl">{selectedBin.sensors.temp}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase">24h Vol</div>
                                    <div className="font-mono text-xl text-green-400">{selectedBin.stats24h.transactions} tx</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 bg-black/60 rounded-full border border-white/10 z-[400] text-xs text-gray-400 font-mono">
                            SELECT A NODE TO VIEW LIVE METRICS
                        </div>
                    )}
                </div>

                {/* RIGHT: Control Panel - 40% */}
                <div className="w-[40%] flex flex-col bg-[#050505] relative z-10 box-border">

                    {/* Top: Leaderboard / Comparison */}
                    <div className="h-1/2 border-b border-white/10 flex flex-col overflow-hidden">
                        <div className="p-4 bg-[#0a0a0a] border-b border-white/5 flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Node Performance (24h)</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            {bins.sort((a, b) => b.stats24h.transactions - a.stats24h.transactions).map((bin, i) => (
                                <div
                                    key={bin.id}
                                    onClick={() => setSelectedBin(bin)}
                                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-colors ${selectedBin?.id === bin.id ? 'bg-white/10' : ''}`}
                                >
                                    <div className="text-lg font-mono font-bold text-gray-600 w-6">#{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-sm">{bin.name}</span>
                                            <span className="text-xs font-mono text-green-400">{bin.stats24h.trend}</span>
                                        </div>
                                        <div className="w-full h-1 bg-gray-800 rounded mb-1">
                                            <div className="h-full bg-blue-600" style={{ width: `${Math.min((bin.stats24h.transactions / 500) * 100, 100)}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-500">
                                            <span>{bin.location}</span>
                                            <span>{bin.stats24h.transactions} processed</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: Terminal */}
                    <div className="h-1/2 flex flex-col bg-black">
                        <div className="p-3 bg-[#111] border-b border-white/10 flex justify-between items-center">
                            <div className="text-xs font-mono text-green-500">SECURE_VERIFICATION_V4</div>
                            {isValidating && <div className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded animate-pulse">BUSY</div>}
                        </div>

                        <div className="flex-1 relative">
                            <StrictLog logs={logs} />
                            {/* Success Overlay */}
                            {successData && (
                                <div className="absolute inset-0 bg-green-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
                                    <div className="text-5xl mb-2">✅</div>
                                    <h2 className="text-2xl font-bold text-white">VERIFIED</h2>
                                    <p className="text-green-300 font-mono mb-6">Token Transfer Complete</p>
                                    <div className="bg-black/40 p-4 rounded w-full mb-4 text-left font-mono text-xs text-gray-300">
                                        <div>HASH: {successData.batchHash}</div>
                                        <div>VAL: {successData.rewardValue} GF</div>
                                        <div>TS: {new Date().toISOString()}</div>
                                    </div>
                                    <button onClick={() => setSuccessData(null)} className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200">CLOSE RECEIPT</button>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={productId}
                                    onChange={e => setProductId(e.target.value)}
                                    placeholder="SCAN PASSPORT ID"
                                    className="flex-1 bg-[#151515] border border-white/10 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-green-500 outline-none uppercase rounded"
                                    onKeyDown={e => e.key === 'Enter' && runStrictValidation()}
                                />
                                <button
                                    onClick={runStrictValidation}
                                    disabled={isValidating}
                                    className="px-6 bg-green-600 hover:bg-green-500 text-white font-bold text-sm tracking-wider rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isValidating ? '...' : 'RUN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecycleRewards;
