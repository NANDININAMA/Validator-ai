const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // years of experience
  bio: { type: String, required: true },
  expertise: { type: [String], required: true }, // array of expertise areas
  profession: { type: String, required: true }, // e.g., "Software Engineer", "Product Manager"
  company: { type: String, default: '' }, // Current company
  linkedin: { type: String, required: true }, // LinkedIn profile URL for verification
  github: { type: String, default: '' }, // GitHub profile URL
  website: { type: String, default: '' }, // Personal website
  location: { type: String, default: '' }, // City, Country
  education: { type: String, default: '' }, // Educational background
  certifications: { type: [String], default: [] }, // Professional certifications
  languages: { type: [String], default: [] }, // Programming languages
  previousCompanies: { type: [String], default: [] }, // Previous work experience
  achievements: { type: [String], default: [] }, // Notable achievements
  rating: { type: Number, default: 0 }, // average rating from users
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }, // Admin verification status
  verificationNotes: { type: String, default: '' }, // Admin notes for verification
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

expertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Expert', expertSchema);
