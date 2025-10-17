const Idea = require('../models/Idea');
const User = require('../models/User');
const Expert = require('../models/Expert');

exports.getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate('user', 'name email')
      .populate('expertReviews.expert', 'specialization expertise profession')
      .populate('expertReviews.expert.user', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ ideas });
  } catch (err) {
    console.error('admin getAllIdeas', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    idea.feedback = feedback || idea.feedback;
    await idea.save();
    return res.json({ idea });
  } catch (err) {
    console.error('admin addFeedback', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    console.error('admin getAllUsers', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin', 'expert'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.role = role;
    await user.save();
    
    return res.json({ user });
  } catch (err) {
    console.error('admin updateUserRole', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has ideas or expert profile
    const userIdeas = await Idea.find({ user: id });
    const userExpert = await Expert.findOne({ user: id });
    
    if (userIdeas.length > 0 || userExpert) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing ideas or expert profile' 
      });
    }
    
    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('admin deleteUser', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Idea Management
exports.deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    return res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    console.error('admin deleteIdea', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const idea = await Idea.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    return res.json({ idea });
  } catch (err) {
    console.error('admin updateIdea', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// System Statistics
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalIdeas = await Idea.countDocuments();
    const totalExperts = await Expert.countDocuments();
    const activeExperts = await Expert.countDocuments({ isActive: true });
    
    // Ideas by classification
    const ideasByClassification = await Idea.aggregate([
      { $group: { _id: '$classification', count: { $sum: 1 } } }
    ]);
    
    // Ideas by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const ideasByMonth = await Idea.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { 
        _id: { 
          year: { $year: '$createdAt' }, 
          month: { $month: '$createdAt' } 
        }, 
        count: { $sum: 1 } 
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Average scores
    const avgScore = await Idea.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    
    return res.json({
      totalUsers,
      totalIdeas,
      totalExperts,
      activeExperts,
      ideasByClassification,
      ideasByMonth,
      averageScore: avgScore[0]?.avgScore || 0
    });
  } catch (err) {
    console.error('admin getSystemStats', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Expert verification
exports.verifyExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, verificationNotes } = req.body;
    
    const expert = await Expert.findById(id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    
    expert.isVerified = isVerified;
    expert.verificationNotes = verificationNotes || '';
    await expert.save();
    
    return res.json({ expert });
  } catch (err) {
    console.error('admin verifyExpert', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleExpertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const expert = await Expert.findById(id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    
    expert.isActive = isActive;
    await expert.save();
    
    return res.json({ expert });
  } catch (err) {
    console.error('admin toggleExpertStatus', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Bulk operations
exports.bulkDeleteIdeas = async (req, res) => {
  try {
    const { ideaIds } = req.body;
    
    if (!ideaIds || !Array.isArray(ideaIds) || ideaIds.length === 0) {
      return res.status(400).json({ message: 'Invalid idea IDs provided' });
    }
    
    const result = await Idea.deleteMany({ _id: { $in: ideaIds } });
    return res.json({ 
      message: `${result.deletedCount} ideas deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('admin bulkDeleteIdeas', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.bulkUpdateUserRoles = async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid updates provided' });
    }
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.userId },
        update: { role: update.role }
      }
    }));
    
    const result = await User.bulkWrite(bulkOps);
    return res.json({ 
      message: `${result.modifiedCount} user roles updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('admin bulkUpdateUserRoles', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// System monitoring
exports.getSystemHealth = async (req, res) => {
  try {
    const dbStatus = await User.findOne().then(() => 'connected').catch(() => 'disconnected');
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return res.json({
      status: 'healthy',
      database: dbStatus,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      uptime: Math.round(uptime)
    });
  } catch (err) {
    console.error('admin getSystemHealth', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentIdeas = await Idea.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title problem user createdAt');
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
    
    return res.json({
      recentIdeas,
      recentUsers,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('admin getRecentActivity', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
