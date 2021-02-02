const Joi = require('joi');

module.exports = {
  getReward: {
    params: {
      walletAddress: Joi.string.required(),
    },
  },
};
