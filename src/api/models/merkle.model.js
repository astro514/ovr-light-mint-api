const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const { Schema } = mongoose;

/**
 * Merkle Schema
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
   * Get Merkle
   * @param {ObjectId} id - The objectId of merkle.
   * @returns {Promise<Merkle, APIError>}
   */
  async get(id) {
    try {
      let merkle;

      if (mongoose.Types.ObjectId.isValid(id)) {
        merkle = await this.findById(id).exec();
      }
      if (merkle) {
        return merkle;
      }

      throw new APIError({
        message: 'Merkle does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * Get Merkle
   * @param {String} walletAddress - The walletAddress of merkle.
   * @returns {Promise<Merkle, APIError>}
   */
  async getByAddress(walletAddress) {
    try {
      const merkle = await this.findOne({ walletAddress }).exec();
      if (merkle) {
        return merkle;
      }

      throw new APIError({
        message: 'Merkle does not exist',
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
module.exports = mongoose.model('Merkle', rewardSchema);
