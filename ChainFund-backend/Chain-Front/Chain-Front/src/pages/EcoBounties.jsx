import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Filter, Search, Award, Sprout, ArrowRight, Loader } from "lucide-react";
import ProofVerifier from "../components/project/ProofVerifier";
import toast from "react-hot-toast";
import { api } from "../utils/api";

const EcoBounties = () => {
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [activeTask, setActiveTask] = useState(null); // Task currently being worked on
    const [view, setView] = useState("map"); // 'map' or 'list'

    useEffect(() => {
        fetchBounties();
    }, []);

    const fetchBounties = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/bounties');
            // Add visual coordinates if missing (mock mapping for demo map)
            const mappedData = data.map((b, i) => ({
                ...b,
                // Simple deterministic position based on ID for demo map
                coordinates: {
                    top: `${20 + ((b.id * 13) % 60)}%`,
                    left: `${20 + ((b.id * 7) % 60)}%`
                },
                difficulty: b.reward > 80 ? "Hard" : b.reward > 40 ? "Medium" : "Easy",
                type: b.title.split(' ')[0] // Simple type inference
            }));
            setBounties(mappedData);
        } catch (error) {
            console.error("Failed to fetch bounties:", error);
            toast.error("Using offline mode for bounties");
            // Fallback to mock data if API fails
            setBounties([
                {
                    id: 1, title: "Clean Versova Beach", location: "Mumbai, IN", reward: 50, currency: "XLM",
                    difficulty: "Medium", type: "Cleanup", image: "https://images.unsplash.com/photo-1618477461853-5f8dd68aa61f?q=80&w=1000",
                    coordinates: { top: "40%", left: "60%" }, description: "Remove plastic waste."
                },
                {
                    id: 2, title: "Plant 50 Saplings", location: "Bangalore, IN", reward: 100, currency: "XLM",
                    difficulty: "Hard", type: "Planting", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73?q=80&w=1000",
                    coordinates: { top: "45%", left: "58%" }, description: "Reforestation drive."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (bounty) => {
        try {
            await api.post(`/api/bounties/${bounty.id}/claim`);
            toast.success(`Claimed: ${bounty.title}`);
            setActiveTask(bounty);
            setSelectedBounty(null);
            fetchBounties(); // Refresh list
        } catch (error) {
            toast.error(error.message || "Failed to claim bounty");
        }
    };

    const handleComplete = async () => {
        // In real app, upload proof via API
        toast.success("Proof submitted successfully!");
        setActiveTask(null);
        fetchBounties();
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-green-500" />
                    <p>Loading eco-bounties...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-20"
        >
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-light text-white mb-4 uppercase tracking-tighter">
                        Eco-Bounties
                    </h1>
                    <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
                        Gig Economy for the Planet. Find local tasks, complete them, earn crypto.
                    </p>
                </div>

                {/* Filters & Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex space-x-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setView("map")}
                            className={`px-4 py-2 rounded-md transition-all ${view === 'map' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Map View
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-2 rounded-md transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            List View
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-black border border-white/10 rounded-lg text-gray-400 hover:text-white">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-black border border-white/10 rounded-lg text-gray-400 hover:text-white">
                            <Search className="w-4 h-4" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[600px]">
                    {view === 'map' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                            {/* Map Area */}
                            <div className="lg:col-span-2 bg-gray-900/50 rounded-2xl border border-white/10 relative overflow-hidden group">
                                {/* Mock Map Background */}
                                <div
                                    className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale"
                                />

                                {/* Pins */}
                                {bounties.map(bounty => (
                                    <motion.button
                                        key={bounty.id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.2 }}
                                        style={{ top: bounty.coordinates?.top || '50%', left: bounty.coordinates?.left || '50%' }}
                                        onClick={() => setSelectedBounty(bounty)}
                                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-green-500 rounded-full border-4 border-black shadow-[0_0_20px_rgba(34,197,94,0.6)] flex items-center justify-center z-10 hover:z-20"
                                    >
                                        <Sprout className="w-4 h-4 text-black" />
                                    </motion.button>
                                ))}

                                {/* Selected Bounty Card Overlay */}
                                {selectedBounty && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-8 left-8 right-8 bg-black/90 backdrop-blur-xl border border-white/20 p-6 rounded-xl z-30"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl text-white font-medium mb-1">{selectedBounty.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedBounty.location}</span>
                                                    <span className="text-green-400 flex items-center gap-1"><Award className="w-3 h-3" /> {selectedBounty.reward}</span>
                                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{selectedBounty.difficulty}</span>
                                                </div>
                                                <p className="text-gray-300 text-sm mt-3 max-w-lg">{selectedBounty.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedBounty(null)}
                                                    className="px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:bg-white/5"
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    onClick={() => handleClaim(selectedBounty)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-900/20"
                                                >
                                                    Claim Quest
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Sidebar / Active Tasks */}
                            <div className="space-y-6 overflow-y-auto">
                                {activeTask ? (
                                    <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-4 text-green-400 text-sm font-medium uppercase tracking-wider">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                            Active Mission
                                        </div>
                                        <h3 className="text-2xl text-white font-light mb-2">{activeTask.title}</h3>
                                        <div className="flex justify-between text-sm text-gray-400 mb-6 border-b border-white/10 pb-4">
                                            <span>Reward: <b className="text-white">{activeTask.reward}</b></span>
                                            <span>Time Left: <b className="text-white">23h 59m</b></span>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-white text-sm mb-2">Instructions</h4>
                                            <ol className="text-gray-400 text-sm space-y-2 list-decimal pl-4">
                                                <li>Travel to coordinates</li>
                                                <li>Perform the cleanup/task</li>
                                                <li>Take a clear photo evidence</li>
                                                <li>Upload below for AI verification</li>
                                            </ol>
                                        </div>

                                        <ProofVerifier
                                            milestone={{ title: activeTask.title }}
                                            onVerify={handleComplete}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-black border border-white/10 rounded-xl p-6 h-full">
                                        <h3 className="text-white font-light mb-4 uppercase tracking-wider text-sm text-gray-500">Available Bounties</h3>
                                        <div className="space-y-3">
                                            {bounties.map(bounty => (
                                                <div
                                                    key={bounty.id}
                                                    onClick={() => setSelectedBounty(bounty)}
                                                    className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedBounty?.id === bounty.id ? 'bg-white/10 border-green-500/50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-white">{bounty.title}</h4>
                                                        <span className="text-green-400 text-xs font-mono">{bounty.reward}</span>
                                                    </div>
                                                    <div className="flex gap-2 text-xs text-gray-500">
                                                        <span>{bounty.type}</span>
                                                        <span>•</span>
                                                        <span>{bounty.location}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bounties.map((bounty) => (
                                <motion.div
                                    key={bounty.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-black border border-white/10 rounded-xl overflow-hidden group hover:border-green-500/30 transition-all duration-300 flex flex-col justify-between h-full"
                                >
                                    {/* Bounty Image */}
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={bounty.image}
                                            alt={bounty.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                            <span className="text-green-400 font-mono font-medium flex items-center gap-1 text-xs">
                                                {bounty.reward} <Sprout className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${bounty.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                bounty.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {bounty.difficulty}
                                            </span>
                                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {bounty.location}
                                            </span>
                                        </div>

                                        <h3 className="text-xl text-white font-medium mb-2">{bounty.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{bounty.description}</p>

                                        <button
                                            onClick={() => handleClaim(bounty)}
                                            className="w-full py-3 bg-white/5 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] font-medium text-sm"
                                        >
                                            Claim Quest <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EcoBounties;
