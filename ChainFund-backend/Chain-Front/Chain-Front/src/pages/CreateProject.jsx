import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useStellar } from "../context/StellarContext";
import { useProjects } from "../context/ProjectsContext";
import {
  Upload,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Wallet,
  Plus,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { validateCampaignForm, sanitizeString } from "../utils/validation";
import { TransactionProgress, useTransactionState } from "../components/TransactionProgress";
import ContractService from "../services/ContractService";
import AIHelper from "../components/AIHelper";
import { generateProjectDescription, suggestMilestones } from "../services/AIService";

const CreateProject = () => {
  const { publicKey, isConnected, connectWallet } = useStellar();
  const { addProject } = useProjects();
  const navigate = useNavigate();
  const txState = useTransactionState();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingMilestones, setIsGeneratingMilestones] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "DeFi Infrastructure",
    goal: "",
    location: "",
    website: "",
    twitter: "",
    stellarAddress: publicKey || "",
  });

  const [milestones, setMilestones] = useState([
    { title: "", amount: "", date: "" }
  ]);

  // Listen for AI form fill events from the Agentic ChatBot
  useEffect(() => {
    const handleAIFormFill = (event) => {
      const { formType, data } = event.detail;
      if (formType === 'project' && data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          fullDescription: data.fullDescription || data.description || prev.fullDescription,
          category: data.category || prev.category,
          goal: data.goal?.toString() || prev.goal,
        }));
        toast.success('Form filled by AI Agent', { icon: '✨' });
      }
    };

    const handleAIMilestones = (event) => {
      const { milestones: aiMilestones } = event.detail;
      if (aiMilestones && Array.isArray(aiMilestones)) {
        const formattedMilestones = aiMilestones.map((m, idx) => ({
          title: m.title || `Milestone ${idx + 1}`,
          amount: m.amount?.toString() || '',
          date: m.date || new Date(Date.now() + (idx + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: m.description || ''
        }));
        setMilestones(formattedMilestones);
        toast.success('Milestones added by AI Agent', { icon: '🎯' });
      }
    };

    window.addEventListener('ai-fill-form', handleAIFormFill);
    window.addEventListener('ai-suggest-milestones', handleAIMilestones);

    return () => {
      window.removeEventListener('ai-fill-form', handleAIFormFill);
      window.removeEventListener('ai-suggest-milestones', handleAIMilestones);
    };
  }, []);

  const blockchainCategories = [
    { value: "DeFi Infrastructure", label: "DeFi Infrastructure" },
    { value: "Smart Contracts", label: "Smart Contracts" },
    { value: "Layer 2 & Scaling", label: "Layer 2 & Scaling" },
    { value: "NFT & Gaming", label: "NFT & Gaming" },
    { value: "Identity & Privacy", label: "Identity & Privacy" },
    { value: "Cross-Chain", label: "Cross-Chain" },
    { value: "Developer Tools", label: "Developer Tools" },
    { value: "Privacy Technology", label: "Privacy Technology" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      await connectWallet();
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeString(formData.title),
      description: sanitizeString(formData.description),
      fullDescription: sanitizeString(formData.fullDescription),
      goalAmount: parseFloat(formData.goal) || 0,
      category: formData.category,
      milestones: milestones.filter(m => m.title && m.amount).map(m => ({
        title: sanitizeString(m.title),
        amount: parseFloat(m.amount) || 0,
        description: ''
      }))
    };

    // Validate form
    const validation = validateCampaignForm(sanitizedData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    txState.start();

    try {
      // Step 1: Prepare transaction
      txState.setStep('prepare');
      
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Validate milestones
      const validMilestones = milestones.filter(
        m => m.title && m.amount && m.date
      ).map((m, idx) => ({
        id: idx + 1,
        title: sanitizeString(m.title),
        amount: parseInt(m.amount),
        date: m.date,
        completed: false
      }));

      // Step 2: Sign with wallet (simulated for now)
      txState.setStep('sign');
      await new Promise(r => setTimeout(r, 800));

      // Step 3: Submit to blockchain
      txState.setStep('submit');
      
      // Try to call smart contract
      let contractResult = null;
      try {
        contractResult = await ContractService.createCampaign(
          publicKey,
          sanitizedData.title,
          sanitizedData.description,
          sanitizedData.goalAmount,
          sanitizedData.milestones
        );
      } catch (contractError) {
        console.log('Contract call skipped (testnet mode):', contractError.message);
        // Continue with local storage for demo
      }

      // Step 4: Wait for confirmation
      txState.setStep('confirm');
      await new Promise(r => setTimeout(r, 1000));

      // Create project object
      const newProject = {
        slug,
        title: sanitizedData.title,
        category: formData.category,
        description: sanitizedData.description,
        fullDescription: sanitizedData.fullDescription,
        goal: parseInt(formData.goal),
        location: formData.location || "Decentralized",
        milestones: validMilestones,
        creator: {
          name: "Project Creator",
          address: formData.stellarAddress,
          verified: false,
          memberSince: new Date().getFullYear().toString()
        },
        updates: [],
        donations: [],
        contractTxHash: contractResult?.hash || null
      };

      addProject(newProject);
      
      txState.setSuccess(contractResult?.hash || 'local-' + Date.now());
      toast.success("Project created successfully!");
      
      setTimeout(() => {
        txState.close();
        navigate(`/project/${slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      txState.setError(error.message || "Failed to create project");
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", date: "" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // AI-powered description generator
  const handleGenerateDescription = async () => {
    if (!formData.title) {
      toast.error("Please enter a project title first");
      return;
    }
    
    setIsGeneratingDescription(true);
    try {
      const description = await generateProjectDescription({
        title: formData.title,
        category: formData.category,
        goal: formData.goal || '10000',
        brief: formData.description || 'A blockchain project'
      });
      
      setFormData(prev => ({
        ...prev,
        fullDescription: description
      }));
      toast.success("Description generated!");
    } catch (error) {
      toast.error("Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // AI-powered milestone suggester
  const handleSuggestMilestones = async () => {
    if (!formData.title || !formData.goal) {
      toast.error("Please enter title and goal first");
      return;
    }
    
    setIsGeneratingMilestones(true);
    try {
      const suggestions = await suggestMilestones({
        title: formData.title,
        category: formData.category,
        goal: formData.goal,
        description: formData.description
      });
      
      toast.success("AI suggestions ready! Check the AI helper.");
    } catch (error) {
      toast.error("Failed to get suggestions");
    } finally {
      setIsGeneratingMilestones(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
            className="text-white mb-6"
          >
            Create Blockchain Project
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1.125rem",
              letterSpacing: "0.01em",
            }}
            className="text-gray-400"
          >
            Launch your DeFi, NFT, or blockchain infrastructure project
          </p>
        </motion.div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border border-white/10 rounded-xl p-8 mb-8"
          >
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.125rem",
                    letterSpacing: "0.02em",
                  }}
                  className="text-white mb-2"
                >
                  Connect Your Wallet
                </h3>
                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.95rem",
                  }}
                  className="text-gray-400 mb-4"
                >
                  You need to connect your Stellar wallet to create a project
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="flex items-center space-x-2 bg-black border border-white/20 text-white px-6 py-3 rounded-xl hover:border-white/40 transition-all duration-300"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Campaign Advisor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <AIHelper
            context="PROJECT_CREATOR"
            title="Campaign Creation AI"
            placeholder="Ask for help with your campaign..."
            suggestions={[
              "How do I write a compelling description?",
              "What milestones should I set?",
              "What's a realistic funding goal?",
              "How to attract donors?"
            ]}
          />
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-black border border-white/10 rounded-xl p-8">
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Stellar DeFi Liquidity Protocol"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief one-line description (max 200 characters)"
                  rows={2}
                  maxLength={200}
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Full Description *
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription || !formData.title}
                    className="ml-3 inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 disabled:opacity-50 normal-case"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                  </button>
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Detailed description of your project, technical features, goals, and roadmap"
                  rows={8}
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    lineHeight: "1.8",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="block text-gray-400 mb-2"
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                    }}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition-all"
                    required
                  >
                    {blockchainCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="block text-gray-400 mb-2"
                  >
                    Funding Goal (USD) *
                  </label>
                  <input
                    type="number"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="e.g., 200000"
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                    }}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Decentralized, Global, or specific location"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-black border border-white/10 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.5rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="text-white"
              >
                Milestones *
              </h2>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addMilestone}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="flex items-center space-x-2 bg-black border border-white/20 text-white px-4 py-2 rounded-xl hover:border-white/40 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add Milestone</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-gray-400"
                    >
                      Milestone {index + 1}
                    </span>
                    {milestones.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMilestone(index)}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                      placeholder="Milestone title (e.g., Testnet Launch)"
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                      }}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={milestone.amount}
                        onChange={(e) =>
                          updateMilestone(index, "amount", e.target.value)
                        }
                        placeholder="Funding amount (USD)"
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                        }}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                        min="0"
                      />

                      <input
                        type="date"
                        value={milestone.date}
                        onChange={(e) =>
                          updateMilestone(index, "date", e.target.value)
                        }
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                        }}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="bg-black border border-white/10 rounded-xl p-8">
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Blockchain Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Stellar Wallet Address *
                </label>
                <input
                  type="text"
                  name="stellarAddress"
                  value={formData.stellarAddress || publicKey || ""}
                  onChange={handleChange}
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                  required
                  disabled={isConnected}
                />
                {isConnected && (
                  <div className="flex items-center space-x-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                      className="text-green-400"
                    >
                      Connected wallet address
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="bg-black border border-white/10 rounded-xl p-8">
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Additional Links
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourproject.com"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="block text-gray-400 mb-2"
                >
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="@yourproject"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                  }}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/projects/all")}
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="bg-black border border-white/10 text-white px-8 py-4 rounded-xl hover:border-white/30 transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isConnected || isSubmitting}
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              className="bg-black border border-white/20 text-white px-8 py-4 rounded-xl hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>

      {/* Transaction Progress Modal */}
      {txState.isOpen && (
        <TransactionProgress
          currentStep={txState.currentStep}
          status={txState.status}
          txHash={txState.txHash}
          error={txState.error}
          onClose={txState.close}
        />
      )}
    </motion.div>
  );
};

export default CreateProject;
