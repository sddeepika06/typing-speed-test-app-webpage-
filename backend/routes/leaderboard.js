const express = require('express');
const Result = require('../models/Result');
const User = require('../models/User');
const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    // Get best score per user
    const leaderboard = await Result.aggregate([
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          bestWpm: { $max: '$wpm' },
          bestAccuracy: { $max: '$accuracy' },
          totalTests: { $sum: 1 }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          bestScore: 1,
          bestWpm: 1,
          bestAccuracy: 1,
          totalTests: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
