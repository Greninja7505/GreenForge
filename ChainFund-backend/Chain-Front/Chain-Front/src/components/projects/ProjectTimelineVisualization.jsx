import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, TrendingUp, Target } from "lucide-react";

const ProjectTimelineVisualization = ({ milestones, raised, goal }) => {
  // Calculate overall project progress
  const overallProgress = (raised / goal) * 100;

  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate milestone progress based on funding
  const getMilestoneStatus = (milestone) => {
    const progress = (raised / milestone.amount) * 100;
    if (milestone.completed) return { status: 'completed', progress: 100 };
    if (progress >= 100) return { status: 'funded', progress: 100 };
    return { status: 'pending', progress: Math.min(progress, 100) };
  };

  // Get status color and icon
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400',
          icon: CheckCircle,
          label: 'Completed'
        };
      case 'funded':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400',
          icon: TrendingUp,
          label: 'Funded'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/50',
          text: 'text-gray-400',
          icon: Clock,
          label: 'Pending'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black border border-white/10 rounded-xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-white/10 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "1.25rem",
            }}
            className="text-white"
          >
            Project Timeline Visualization
          </h3>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.875rem",
            }}
            className="text-gray-400"
          >
            Gantt chart showing milestones, funding releases, and deliverables
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.875rem",
            }}
            className="text-gray-400"
          >
            Overall Project Progress
          </span>
          <span
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "0.875rem",
            }}
            className="text-white"
          >
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallProgress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
          />
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-white/5"></div>

        {/* Timeline items */}
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const { status, progress } = getMilestoneStatus(milestone);
            const style = getStatusStyle(status);
            const IconComponent = style.icon;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${style.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "400",
                          fontSize: "1rem",
                        }}
                        className="text-white mb-1"
                      >
                        {milestone.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`${style.text} font-medium`}>
                          {style.label}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                          }}
                          className="text-gray-400"
                        >
                          ${milestone.amount.toLocaleString()}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                          }}
                          className="text-gray-400"
                        >
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.75rem",
                        }}
                        className="text-gray-500"
                      >
                        Funding Progress
                      </span>
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "400",
                          fontSize: "0.75rem",
                        }}
                        className={`${style.text}`}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full ${
                          status === 'completed'
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : status === 'funded'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.75rem",
              }}
              className="text-gray-400"
            >
              Completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.75rem",
              }}
              className="text-gray-400"
            >
              Funded
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.75rem",
              }}
              className="text-gray-400"
            >
              Pending
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectTimelineVisualization;