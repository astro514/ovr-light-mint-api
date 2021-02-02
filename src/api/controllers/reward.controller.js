const httpStatus = require('http-status');
const axios = require('axios');
const Reward = require('../models/reward.model');
const BalanceTree = require('../merkle/balance-tree');
const { apiUr, apiKey } = require('../../config/vars');

exports.generateMerkleMap = async (req, res, next) => {
  try {
    const source = await axios.get(apiUr, {
      'x-api-key': apiKey,
    });
    const lands = source.data.lands;

    const tree = new BalanceTree(
      lands.map((land) => ({
        account: land.owner,
        tokenId: land.nft_id.toString(),
        tokenUri: land.info_uri,
      })),
    );

    const claims = lands.reduce((memo, land, index) => {
      return [
        ...memo,
        {
          index,
          owner: land.owner,
          tokenId: land.nft_id.toString(),
          tokenUri: land.info_uri,
          proof: tree.getProof(
            index,
            land.owner,
            land.nft_id.toString(),
            land.info_uri,
          ),
        },
      ];
    }, []);

    const merkleRoot = tree.getHexRoot();

    await Reward.deleteMany({}).exec();
    await Reward.insertMany(claims);

    res.status(httpStatus.OK).json({
      merkleRoot,
      total: claims.length,
    });
  } catch (error) {
    next(error);
  }
};

// exports.getReward = async (req, res, next) => {
//   try {
//     const { walletAddress } = req.query;
//     const reward = await Reward.getByAddress(walletAddress);

//     res.status(httpStatus.OK).json(reward.transform());
//   } catch (error) {
//     next(error);
//   }
// };
