import express from "express";
import Donation from "../models/Donation.js";
import Project from "../models/Project.js";

const router = express.Router();

// Get all donations
router.get("/", async (req, res) => {
  try {
    const { project, donor, page = 1, limit = 20 } = req.query;

    let query = {};

    if (project) {
      query.project = project;
    }

    if (donor) {
      query["donor.stellarAddress"] = donor;
    }

    const donations = await Donation.find(query)
      .populate("project", "title slug")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Donation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get donation by transaction hash
router.get("/transaction/:hash", async (req, res) => {
  try {
    const donation = await Donation.findOne({
      transactionHash: req.params.hash,
    }).populate("project");

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new donation
router.post("/", async (req, res) => {
  try {
    const {
      projectId,
      stellarAddress,
      amount,
      asset,
      transactionHash,
      memo,
      anonymous,
      platformFee,
    } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const donation = new Donation({
      project: projectId,
      donor: {
        stellarAddress,
        anonymous: anonymous || false,
      },
      amount,
      asset: asset || "XLM",
      transactionHash,
      memo,
      platformFee: platformFee || 0,
      status: "confirmed",
    });

    await donation.save();

    // Update project statistics
    project.raised += amount;
    project.donors += 1;
    await project.save();

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get donation statistics for a project
router.get("/stats/:projectId", async (req, res) => {
  try {
    const donations = await Donation.find({ project: req.params.projectId });

    const stats = {
      totalDonations: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
      averageDonation:
        donations.length > 0
          ? donations.reduce((sum, d) => sum + d.amount, 0) / donations.length
          : 0,
      assetBreakdown: {},
    };

    // Group by asset
    donations.forEach((d) => {
      if (!stats.assetBreakdown[d.asset]) {
        stats.assetBreakdown[d.asset] = 0;
      }
      stats.assetBreakdown[d.asset] += d.amount;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top donors for a project
router.get("/top-donors/:projectId", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topDonors = await Donation.aggregate([
      {
        $match: {
          project: mongoose.Types.ObjectId(req.params.projectId),
          "donor.anonymous": false,
        },
      },
      {
        $group: {
          _id: "$donor.stellarAddress",
          totalDonated: { $sum: "$amount" },
          donationCount: { $sum: 1 },
        },
      },
      { $sort: { totalDonated: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json(topDonors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
