// Mock Freelancer Profile Data
export const mockFreelancer = {
  id: "freelancer_1",
  name: "Alex Johnson",
  title: "Full-Stack Developer & UI/UX Designer",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  coverImage:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop",
  bio: "Passionate full-stack developer with 5+ years of experience creating beautiful, functional web applications. Specializing in React, Node.js, and modern web technologies.",
  location: "San Francisco, CA",
  memberSince: "2022-03-15",
  languages: ["English (Native)", "Spanish (Conversational)"],
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Git",
    "Figma",
    "Adobe XD",
    "UI/UX Design",
  ],
  rating: 4.8,
  reviews: 127,
  completedProjects: 89,
  responseTime: "2 hours",
  level: "Expert",
  hourlyRate: 75,
  portfolio: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative project management tool",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      technologies: ["React", "Firebase", "Material-UI"],
      link: "#",
    },
    {
      id: 3,
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for business analytics",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      technologies: ["React", "D3.js", "Python", "Flask"],
      link: "#",
    },
  ],
  reviews: [
    {
      id: 1,
      client: "Sarah Chen",
      rating: 5,
      comment:
        "Alex delivered exceptional work on our web application. The code quality was outstanding and he was very responsive throughout the project.",
      date: "2024-01-15",
      project: "E-commerce Platform",
    },
    {
      id: 2,
      client: "Mike Rodriguez",
      rating: 5,
      comment:
        "Great communication and technical skills. Would definitely work with Alex again.",
      date: "2024-01-08",
      project: "Mobile App Backend",
    },
    {
      id: 3,
      client: "Jennifer Liu",
      rating: 4,
      comment:
        "Very professional and delivered on time. Minor adjustments needed but overall great experience.",
      date: "2023-12-20",
      project: "API Development",
    },
  ],
  stats: {
    onTimeDelivery: 98,
    onBudget: 95,
    repeatClients: 45,
  },
};
