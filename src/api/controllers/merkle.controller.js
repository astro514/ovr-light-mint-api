const httpStatus = require('http-status');
const axios = require('axios');
const Merkle = require('../models/merkle.model');
const BalanceTree = require('../merkle/balance-tree');
const { apiUrl, apiKey } = require('../../config/vars');
const { where } = require('../models/merkle.model');

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

exports.getByAddress = async (req, res, next) => {
  try {
    const { address } = req.query;
    const regex = new RegExp(['^', address, '$'].join(''), 'i');

    const tokens = await Merkle.find({ owner: regex });

    res.status(httpStatus.OK).json(tokens.map((token) => token.transform()));
  } catch (error) {
    next(error);
  }
};

exports.getByTokenId = async (req, res, next) => {
  try {
    const { id } = req.query;

    const token = await Merkle.findOne({ tokenId: id });

    if (token) {
      res.status(httpStatus.OK).json(token.transform());
    } else {
      res.status(httpStatus.OK).json({});
    }
  } catch (error) {
    next(error);
  }
};
