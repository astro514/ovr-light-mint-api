const httpStatus = require('http-status');
const axios = require('axios');
const Merkle = require('../models/merkle.model');
const BalanceTree = require('../merkle/balance-tree');
const { apiUrl, apiKey } = require('../../config/vars');

exports.generateMerkleMap = async (req, res, next) => {
  try {
    const source = await axios.get(apiUrl, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    const lands = source.data.lands;

    // console.log(source);

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

    await Merkle.deleteMany({}).exec();
    await Merkle.insertMany(claims);

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
//     const merkle = await Merkle.getByAddress(walletAddress);

//     res.status(httpStatus.OK).json(merkle.transform());
//   } catch (error) {
//     next(error);
//   }
// };
