import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    X,
    ChevronRight,
    ChevronLeft,
    Layout,
    Globe,
    Shield,
    TrendingUp,
    Briefcase,
    Zap
} from 'lucide-react';

const TOUR_STEPS = [
    {
        title: "Welcome to ChainFund",
        content: "The first AI-verified trustless crowdfunding ecosystem on Stellar. We're building a new standard for decentralized finance and coordination.",
        icon: Globe,
        target: "home"
    },
    {
        title: "Project Discovery",
        content: "Browse and support campaigns that are AI-verified for legitimacy. Our platform uses milestone-based funding to ensure your donations are used exactly as promised.",
        icon: Layout,
        target: "projects"
    },
    {
        title: "Quadratic Governance",
        content: "Your voice matters. Use quadratic voting to influence platform decisions and milestone approvals. Power is weighted by reputation (SBTs) and stakes.",
        icon: Shield,
        target: "governance"
    },
    {
        title: "The ChainEconomy",
        content: "Experience a circular economy powered by the CHAIN token. Earn rewards through CHAINbacks when you donate, and stake your tokens on ChainFarm for high-yield rewards.",
        icon: TrendingUp,
        target: "economy"
    },
    {
        title: "Freelancer Hub",
        content: "Creators can hire talent directly from our integrated market. Freelancers earn reputation badges that multiply their governance power.",
        icon: Briefcase,
        target: "freelancer"
    },
    {
        title: "A Connected Economy",
        content: "ChainFund isn't just a set of tools—it's a large-scale economy. Each domain benefits the other: Projects create demand for freelancers, freelancers build the infrastructure for new projects, and governance keeps the system trustless. Together, we create a self-sustaining cycle of innovation and funding.",
        icon: Zap,
        target: "conclusion"
    }
];

const OnboardingTour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-show for first time users could be added here
    /*
    useEffect(() => {
      const hasSeenTour = localStorage.getItem('chainfund_tour_seen');
      if (!hasSeenTour) {
        setIsOpen(true);
        localStorage.setItem('chainfund_tour_seen', 'true');
      }
    }, []);
    */

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsOpen(false);
            setCurrentStep(0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const step = TOUR_STEPS[currentStep];
    const StepIcon = step.icon;

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-[60] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/20 transition-all"
            >
                <HelpCircle className="w-6 h-6" />
            </motion.button>

            {/* Tour Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-black border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)]"
                        >
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                                />
                            </div>

                            {/* Header */}
                            <div className="p-6 flex justify-between items-center border-b border-white/10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                                    Step {currentStep + 1} of {TOUR_STEPS.length}
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-10 text-center">
                                <div className="mb-8 flex justify-center">
                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative group">
                                        <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all rounded-full" />
                                        <StepIcon className="w-10 h-10 text-white relative z-10" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-semibold text-white mb-4 uppercase tracking-tight">
                                    {step.title}
                                </h2>
                                <div className="min-h-[120px]">
                                    <p className="text-white/60 leading-relaxed font-light mb-8">
                                        {step.content}
                                    </p>
                                </div>

                                {/* Dots */}
                                <div className="flex justify-center gap-1.5 mb-10">
                                    {TOUR_STEPS.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-white' : 'w-2 bg-white/10'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="flex-1 py-4 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 py-4 bg-white text-black rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all text-xs font-bold uppercase tracking-widest"
                                    >
                                        {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next Step'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                                <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                                    Click outside or press Esc to exit tour
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OnboardingTour;
