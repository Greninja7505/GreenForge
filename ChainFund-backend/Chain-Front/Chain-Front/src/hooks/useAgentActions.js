/**
 * useAgentActions Hook
 * Executes AI agent actions like form filling, navigation, text enhancement
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import toast from 'react-hot-toast';

// Action types the AI can execute
export const ACTION_TYPES = {
  FILL_FORM: 'FILL_FORM',
  NAVIGATE: 'NAVIGATE',
  ENHANCE_TEXT: 'ENHANCE_TEXT',
  SEARCH_PROJECTS: 'SEARCH_PROJECTS',
  CONNECT_WALLET: 'CONNECT_WALLET',
  START_DONATION: 'START_DONATION',
  SUGGEST_MILESTONES: 'SUGGEST_MILESTONES',
  SHOW_PROJECT: 'SHOW_PROJECT',
};

// Page routes mapping - must match App.jsx routes exactly
const PAGE_ROUTES = {
  // Main pages
  'home': '/',
  'dashboard': '/dashboard',
  'profile': '/profile',
  
  // Projects
  'projects': '/projects/all',
  'all projects': '/projects/all',
  'browse projects': '/projects/all',
  'create project': '/create-project',
  'create-project': '/create-project',
  'create': '/create-project',
  'new project': '/create-project',
  
  // Causes
  'causes': '/causes/all',
  'all causes': '/causes/all',
  
  // Governance & Economy
  'governance': '/governance',
  'dao': '/governance',
  'voting': '/governance',
  'giveconomy': '/giveconomy',
  'economy': '/giveconomy',
  'givfarm': '/givfarm',
  'farm': '/givfarm',
  
  // Community
  'join': '/join',
  'community': '/join',
  
  // Auth & Onboarding
  'signin': '/signin',
  'sign in': '/signin',
  'login': '/signin',
  'signup': '/signup',
  'sign up': '/signup',
  'register': '/signup',
  'onboarding': '/onboarding',
  
  // About
  'about': '/about',
  
  // Freelancer pages
  'freelancer': '/freelancer/dashboard',
  'freelancer dashboard': '/freelancer/dashboard',
  'freelancer profile': '/freelancer/profile',
  'gigs': '/freelancer/gigs',
  'freelancer gigs': '/freelancer/gigs',
  'my gigs': '/freelancer/gigs',
  'orders': '/freelancer/orders',
  'freelancer orders': '/freelancer/orders',
  'my orders': '/freelancer/orders',
  'earnings': '/freelancer/earnings',
  'my earnings': '/freelancer/earnings',
  'create gig': '/freelancer/create-gig',
  'new gig': '/freelancer/create-gig',
};

/**
 * Custom hook for executing agent actions
 */
export const useAgentActions = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();

  // Navigate to a page with smart matching
  const navigateTo = useCallback((page) => {
    if (!page) {
      return { success: false, message: 'No page specified' };
    }

    const normalizedPage = page.toLowerCase().trim();
    
    // Direct match first
    let route = PAGE_ROUTES[normalizedPage];
    
    // If no direct match, try partial matching
    if (!route) {
      const routeKeys = Object.keys(PAGE_ROUTES);
      const matchedKey = routeKeys.find(key => 
        key.includes(normalizedPage) || normalizedPage.includes(key)
      );
      route = matchedKey ? PAGE_ROUTES[matchedKey] : null;
    }
    
    // If still no match, check if it's already a valid path
    if (!route && page.startsWith('/')) {
      route = page;
    }

    if (route) {
      navigate(route);
      toast.success(`Navigating to ${page}`, {
        icon: '🚀',
        duration: 2000,
      });
      return { success: true, message: `Navigated to ${page}` };
    }
    
    toast.error(`Unknown page: ${page}`);
    return { success: false, message: `Unknown page: ${page}. Try: projects, governance, create project, freelancer, or dashboard.` };
  }, [navigate]);

  // Search and filter projects
  const searchProjects = useCallback((query, filters = {}) => {
    const results = projects.filter(p => {
      const matchesQuery = !query || 
        p.title?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters.category || 
        p.category?.toLowerCase() === filters.category.toLowerCase();
      
      const matchesGoal = !filters.maxGoal || 
        (p.goal && p.goal <= filters.maxGoal);

      return matchesQuery && matchesCategory && matchesGoal;
    });

    return {
      success: true,
      results: results.slice(0, 5),
      total: results.length,
      message: `Found ${results.length} projects`
    };
  }, [projects]);

  // Get project by slug or ID
  const getProject = useCallback((identifier) => {
    const project = projects.find(p => 
      p.slug === identifier || 
      p.id === identifier ||
      p.title?.toLowerCase().includes(identifier.toLowerCase())
    );
    return project || null;
  }, [projects]);

  // Execute an action from AI response
  const executeAction = useCallback(async (action) => {
    if (!action || !action.type) {
      return { success: false, message: 'Invalid action' };
    }

    const { type, params } = action;

    switch (type) {
      case ACTION_TYPES.NAVIGATE:
        return navigateTo(params?.page);

      case ACTION_TYPES.SEARCH_PROJECTS:
        return searchProjects(params?.query, params?.filters);

      case ACTION_TYPES.SHOW_PROJECT:
        const project = getProject(params?.projectId || params?.query);
        if (project) {
          navigate(`/projects/${project.slug}`);
          return { success: true, message: `Opening ${project.title}` };
        }
        return { success: false, message: 'Project not found' };

      case ACTION_TYPES.FILL_FORM:
        // Return data for form filling - actual filling done by component
        return {
          success: true,
          formData: params?.data,
          formType: params?.formType,
          message: 'Form data ready'
        };

      case ACTION_TYPES.ENHANCE_TEXT:
        // Return enhanced text - actual update done by component
        return {
          success: true,
          field: params?.field,
          originalText: params?.text,
          message: 'Text enhancement ready'
        };

      case ACTION_TYPES.SUGGEST_MILESTONES:
        return {
          success: true,
          milestones: params?.milestones,
          message: 'Milestones suggested'
        };

      case ACTION_TYPES.CONNECT_WALLET:
        // Trigger wallet connection event
        window.dispatchEvent(new CustomEvent('connect-wallet', {
          detail: { type: params?.walletType || 'freighter' }
        }));
        return { success: true, message: 'Wallet connection initiated' };

      case ACTION_TYPES.START_DONATION:
        if (params?.projectSlug) {
          navigate(`/donate/${params.projectSlug}`);
          return { success: true, message: 'Opening donation page' };
        }
        return { success: false, message: 'Project not specified' };

      default:
        return { success: false, message: `Unknown action: ${type}` };
    }
  }, [navigateTo, searchProjects, getProject, navigate]);

  return {
    executeAction,
    navigateTo,
    searchProjects,
    getProject,
    ACTION_TYPES,
  };
};

export default useAgentActions;
