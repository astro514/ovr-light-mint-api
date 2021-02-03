const express = require('express');
const controller = require('../../controllers/merkle.controller');

const router = express.Router();

router.route('/generate-merkle').post(controller.generateMerkleMap);
router.route('/tokens-by-address').get(controller.getByAddress);
router.route('/token').get(controller.getByTokenId);

module.exports = router;
