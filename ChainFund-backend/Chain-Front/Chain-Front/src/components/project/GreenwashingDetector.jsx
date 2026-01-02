import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Sparkles,
  TrendingUp,
  Shield,
  Target,
  Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * GreenwashingDetector Component
 * Analyzes project descriptions for sustainability authenticity using AI
 * Returns a score (0-100) and detailed feedback
 */
const GreenwashingDetector = ({ title, description, category, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-analyze when inputs change (debounced)
  useEffect(() => {
    if (!title || !description || description.length < 20) {
      setAnalysis(null);
      return;
    }

    const timer = setTimeout(() => {
      analyzeProject();
    }, 1500); // Debounce for 1.5 seconds

    return () => clearTimeout(timer);
  }, [title, description, category]);

  const analyzeProject = async () => {
    if (!title || !description) {
      toast.error('Please provide title and description');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/analyze-sustainability`,
        {
          title,
          description,
          category: category || 'General'
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
          }
        }
      );

      const result = response.data;
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

      // Show toast based on score
      if (result.score >= 80) {
        toast.success('✅ Excellent sustainability authenticity!');
      } else if (result.score >= 60) {
        toast('⚠️ Good, but could be more specific', { icon: '⚠️' });
      } else {
        toast.error('❌ Needs improvement to avoid greenwashing');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze. Using mock data.');
      
      // Fallback to mock analysis
      const mockScore = Math.floor(Math.random() * 40) + 40;
      const mockAnalysis = {
        score: mockScore,
        credibility_level: mockScore >= 70 ? 'High' : mockScore >= 50 ? 'Medium' : 'Low',
        flags: [
          'Description lacks specific metrics',
          'No clear timeline provided'
        ],
        suggestions: [
          'Include estimated CO2 reduction in tonnes/year',
          'Add measurable impact goals',
          'Reference scientific studies'
        ],
        impact_metrics: ['Environmental Awareness', 'Community Engagement'],
        summary: 'Project shows promise but needs more concrete data for verification.'
      };
      setAnalysis(mockAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getCredibilityIcon = (level) => {
    switch (level) {
      case 'High':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'Low':
      case 'Suspicious':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!title && !description) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            AI Sustainability Authenticity Check
          </h3>
        </div>
        {analysis && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-dark-800/50 border border-dark-700 rounded-xl"
        >
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          <span className="text-gray-300">Analyzing sustainability claims...</span>
        </motion.div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Score Display */}
            <div className={`p-6 rounded-xl border ${getScoreBackground(analysis.score)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getCredibilityIcon(analysis.credibility_level)}
                  <div>
                    <p className="text-sm text-gray-400">Authenticity Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}/100
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-400">Credibility Level</p>
                  <p className={`text-xl font-semibold ${getScoreColor(analysis.score)}`}>
                    {analysis.credibility_level}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${
                    analysis.score >= 80 ? 'bg-green-500' :
                    analysis.score >= 60 ? 'bg-yellow-500' :
                    analysis.score >= 40 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                />
              </div>

              {/* Summary */}
              <p className="mt-4 text-sm text-gray-300 italic">
                "{analysis.summary}"
              </p>
            </div>

            {/* Detailed Analysis */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Red Flags */}
                {analysis.flags && analysis.flags.length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <h4 className="font-semibold text-red-400">Concerns Detected</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.flags.map((flag, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-semibold text-cyan-400">Improvement Suggestions</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">✓</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impact Metrics */}
                {analysis.impact_metrics && analysis.impact_metrics.length > 0 && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-green-400" />
                      <h4 className="font-semibold text-green-400">Detected Impact Areas</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.impact_metrics.map((metric, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Manual Reanalyze Button */}
            <button
              onClick={analyzeProject}
              disabled={isAnalyzing}
              className="w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Reanalyze Project</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Box */}
      {!analysis && !isAnalyzing && description && description.length >= 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-dark-800/30 border border-dark-700 rounded-xl text-sm text-gray-400"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              Your project will be automatically analyzed for sustainability authenticity.
              Include specific metrics and scientific backing for a higher score.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GreenwashingDetector;
