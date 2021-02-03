const express = require('express');
const merkleRoutes = require('./merkle.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/merkle', merkleRoutes);

module.exports = router;
