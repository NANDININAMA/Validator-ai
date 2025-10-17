const Idea = require('../models/Idea');
const { computeScoreAndClass } = require('../utils/scoring');

// Create idea
exports.createIdea = async (req, res) => {
  try {
    const { problem, solution, market, revenueModel, team } = req.body;
    
    if (!problem || !solution || !market || !revenueModel || !team) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate score and classification
    const { score, classification, suggestions, breakdown } = computeScoreAndClass({
      problem, solution, market, revenueModel, team
    });

    const newIdea = new Idea({
      user: req.user.id,
      problem,
      solution,
      market,
      revenueModel,
      team,
      score,
      classification,
      suggestions,
      breakdown
    });

    const savedIdea = await newIdea.save();
    res.status(201).json({ message: 'Idea created', idea: savedIdea });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create idea' });
  }
};

// Get all ideas for logged-in user
exports.getUserIdeas = async (req, res) => {
  try {
    const userIdeas = await Idea.find({ user: req.user.id })
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    res.json(userIdeas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};

// Get idea by ID
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id })
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    res.json(idea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
};

// Update idea
exports.updateIdea = async (req, res) => {
  try {
    const { problem, solution, market, revenueModel, team, title } = req.body;
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    idea.title = title ?? idea.title;
    idea.problem = problem ?? idea.problem;
    idea.solution = solution ?? idea.solution;
    idea.market = market ?? idea.market;
    idea.revenueModel = revenueModel ?? idea.revenueModel;
    idea.team = team ?? idea.team;

    // Recompute score/classification if core fields changed
    const { score, classification, suggestions } = computeScoreAndClass({
      problem: idea.problem,
      solution: idea.solution,
      market: idea.market,
      revenueModel: idea.revenueModel,
      team: idea.team
    });
    idea.score = score;
    idea.classification = classification;
    const recompute = computeScoreAndClass({
      problem: idea.problem,
      solution: idea.solution,
      market: idea.market,
      revenueModel: idea.revenueModel,
      team: idea.team
    });
    idea.score = recompute.score;
    idea.classification = recompute.classification;
    idea.suggestions = recompute.suggestions;
    idea.breakdown = recompute.breakdown;

    const saved = await idea.save();
    return res.json({ message: 'Idea updated', idea: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update idea' });
  }
};

// Delete idea
exports.deleteIdea = async (req, res) => {
  try {
    const deleted = await Idea.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Idea not found' });
    return res.json({ message: 'Idea deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
};

// Export idea to PDF
exports.exportIdeaPdf = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id }).populate('user', 'name email');
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const { generatePdfBuffer } = require('../utils/pdfGenerator');
    const pdfBuffer = await generatePdfBuffer(idea);

    res.setHeader('Content-Type', 'application/pdf');
    const safeTitle = (idea.title || idea.problem?.slice(0, 40) || 'idea').replace(/[^a-z0-9\-\_]+/gi, '-');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}-${idea._id}.pdf"`);
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export idea' });
  }
};
