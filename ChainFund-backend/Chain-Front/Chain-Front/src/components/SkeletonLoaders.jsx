import React from 'react';

/**
 * Skeleton Loading Components
 * Matching the black/white theme of ChainFund
 */

// Base skeleton pulse animation
const pulseClass = "animate-pulse bg-white/5";

/**
 * Basic skeleton shape
 */
export const Skeleton = ({ className = "", ...props }) => (
  <div className={`${pulseClass} rounded ${className}`} {...props} />
);

/**
 * Text line skeleton
 */
export const SkeletonText = ({ lines = 1, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4 rounded"
        style={{ width: i === lines - 1 ? '70%' : '100%' }}
      />
    ))}
  </div>
);

/**
 * Avatar skeleton
 */
export const SkeletonAvatar = ({ size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  return <Skeleton className={`${sizes[size]} rounded-full`} />;
};

/**
 * Button skeleton
 */
export const SkeletonButton = ({ width = "w-24" }) => (
  <Skeleton className={`${width} h-10 rounded-lg`} />
);

/**
 * Project Card Skeleton
 */
export const ProjectCardSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
    {/* Image */}
    <Skeleton className="h-48 w-full rounded-none" />
    
    {/* Content */}
    <div className="p-5 space-y-4">
      {/* Category badge */}
      <Skeleton className="w-20 h-5 rounded-full" />
      
      {/* Title */}
      <Skeleton className="w-3/4 h-6" />
      
      {/* Description */}
      <SkeletonText lines={2} />
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-full h-2 rounded-full" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <SkeletonAvatar size="sm" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  </div>
);

/**
 * Project Grid Skeleton
 */
export const ProjectGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Gig Card Skeleton
 */
export const GigCardSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-xl p-5 space-y-4">
    <div className="flex items-start gap-4">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
    <SkeletonText lines={2} />
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-14 h-6 rounded-full" />
    </div>
  </div>
);

/**
 * Dashboard Stats Skeleton
 */
export const StatCardSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-xl p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="w-12 h-5 rounded-full" />
    </div>
    <Skeleton className="w-24 h-8" />
    <Skeleton className="w-32 h-4" />
  </div>
);

/**
 * Stats Grid Skeleton
 */
export const StatsGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-white/5">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <Skeleton className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

/**
 * Table Skeleton
 */
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
    <table className="w-full">
      <thead className="border-b border-white/10">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="py-3 px-4 text-left">
              <Skeleton className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Profile Header Skeleton
 */
export const ProfileHeaderSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-2xl p-6">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <SkeletonAvatar size="xl" />
      <div className="flex-1 space-y-3 text-center md:text-left">
        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
        <SkeletonText lines={2} />
      </div>
      <SkeletonButton width="w-32" />
    </div>
  </div>
);

/**
 * Milestone Card Skeleton
 */
export const MilestoneCardSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-xl p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-32 h-5" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <SkeletonText lines={2} />
    <div className="flex justify-between items-center">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  </div>
);

/**
 * Transaction Item Skeleton
 */
export const TransactionSkeleton = () => (
  <div className="flex items-center justify-between py-3 border-b border-white/5">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-20 h-3" />
      </div>
    </div>
    <div className="text-right space-y-1">
      <Skeleton className="w-20 h-5" />
      <Skeleton className="w-16 h-3" />
    </div>
  </div>
);

/**
 * Full Page Loading Skeleton
 */
export const PageSkeleton = ({ type = "projects" }) => {
  switch (type) {
    case "projects":
      return (
        <div className="space-y-8 p-6">
          <div className="flex justify-between items-center">
            <Skeleton className="w-48 h-10" />
            <div className="flex gap-3">
              <Skeleton className="w-32 h-10 rounded-lg" />
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
          <ProjectGridSkeleton count={6} />
        </div>
      );
    case "dashboard":
      return (
        <div className="space-y-8 p-6">
          <Skeleton className="w-64 h-10" />
          <StatsGridSkeleton count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableSkeleton rows={5} columns={4} />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      );
    case "profile":
      return (
        <div className="space-y-6 p-6">
          <ProfileHeaderSkeleton />
          <StatsGridSkeleton count={3} />
          <ProjectGridSkeleton count={3} />
        </div>
      );
    default:
      return <ProjectGridSkeleton count={6} />;
  }
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  ProjectCardSkeleton,
  ProjectGridSkeleton,
  GigCardSkeleton,
  StatCardSkeleton,
  StatsGridSkeleton,
  TableSkeleton,
  ProfileHeaderSkeleton,
  MilestoneCardSkeleton,
  TransactionSkeleton,
  PageSkeleton
};
