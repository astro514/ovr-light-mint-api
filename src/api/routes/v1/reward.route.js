const express = require('express');
const controller = require('../../controllers/reward.controller');

const router = express.Router();

router.route('/generate-merkle').post(controller.generateMerkleMap);

// router.route('/').get(controller.getReward);

module.exports = router;
