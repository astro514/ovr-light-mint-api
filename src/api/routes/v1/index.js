const express = require('express');
const rewardRoutes = require('./reward.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/reward', rewardRoutes);

module.exports = router;
