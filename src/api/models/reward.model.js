const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const { Schema } = mongoose;

/**
 * Reward Schema
 * @private
 */
const rewardSchema = Schema(
  {
    index: {
      type: Number,
      require: true,
    },
    owner: {
      type: String,
      require: true,
    },
    tokenId: {
      type: String,
      require: true,
    },
    tokenUri: {
      type: String,
      require: true,
    },
    proof: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
rewardSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'index',
      'owner',
      'tokenId',
      'tokenUri',
      'proof',
      'createdAt',
      'updatedAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
rewardSchema.statics = {
  /**
   * Get Reward
   * @param {ObjectId} id - The objectId of reward.
   * @returns {Promise<Reward, APIError>}
   */
  async get(id) {
    try {
      let reward;

      if (mongoose.Types.ObjectId.isValid(id)) {
        reward = await this.findById(id).exec();
      }
      if (reward) {
        return reward;
      }

      throw new APIError({
        message: 'Reward does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * Get Reward
   * @param {String} walletAddress - The walletAddress of reward.
   * @returns {Promise<Reward, APIError>}
   */
  async getByAddress(walletAddress) {
    try {
      const reward = await this.findOne({ walletAddress }).exec();
      if (reward) {
        return reward;
      }

      throw new APIError({
        message: 'Reward does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
};

/**
 * @typedef rewardSchema
 */
module.exports = mongoose.model('Reward', rewardSchema);
