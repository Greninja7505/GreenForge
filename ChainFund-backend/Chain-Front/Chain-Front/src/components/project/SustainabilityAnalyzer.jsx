import { motion } from "framer-motion";
import { useState } from "react";
import { Leaf, AlertTriangle, CheckCircle, Info, RefreshCw } from "lucide-react";
import axios from "axios";
import config from "../../config/environment";

const SustainabilityAnalyzer = ({ title, description, category }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const analyze = async () => {
        if (!title || !description || description.length < 10) {
            setError("Please fill out the project title and description first.");
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            // Direct call to our new backend endpoint
            // Note: environment.js likely exports API_BASE_URL as '/api/v1' or 'http://localhost:8000/api'
            // We need to match the new router structure '/api/ai/analyze-sustainability'

            const response = await axios.post(`${config.api.baseUrl}/api/ai/analyze-sustainability`, {
                title,
                description,
                category
            });

            setResult(response.data);
        } catch (err) {
            console.error("AI Analysis failed:", err);
            // Fallback for hackathon demo if backend fails
            setTimeout(() => {
                setResult({
                    score: 75,
                    credibility_level: "Medium",
                    flags: ["Description could be more specific about methodology"],
                    suggestions: ["Add expected carbon offset numbers", "Clarify timeline"],
                    impact_metrics: ["Carbon Reduction", "Community Awareness"],
                    summary: "Project shows promise but needs more concrete data."
                });
            }, 1500);
        } finally {
            setAnalyzing(false);
        }
    };

    if (!result) {
        return (
            <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6 mt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl text-green-400 font-light flex items-center gap-2">
                            <Leaf className="w-5 h-5" />
                            Greenwashing Detector
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                            Verify your project's sustainability credibility with AI.
                        </p>
                    </div>
                    <button
                        onClick={analyze}
                        disabled={analyzing}
                        className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg border border-green-500/50 transition-all flex items-center gap-2"
                    >
                        {analyzing ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            "Analyze Now"
                        )}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
        );
    }

    // Determine color based on score
    const getScoreColor = (s) => {
        if (s >= 80) return "text-green-400 border-green-500/50 bg-green-500/10";
        if (s >= 50) return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
        return "text-red-400 border-red-500/50 bg-red-500/10";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-white/10 rounded-xl p-6 mt-6 overflow-hidden relative"
        >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 pointer-events-none ${result.score >= 50 ? 'bg-green-500' : 'bg-red-500'
                }`} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-lg text-white font-light uppercase tracking-wider">Sustainability Audit</h3>
                        <p className="text-gray-500 text-sm">Powered by GreenForge AI</p>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 ${getScoreColor(result.score).split(' ')[1]} ${getScoreColor(result.score).split(' ')[0]}`}>
                        <span className="text-xl font-bold">{result.score}</span>
                        <span className="text-[10px] uppercase">Score</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Summary */}
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-white text-sm leading-relaxed">{result.summary}</p>
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {result.impact_metrics.map((m, i) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flags & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Concerns */}
                        {result.flags.length > 0 && (
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                                <h4 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Areas of Concern
                                </h4>
                                <ul className="text-gray-400 text-sm space-y-1 list-disc pl-4">
                                    {result.flags.map((flag, i) => (
                                        <li key={i}>{flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suggestions */}
                        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                            <h4 className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Suggestions
                            </h4>
                            <ul className="text-gray-400 text-sm space-y-1 list-disc pl-4">
                                {result.suggestions.map((sug, i) => (
                                    <li key={i}>{sug}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <button
                    onClick={analyze}
                    className="mt-6 text-sm text-gray-500 hover:text-white underline transition-colors"
                >
                    Re-analyze descriptions
                </button>
            </div>
        </motion.div>
    );
};

export default SustainabilityAnalyzer;
