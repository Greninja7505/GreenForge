import { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data for projects on the globe
const GLOBAL_PROJECTS = [
    {
        slug: "amazon-reforestation",
        name: "Amazon Reforestation",
        lat: -3.4653,
        lng: -62.2159,
        val: 80,
        category: "Nature",
        donated: "$120k",
        color: "#22c55e"
    },
    {
        slug: "solar-for-all",
        name: "Sahara Solar Grid",
        lat: 25.0,
        lng: 10.0,
        val: 50,
        category: "Energy",
        donated: "$45k",
        color: "#eab308"
    },
    {
        slug: "clean-balitic-sea",
        name: "Baltic Sea Cleanup",
        lat: 56.0,
        lng: 19.0,
        val: 30,
        category: "Cleanup",
        donated: "$15k",
        color: "#3b82f6"
    },
    {
        slug: "himalayan-wind",
        name: "Himalayan Wind Farm",
        lat: 28.0,
        lng: 84.0,
        val: 60,
        category: "Energy",
        donated: "$80k",
        color: "#a855f7"
    },
    {
        slug: "reef-restoration",
        name: "Coral Reef Revival",
        lat: -18.0,
        lng: 147.0,
        val: 90,
        category: "Nature",
        donated: "$200k",
        color: "#06b6d4"
    },
    {
        slug: "cali-fire-relief",
        name: "California Fire Relief",
        lat: 36.7783,
        lng: -119.4179,
        val: 40,
        category: "Disaster",
        donated: "$30k",
        color: "#ef4444"
    }
];

const ImpactGlobe = () => {
    const globeEl = useRef();
    const navigate = useNavigate();
    const [hoveredProject, setHoveredProject] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: 600 });

    // Auto-rotate & Resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: 600 });
        };
        window.addEventListener('resize', handleResize);

        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-black">

            {/* The 3D Globe */}
            <div className="absolute inset-0 flex items-center justify-center cursor-move">
                <Globe
                    ref={globeEl}
                    width={windowSize.width}
                    height={windowSize.height}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    backgroundColor="#000000"

                    // Rings (Active Impact Ripples)
                    ringsData={GLOBAL_PROJECTS}
                    ringColor={(d) => d.color}
                    ringMaxRadius={(d) => d.val / 10}
                    ringPropagationSpeed={2}
                    ringRepeatPeriod={800}

                    // Labels as Location Pins 📍
                    labelsData={GLOBAL_PROJECTS}
                    labelLat={(d) => d.lat}
                    labelLng={(d) => d.lng}
                    labelText={() => "📍"}
                    labelSize={2.5}
                    labelDotRadius={0.5}
                    labelColor={() => "#ef4444"} // Red pin
                    labelResolution={2}
                    labelAltitude={0.01}

                    // Interaction
                    onLabelClick={(point) => navigate(`/project/${point.slug}`)}
                    onLabelHover={(point) => {
                        setHoveredProject(point);
                        document.body.style.cursor = point ? "pointer" : "auto";
                    }}

                    // Aesthetics
                    atmosphereColor="#3b82f6"
                    atmosphereAltitude={0.15}
                />
            </div>

            {/* Floating Overlay for Hovered Project */}
            {hoveredProject && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 pointer-events-none bottom-10 md:bottom-auto md:top-1/2 md:right-10 bg-black/80 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-64 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: hoveredProject.color }}
                        />
                        <span className="text-xs uppercase tracking-widest text-gray-400">{hoveredProject.category}</span>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-1">{hoveredProject.name}</h3>
                    <p className="text-2xl font-light text-white mb-2">{hoveredProject.donated}</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span>📍</span>
                        <span>Click to View Project</span>
                    </div>
                </motion.div>
            )}

            {/* Global Stats Overlay */}
            <div className="absolute top-10 left-10 z-10 hidden md:block">
                <h2 className="text-4xl text-white font-light tracking-tighter uppercase mb-2">
                    Live Impact<br />Map
                </h2>
                <div className="flex gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Active Projects</p>
                        <p className="text-xl text-white">1,248</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Real-time Donated</p>
                        <p className="text-xl text-green-400">$4.2M+</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpactGlobe;
