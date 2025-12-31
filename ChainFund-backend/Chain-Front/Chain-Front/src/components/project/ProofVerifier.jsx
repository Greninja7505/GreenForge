import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, CheckCircle, XCircle, Scan, Zap } from 'lucide-react';
import axios from 'axios';
import config from '../../config/environment';
import toast from 'react-hot-toast';

const ProofVerifier = ({ milestone, onVerify }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null); // Reset previous result
        }
    };

    const handleScan = async () => {
        if (!file) return;

        setScanning(true);

        // Convert to base64 if needed, or just send raw for now
        // For the demo we send title to get strictly mock response

        try {
            const response = await axios.post(`${config.api.baseUrl}/api/ai/verify-proof`, {
                milestone_title: milestone.title,
                image_base64: "data:image/jpeg;base64,..." // Placeholder
            });

            setTimeout(() => {
                setResult(response.data);
                setScanning(false);
                if (response.data.verified && onVerify) {
                    onVerify();
                    toast.success("Proof Verified by AI Oracle!", { icon: "🤖" });
                } else if (!response.data.verified) {
                    toast.error("AI verification failed. Try a clearer image.");
                }
            }, 2000); // Artificial delay for effect

        } catch (error) {
            console.error("Verification failed", error);
            toast.error("AI Service Error");
            setScanning(false);
        }
    };

    return (
        <div className="mt-4 bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
            <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                Submit Proof of Work
            </h4>

            {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-black/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Click to upload photo evidence</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="relative overflow-hidden rounded-lg border border-gray-700">
                    <img src={preview} alt="Proof" className="w-full h-48 object-cover opacity-80" />

                    {/* Scanning Overlay */}
                    <AnimatePresence>
                        {scanning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                >
                                    <Scan className="w-12 h-12 text-green-400" />
                                </motion.div>
                                <p className="text-green-400 text-sm mt-3 font-mono tracking-widest animate-pulse">ANALYZING PIXELS...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scan Line Animation */}
                    {scanning && (
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-20"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    )}

                    {/* Result Overlay */}
                    {!scanning && result && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                            {result.verified ? (
                                <>
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-2">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-white font-bold text-lg">Verified!</h3>
                                    <p className="text-green-400 text-xs mt-1 font-mono">{result.analysis}</p>
                                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                                        {result.objects_detected.map((obj, i) => (
                                            <span key={i} className="text-[10px] bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-500/30">
                                                {obj}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-12 h-12 text-red-500 mb-2" />
                                    <h3 className="text-white font-bold">Verification Failed</h3>
                                    <p className="text-red-400 text-xs mt-1">{result.analysis}</p>
                                    <button
                                        onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                                        className="mt-4 px-4 py-2 bg-white/10 rounded text-xs text-white hover:bg-white/20"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {!result && file && !scanning && (
                <button
                    onClick={handleScan}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Zap className="w-4 h-4" />
                    Verify with AI Oracle
                </button>
            )}
        </div>
    );
};

export default ProofVerifier;
