const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = user;
    next();
  } catch (err) {
    console.error('auth error', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

const expertOnly = (req, res, next) => {
  if (req.user && req.user.role === 'expert') return next();
  return res.status(403).json({ message: 'Expert access required' });
};

const adminOrExpert = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'expert')) return next();
  return res.status(403).json({ message: 'Admin or Expert access required' });
};

const verifiedExpertOnly = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'expert') {
      return res.status(403).json({ message: 'Expert access required' });
    }
    
    const Expert = require('../models/Expert');
    const expert = await Expert.findOne({ user: req.user._id });
    
    if (!expert) {
      return res.status(403).json({ message: 'Expert profile not found. Please complete your profile setup.' });
    }
    
    if (!expert.isActive) {
      return res.status(403).json({ message: 'Your expert account is inactive. Please contact support.' });
    }
    if (!expert.isVerified) {
      return res.status(403).json({ message: 'Your expert account is pending verification.' });
    }
    
    req.expert = expert;
    next();
  } catch (err) {
    console.error('verifiedExpertOnly error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminOnly, expertOnly, adminOrExpert, verifiedExpertOnly };
