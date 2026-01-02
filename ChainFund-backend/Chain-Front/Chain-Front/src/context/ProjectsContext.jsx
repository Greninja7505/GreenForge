import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { projectsData as fallbackProjects } from "../data/projects";

const ProjectsContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from API on mount
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/projects`);

      if (response.ok) {
        const data = await response.json();
        const apiProjects = data.projects || [];

        // Transform API data to match frontend format
        const transformedProjects = apiProjects.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          category: p.category || "Environment",
          image: p.image || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
          description: p.description,
          fullDescription: p.full_description || p.description,
          raised: p.raised || 0,
          goal: p.goal || 10000,
          donors: p.donors || 0,
          upvotes: p.upvotes || 0,
          downvotes: p.downvotes || 0,
          verified: Boolean(p.verified),
          givbacksEligible: Boolean(p.givbacks_eligible),
          location: p.location || "Global",
          stellarAddress: p.creator_stellar_address,
          creator: {
            name: p.creator_name || "Anonymous",
            wallet: p.creator_wallet,
            stellarAddress: p.creator_stellar_address,
            verified: Boolean(p.creator_verified),
            memberSince: p.creator_member_since
          },
          milestones: p.milestones || [],
          updates: p.updates || [],
          donations: p.recent_donations || []
        }));

        setProjects(transformedProjects);
        console.log(`✅ Loaded ${transformedProjects.length} projects from API`);
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (err) {
      console.warn("⚠️ Failed to fetch projects from API, using fallback data:", err.message);
      setError(err.message);
      // Use fallback static data
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (newProject) => {
    try {
      // Try to create project via API
      const response = await fetch(`${API_URL}/api/v1/projects/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          full_description: newProject.fullDescription || newProject.description,
          category: newProject.category || "Environment",
          goal: newProject.goal,
          location: newProject.location || "Global",
          milestones: newProject.milestones || []
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh projects list
        await fetchProjects();
        return { ...newProject, id: result.project_id, slug: result.slug };
      }
    } catch (err) {
      console.warn("API create failed, adding locally:", err.message);
    }

    // Fallback: add locally
    const project = {
      ...newProject,
      id: projects.length + 1,
      slug: newProject.title.toLowerCase().replace(/\s+/g, '-'),
      raised: 0,
      donors: 0,
      upvotes: 0,
      downvotes: 0,
      verified: false,
      givbacksEligible: false,
      updates: [],
      donations: [],
      milestones: newProject.milestones || [],
    };
    setProjects(prev => [...prev, project]);
    return project;
  };

  const updateProject = (slug, updates) => {
    setProjects(prev =>
      prev.map((p) => (p.slug === slug ? { ...p, ...updates } : p))
    );
  };

  const upvoteProject = async (slug) => {
    // Optimistic update
    setProjects(prev =>
      prev.map((p) =>
        p.slug === slug ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p
      )
    );

    // Try API call
    try {
      const project = projects.find(p => p.slug === slug);
      if (project) {
        await fetch(`${API_URL}/api/v1/projects/${project.id}/upvote`, { method: 'POST' });
      }
    } catch (err) {
      console.warn("Upvote API call failed:", err.message);
    }
  };

  const downvoteProject = async (slug) => {
    setProjects(prev =>
      prev.map((p) =>
        p.slug === slug ? { ...p, downvotes: (p.downvotes || 0) + 1 } : p
      )
    );

    try {
      const project = projects.find(p => p.slug === slug);
      if (project) {
        await fetch(`${API_URL}/api/v1/projects/${project.id}/downvote`, { method: 'POST' });
      }
    } catch (err) {
      console.warn("Downvote API call failed:", err.message);
    }
  };

  const getProjectBySlug = (slug) => {
    return projects.find((p) => p.slug === slug);
  };

  const getProjectsByCategory = (category) => {
    if (category === "All" || category === "all") return projects;
    return projects.filter((p) => p.category === category);
  };

  const getFeaturedProjects = () => {
    return [...projects].sort((a, b) => (b.raised || 0) - (a.raised || 0)).slice(0, 3);
  };

  const value = {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    upvoteProject,
    downvoteProject,
    getProjectBySlug,
    getProjectsByCategory,
    getFeaturedProjects,
    refetch: fetchProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
