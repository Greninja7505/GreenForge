import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      sort = "trending",
      page = 1,
      limit = 12,
    } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = {};
    switch (sort) {
      case "trending":
        sortOption = { donors: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "mostRaised":
        sortOption = { raised: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const projects = await Project.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by slug
router.get("/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      goal,
      stellarAddress,
      location,
      website,
      social,
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project = new Project({
      title,
      slug,
      description,
      category,
      goal,
      creator: {
        stellarAddress,
      },
      location,
      website,
      social,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add project update
router.post("/:id/updates", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.updates.push({ title, content, author });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project statistics
router.get("/:id/stats", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const stats = {
      raised: project.raised,
      goal: project.goal,
      percentage: (project.raised / project.goal) * 100,
      donors: project.donors,
      updatesCount: project.updates.length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
