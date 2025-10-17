const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: false },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  market: { type: String, required: true },
  revenueModel: { type: String, required: true },
  team: { type: String, required: true },
  score: { type: Number, default: 0 },
  classification: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
  feedback: { type: String, default: '' },
  suggestions: { type: [String], default: [] },
  expertReviews: [{
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    feedback: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  averageExpertRating: { type: Number, default: 0 },
  totalExpertReviews: { type: Number, default: 0 },
  breakdown: {
    type: new mongoose.Schema({
      problem: { type: Number, default: 0 },
      solution: { type: Number, default: 0 },
      market: { type: Number, default: 0 },
      revenueModel: { type: Number, default: 0 },
      team: { type: Number, default: 0 }
    }, { _id: false }),
    default: undefined
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
