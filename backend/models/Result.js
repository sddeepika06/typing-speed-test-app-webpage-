const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  time: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  score: { type: Number, required: true }, // (WPM * 0.7) + (Accuracy * 0.3)
  createdAt: { type: Date, default: Date.now }
});

// Auto-calculate score before saving
resultSchema.pre('save', function (next) {
  this.score = parseFloat(((this.wpm * 0.7) + (this.accuracy * 0.3)).toFixed(2));
  next();
});

module.exports = mongoose.model('Result', resultSchema);
