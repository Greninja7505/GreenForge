import { createContext, useContext, useState, useEffect } from "react";
import { projectsData as initialProjects } from "../data/projects";

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    // Always use the latest projects data from the file
    // Clear any old cached data to ensure sustainability projects are loaded
    localStorage.removeItem("stellar_projects");
    return initialProjects;
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("stellar_projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (newProject) => {
    const project = {
      ...newProject,
      id: projects.length + 1,
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
    setProjects([...projects, project]);
    return project;
  };

  const updateProject = (slug, updates) => {
    setProjects(
      projects.map((p) => (p.slug === slug ? { ...p, ...updates } : p))
    );
  };

  const upvoteProject = (slug) => {
    setProjects(
      projects.map((p) =>
        p.slug === slug ? { ...p, upvotes: p.upvotes + 1 } : p
      )
    );
  };

  const downvoteProject = (slug) => {
    setProjects(
      projects.map((p) =>
        p.slug === slug ? { ...p, downvotes: p.downvotes + 1 } : p
      )
    );
  };

  const getProjectBySlug = (slug) => {
    return projects.find((p) => p.slug === slug);
  };

  const getProjectsByCategory = (category) => {
    if (category === "All") return projects;
    return projects.filter((p) => p.category === category);
  };

  const getFeaturedProjects = () => {
    return [...projects].sort((a, b) => b.raised - a.raised).slice(0, 3);
  };

  const value = {
    projects,
    addProject,
    updateProject,
    upvoteProject,
    downvoteProject,
    getProjectBySlug,
    getProjectsByCategory,
    getFeaturedProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
