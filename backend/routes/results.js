const express = require('express');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// POST /api/results
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { wpm, accuracy, time, difficulty } = req.body;
    const result = new Result({
      userId: req.user.id,
      wpm,
      accuracy,
      time,
      difficulty,
      score: 0 // pre-save hook will calculate it
    });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/results/:userId
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
