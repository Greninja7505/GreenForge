import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TreePine, Leaf, Globe, Award, ChevronRight, X, Check, Wallet, Info, AlertCircle, Loader } from "lucide-react";
import { useStellar } from "../context/StellarContext";
import toast from "react-hot-toast";
import ForestMap from "../components/ForestMap";

const DigitalForest = () => {
    const { publicKey, isConnected, connectWallet } = useStellar();
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [plantingFlow, setPlantingFlow] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plotsData, setPlotsData] = useState({});

    const [stats, setStats] = useState({
        totalTrees: 12547,
        co2Absorbed: 3421,
        forestsActive: 23,
        availablePlots: 156
    });

    // Real forest locations in India
    const forestRegions = [
        {
            id: 1,
            name: "Western Ghats Restoration",
            location: "Karnataka, India",
            coordinates: { lat: 13.0827, lng: 77.5877 },
            treesPlanted: 4532,
            totalPlots: 100,
            co2Offset: 1245,
            area: "45 hectares",
            status: "Active",
            pricePerTree: 25,
            priceInXLM: 5,
            image: "/images/bounties/tree_planting.png",
            description: "Restoring biodiversity in one of the world's eight hottest biodiversity hotspots",
            species: [
                { name: "Teak", scientificName: "Tectona grandis", co2PerYear: 22, maturityYears: 25 },
                { name: "Rosewood", scientificName: "Dalbergia latifolia", co2PerYear: 18, maturityYears: 20 },
                { name: "Sandalwood", scientificName: "Santalum album", co2PerYear: 15, maturityYears: 15 },
                { name: "Bamboo", scientificName: "Bambusa bambos", co2PerYear: 35, maturityYears: 5 }
            ],
            soilType: "Laterite",
            rainfall: "2500mm/year",
            partner: "Karnataka Forest Department",
            verificationMethod: "IoT sensors + Satellite imagery",
            updateFrequency: "Weekly"
        },
        {
            id: 2,
            name: "Mangrove Conservation",
            location: "Mumbai, Maharashtra",
            coordinates: { lat: 19.0760, lng: 72.8777 },
            treesPlanted: 3214,
            totalPlots: 80,
            co2Offset: 892,
            area: "28 hectares",
            status: "Active",
            pricePerTree: 30,
            priceInXLM: 6,
            image: "/images/bounties/beach_cleanup.png",
            description: "Protecting coastal ecosystems and preventing erosion along Mumbai's coastline",
            species: [
                { name: "Avicennia", scientificName: "Avicennia marina", co2PerYear: 40, maturityYears: 10 },
                { name: "Rhizophora", scientificName: "Rhizophora mucronata", co2PerYear: 38, maturityYears: 12 },
                { name: "Sonneratia", scientificName: "Sonneratia alba", co2PerYear: 35, maturityYears: 15 }
            ],
            soilType: "Saline",
            rainfall: "2200mm/year",
            partner: "Mumbai Mangrove Conservation Unit",
            verificationMethod: "Drone surveys + Ground verification",
            updateFrequency: "Bi-weekly"
        },
        {
            id: 3,
            name: "Himalayan Reforestation",
            location: "Uttarakhand, India",
            coordinates: { lat: 30.0668, lng: 79.0193 },
            treesPlanted: 2891,
            totalPlots: 120,
            co2Offset: 756,
            area: "62 hectares",
            status: "Active",
            pricePerTree: 35,
            priceInXLM: 7,
            image: "/images/bounties/tree_planting.png",
            description: "Combating deforestation and soil erosion in the Himalayan foothills",
            species: [
                { name: "Deodar Cedar", scientificName: "Cedrus deodara", co2PerYear: 28, maturityYears: 30 },
                { name: "Oak", scientificName: "Quercus leucotrichophora", co2PerYear: 25, maturityYears: 25 },
                { name: "Pine", scientificName: "Pinus roxburghii", co2PerYear: 30, maturityYears: 20 },
                { name: "Rhododendron", scientificName: "Rhododendron arboreum", co2PerYear: 20, maturityYears: 15 }
            ],
            soilType: "Mountain",
            rainfall: "1800mm/year",
            partner: "Uttarakhand Forest Department",
            verificationMethod: "Ground teams + Satellite monitoring",
            updateFrequency: "Monthly"
        }
    ];

    // Simulate fetching plot availability from backend
    useEffect(() => {
        const fetchPlotData = async () => {
            // In production, this would be an API call
            const mockPlotData = {};
            forestRegions.forEach(region => {
                const plots = [];
                for (let i = 1; i <= region.totalPlots; i++) {
                    plots.push({
                        plotNumber: i,
                        available: Math.random() > 0.3, // 70% available
                        owner: Math.random() > 0.3 ? null : `0x${Math.random().toString(16).substr(2, 8)}...`,
                        plantedDate: Math.random() > 0.3 ? null : new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
                    });
                }
                mockPlotData[region.id] = plots;
            });
            setPlotsData(mockPlotData);
        };

        fetchPlotData();
    }, []);

    const handlePlantTree = (region) => {
        if (!isConnected) {
            toast.error("Please connect your Stellar wallet first");
            connectWallet();
            return;
        }
        setSelectedRegion(region);
        setPlantingFlow('select-plot');
    };

    const handlePlotSelection = (plot) => {
        if (!plot.available) {
            toast.error("This plot is already taken");
            return;
        }
        setSelectedPlot(plot);
        setPlantingFlow('select-species');
    };

    const handleSpeciesSelection = (species) => {
        setSelectedSpecies(species);
        setPlantingFlow('payment');
    };

    const handleStellarPayment = async () => {
        if (!isConnected) {
            toast.error("Please connect your wallet");
            return;
        }

        setLoading(true);
        try {
            // In production, this would create a Stellar transaction
            // const transaction = await createTreeNFTTransaction({
            //   region: selectedRegion.id,
            //   plot: selectedPlot.plotNumber,
            //   species: selectedSpecies.name,
            //   price: selectedRegion.priceInXLM
            // });

            // Simulate blockchain transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success("Payment successful! Minting your Tree NFT...");

            // Simulate NFT minting
            await new Promise(resolve => setTimeout(resolve, 1500));

            setPlantingFlow('confirmation');

            // Update plot data
            setPlotsData(prev => ({
                ...prev,
                [selectedRegion.id]: prev[selectedRegion.id].map(p =>
                    p.plotNumber === selectedPlot.plotNumber
                        ? { ...p, available: false, owner: publicKey, plantedDate: new Date().toISOString() }
                        : p
                )
            }));

        } catch (error) {
            toast.error("Payment failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const closePlantingFlow = () => {
        setPlantingFlow(null);
        setSelectedRegion(null);
        setSelectedPlot(null);
        setSelectedSpecies(null);
    };

    const availablePlots = selectedRegion && plotsData[selectedRegion.id]
        ? plotsData[selectedRegion.id].filter(p => p.available).length
        : 0;

    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="container-custom py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Digital Twin Forests
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        Own real trees as NFTs. Track their growth, CO₂ absorption, and earn carbon credits.
                        Every tree is mapped, monitored, and verified on the blockchain.
                    </p>

                    {/* Global Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: "Trees Planted", value: stats.totalTrees.toLocaleString(), icon: TreePine, color: "text-green-400" },
                            { label: "CO₂ Absorbed", value: `${stats.co2Absorbed} tons`, icon: Leaf, color: "text-blue-400" },
                            { label: "Active Forests", value: stats.forestsActive, icon: Globe, color: "text-purple-400" },
                            { label: "Available Plots", value: stats.availablePlots, icon: MapPin, color: "text-yellow-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4"
                            >
                                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Real Interactive Map with Leaflet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Live Forest Map</h2>

                    <ForestMap
                        forestRegions={forestRegions}
                        onRegionClick={setSelectedRegion}
                        onPlantClick={handlePlantTree}
                    />

                    {/* Wallet Connection Notice */}
                    {!isConnected && (
                        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 max-w-md mx-auto">
                            <div className="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span>Wallet Not Connected</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">
                                Connect your Stellar wallet to plant trees and mint NFTs
                            </p>
                            <button
                                onClick={connectWallet}
                                className="w-full px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Forest Regions Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Active Forest Regions</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forestRegions.map((region, index) => (
                            <motion.div
                                key={region.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-green-900/40 to-blue-900/40 overflow-hidden">
                                    <img
                                        src={region.image}
                                        alt={region.name}
                                        className="w-full h-full object-cover opacity-60 hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${region.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                        }`}>
                                        {region.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{region.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span>{region.location}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">{region.description}</p>

                                    {/* Key Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Partner:</span>
                                            <span className="text-white font-medium">{region.partner}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Verification:</span>
                                            <span className="text-white font-medium">{region.verificationMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Updates:</span>
                                            <span className="text-white font-medium">{region.updateFrequency}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-black/40 rounded-lg p-3">
                                            <div className="text-green-400 text-2xl font-bold">{region.treesPlanted.toLocaleString()}</div>
                                            <div className="text-gray-400 text-xs">Trees Planted</div>
                                        </div>
                                        <div className="bg-black/40 rounded-lg p-3">
                                            <div className="text-yellow-400 text-2xl font-bold">{plotsData[region.id]?.filter(p => p.available).length || 0}</div>
                                            <div className="text-gray-400 text-xs">Available Plots</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePlantTree(region)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                    >
                                        Plant Tree ({region.priceInXLM} XLM)
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tree Planting Flow Modal */}
            <AnimatePresence>
                {plantingFlow && selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={closePlantingFlow}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-3xl p-8 max-w-4xl w-full my-8"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closePlantingFlow}
                                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* Step 1: Select Plot */}
                            {plantingFlow === 'select-plot' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Select Your Plot</h2>
                                    <p className="text-gray-400 mb-2">{selectedRegion.name}, {selectedRegion.location}</p>
                                    <p className="text-sm text-gray-500 mb-6">
                                        {availablePlots} of {selectedRegion.totalPlots} plots available
                                    </p>

                                    {/* Plot Grid - Visual representation */}
                                    <div className="grid grid-cols-10 gap-2 mb-6 max-h-96 overflow-y-auto p-4 bg-black/40 rounded-xl">
                                        {plotsData[selectedRegion.id]?.map((plot) => (
                                            <motion.button
                                                key={plot.plotNumber}
                                                whileHover={plot.available ? { scale: 1.1 } : {}}
                                                whileTap={plot.available ? { scale: 0.95 } : {}}
                                                onClick={() => handlePlotSelection(plot)}
                                                disabled={!plot.available}
                                                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${selectedPlot?.plotNumber === plot.plotNumber
                                                    ? 'border-green-500 bg-green-500/30 text-green-400'
                                                    : plot.available
                                                        ? 'border-white/20 bg-white/5 text-white hover:border-green-500/50 hover:bg-green-500/10'
                                                        : 'border-red-500/30 bg-red-500/10 text-red-400 cursor-not-allowed opacity-50'
                                                    }`}
                                                title={plot.available ? `Plot #${plot.plotNumber} - Available` : `Plot #${plot.plotNumber} - Taken by ${plot.owner}`}
                                            >
                                                {plot.plotNumber}
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center gap-6 mb-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-white/20 bg-white/5 rounded" />
                                            <span className="text-gray-400">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-red-500/30 bg-red-500/10 rounded" />
                                            <span className="text-gray-400">Taken</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 border-2 border-green-500 bg-green-500/30 rounded" />
                                            <span className="text-gray-400">Selected</span>
                                        </div>
                                    </div>

                                    {/* Selected Plot Info */}
                                    {selectedPlot && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                            <h3 className="text-white font-semibold mb-4">Plot #{selectedPlot.plotNumber} Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <div className="text-gray-400 mb-1">GPS Coordinates</div>
                                                    <div className="text-white font-mono text-xs">
                                                        {(selectedRegion.coordinates.lat + (selectedPlot.plotNumber * 0.0001)).toFixed(6)},
                                                        {(selectedRegion.coordinates.lng + (selectedPlot.plotNumber * 0.0001)).toFixed(6)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 mb-1">Soil Type</div>
                                                    <div className="text-white">{selectedRegion.soilType}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 mb-1">Annual Rainfall</div>
                                                    <div className="text-white">{selectedRegion.rainfall}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-400 mb-1">Area</div>
                                                    <div className="text-white">100 m²</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => selectedPlot && setPlantingFlow('select-species')}
                                        disabled={!selectedPlot}
                                        className="w-full px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue to Species Selection
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Select Species */}
                            {plantingFlow === 'select-species' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Choose Tree Species</h2>
                                    <p className="text-gray-400 mb-6">Plot #{selectedPlot.plotNumber} - {selectedRegion.name}</p>

                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        {selectedRegion.species.map((species, index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSpeciesSelection(species)}
                                                className={`text-left p-6 rounded-xl border-2 transition-all ${selectedSpecies?.name === species.name
                                                    ? 'border-green-500 bg-green-500/20'
                                                    : 'border-white/10 bg-white/5 hover:border-green-500/50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">{species.name}</h3>
                                                        <p className="text-gray-400 text-sm italic">{species.scientificName}</p>
                                                    </div>
                                                    {selectedSpecies?.name === species.name && (
                                                        <Check className="w-6 h-6 text-green-400" />
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <div className="text-gray-400">CO₂/Year</div>
                                                        <div className="text-green-400 font-bold">{species.co2PerYear} kg</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-400">Maturity</div>
                                                        <div className="text-white font-semibold">{species.maturityYears} years</div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {selectedSpecies && (
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                            <div className="flex items-start gap-3">
                                                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <div className="text-blue-400 font-semibold mb-1">Estimated Impact</div>
                                                    <div className="text-gray-300">
                                                        Your {selectedSpecies.name} will absorb approximately <span className="text-green-400 font-bold">{selectedSpecies.co2PerYear * selectedSpecies.maturityYears} kg of CO₂</span> over its lifetime ({selectedSpecies.maturityYears} years).
                                                        You'll earn <span className="text-yellow-400 font-bold">{(selectedSpecies.co2PerYear * selectedSpecies.maturityYears / 1000).toFixed(2)} carbon credits</span>.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPlantingFlow('select-plot')}
                                            className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => selectedSpecies && setPlantingFlow('payment')}
                                            disabled={!selectedSpecies}
                                            className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {plantingFlow === 'payment' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Complete Payment</h2>
                                    <p className="text-gray-400 mb-6">Plot #{selectedPlot.plotNumber} - {selectedSpecies.name}</p>

                                    {/* Order Summary */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                        <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Tree NFT ({selectedSpecies.name})</span>
                                                <span className="text-white font-semibold">{selectedRegion.priceInXLM} XLM</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Plot #{selectedPlot.plotNumber}</span>
                                                <span className="text-gray-500">Included</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Blockchain Fee</span>
                                                <span className="text-white font-semibold">0.1 XLM</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Verification & Monitoring (1 year)</span>
                                                <span className="text-white font-semibold">0.5 XLM</span>
                                            </div>
                                            <div className="border-t border-white/10 pt-3 flex justify-between text-lg">
                                                <span className="text-white font-bold">Total</span>
                                                <span className="text-green-400 font-bold">{(selectedRegion.priceInXLM + 0.6).toFixed(1)} XLM</span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-right">
                                                ≈ ${((selectedRegion.priceInXLM + 0.6) * 0.12).toFixed(2)} USD
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                        <h3 className="text-white font-semibold mb-4">Payment Method</h3>
                                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Wallet className="w-6 h-6 text-green-400" />
                                                <div>
                                                    <div className="text-white font-semibold">Stellar Wallet</div>
                                                    <div className="text-gray-400 text-sm font-mono">{publicKey?.slice(0, 8)}...{publicKey?.slice(-6)}</div>
                                                </div>
                                            </div>
                                            <Check className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>

                                    {/* What Happens Next */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                        <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5" />
                                            What Happens Next
                                        </h3>
                                        <ol className="space-y-2 text-sm text-gray-300">
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">1.</span>
                                                <span>Payment processed via Stellar blockchain</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">2.</span>
                                                <span>Tree NFT minted to your wallet</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">3.</span>
                                                <span>Physical tree planted by {selectedRegion.partner}</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">4.</span>
                                                <span>IoT sensors installed for monitoring</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">5.</span>
                                                <span>Weekly updates sent to your dashboard</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <span className="text-blue-400">6.</span>
                                                <span>Carbon credits earned as tree grows</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPlantingFlow('select-species')}
                                            disabled={loading}
                                            className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleStellarPayment}
                                            disabled={loading}
                                            className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Wallet className="w-5 h-5" />
                                                    Pay {(selectedRegion.priceInXLM + 0.6).toFixed(1)} XLM
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Confirmation */}
                            {plantingFlow === 'confirmation' && (
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Check className="w-12 h-12 text-green-400" />
                                    </motion.div>

                                    <h2 className="text-3xl font-bold text-white mb-2">Tree Planted Successfully!</h2>
                                    <p className="text-gray-400 mb-8">Your tree NFT has been minted and is now growing</p>

                                    {/* NFT Card */}
                                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-2xl p-8 mb-8 max-w-md mx-auto">
                                        <div className="text-7xl mb-4">🌳</div>
                                        <div className="text-green-400 font-mono text-sm font-semibold mb-2">
                                            TREE-{String(selectedRegion.id).padStart(2, '0')}{String(selectedPlot.plotNumber).padStart(3, '0')}
                                        </div>
                                        <div className="text-white font-bold text-2xl mb-1">{selectedSpecies.name}</div>
                                        <div className="text-gray-400 text-sm mb-6">
                                            Plot #{selectedPlot.plotNumber}, {selectedRegion.location}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="bg-black/40 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs mb-1">Age</div>
                                                <div className="text-white font-bold">0 days</div>
                                            </div>
                                            <div className="bg-black/40 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs mb-1">CO₂ Absorbed</div>
                                                <div className="text-green-400 font-bold">0 kg</div>
                                            </div>
                                            <div className="bg-black/40 rounded-lg p-3">
                                                <div className="text-gray-400 text-xs mb-1">Health</div>
                                                <div className="text-white font-bold">100%</div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 rounded-lg p-4 text-left">
                                            <div className="text-gray-400 text-xs mb-2">Blockchain Details</div>
                                            <div className="space-y-1 text-xs font-mono">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">NFT ID:</span>
                                                    <span className="text-white">0x{Math.random().toString(16).substr(2, 8)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Network:</span>
                                                    <span className="text-white">Stellar Mainnet</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Owner:</span>
                                                    <span className="text-white">{publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-w-md mx-auto">
                                        <button className="w-full px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors">
                                            View My Tree Dashboard
                                        </button>
                                        <button
                                            onClick={closePlantingFlow}
                                            className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                                        >
                                            Plant Another Tree
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DigitalForest;
