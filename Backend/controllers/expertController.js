const Idea = require('../models/Idea');
const Expert = require('../models/Expert');
const User = require('../models/User');

// Get all ideas for expert review
exports.getAllIdeasForReview = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate('user', 'name email')
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    return res.json({ ideas });
  } catch (err) {
    console.error('expert getAllIdeasForReview', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get expert profile
exports.getExpertProfile = async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id })
      .populate('user', 'name email');
    
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    
    return res.json({ expert });
  } catch (err) {
    console.error('expert getExpertProfile', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create or update expert profile
exports.createOrUpdateExpertProfile = async (req, res) => {
  try {
    const { 
      specialization, 
      experience, 
      bio, 
      expertise,
      profession,
      company,
      github,
      linkedin,
      website,
      location,
      education,
      certifications,
      languages,
      previousCompanies,
      achievements
    } = req.body;
    
    const expertData = {
      user: req.user._id,
      specialization,
      experience,
      bio,
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      profession,
      company: company || '',
      github: github || '',
      linkedin: linkedin || '',
      website: website || '',
      location: location || '',
      education: education || '',
      certifications: Array.isArray(certifications) ? certifications : [],
      languages: Array.isArray(languages) ? languages : [],
      previousCompanies: Array.isArray(previousCompanies) ? previousCompanies : [],
      achievements: Array.isArray(achievements) ? achievements : []
    };
    
    const expert = await Expert.findOneAndUpdate(
      { user: req.user._id },
      expertData,
      { upsert: true, new: true, runValidators: true }
    ).populate('user', 'name email');
    
    return res.json({ expert });
  } catch (err) {
    console.error('expert createOrUpdateExpertProfile', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Submit expert review for an idea
exports.submitExpertReview = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { rating, review, feedback } = req.body;
    
    // Check if expert profile exists
    const expert = await Expert.findOne({ user: req.user._id });
    if (!expert) {
      return res.status(400).json({ message: 'Expert profile not found' });
    }
    
    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    // Check if expert already reviewed this idea
    const existingReview = idea.expertReviews.find(
      review => review.expert.toString() === expert._id.toString()
    );
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.review = review;
      existingReview.feedback = feedback || existingReview.feedback;
      existingReview.createdAt = new Date();
    } else {
      // Add new review
      idea.expertReviews.push({
        expert: expert._id,
        rating,
        review,
        feedback: feedback || '',
        createdAt: new Date()
      });
    }
    
    // Calculate average rating
    const totalRating = idea.expertReviews.reduce((sum, review) => sum + review.rating, 0);
    idea.averageExpertRating = totalRating / idea.expertReviews.length;
    idea.totalExpertReviews = idea.expertReviews.length;
    
    await idea.save();
    
    // Update expert's total reviews count
    expert.totalReviews = await Idea.countDocuments({
      'expertReviews.expert': expert._id
    });
    await expert.save();
    
    const updatedIdea = await Idea.findById(ideaId)
      .populate('user', 'name email')
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    return res.json({ idea: updatedIdea });
  } catch (err) {
    console.error('expert submitExpertReview', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get ideas reviewed by expert
exports.getMyReviews = async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id });
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    
    const ideas = await Idea.find({
      'expertReviews.expert': expert._id
    })
      .populate('user', 'name email')
      .populate({
        path: 'expertReviews.expert',
        select: 'specialization expertise profession isVerified',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ 'expertReviews.createdAt': -1 });
    
    return res.json({ ideas });
  } catch (err) {
    console.error('expert getMyReviews', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all experts (for admin)
exports.getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ isVerified: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    return res.json({ experts });
  } catch (err) {
    console.error('expert getAllExperts', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get expert verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const expert = await Expert.findOne({ user: req.user._id });
    
    if (!expert) {
      return res.status(404).json({ message: 'Expert profile not found' });
    }
    
    return res.json({ 
      isVerified: expert.isVerified,
      verificationNotes: expert.verificationNotes,
      createdAt: expert.createdAt,
      updatedAt: expert.updatedAt
    });
  } catch (err) {
    console.error('expert getVerificationStatus', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get pending experts for admin review
exports.getPendingExperts = async (req, res) => {
  try {
    const experts = await Expert.find({ isVerified: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    return res.json({ experts });
  } catch (err) {
    console.error('expert getPendingExperts', err);
    return res.status(500).json({ message: 'Server error' });
  }
};