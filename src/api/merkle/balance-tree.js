const MerkleTree = require('./merkle-tree');
const { utils } = require('ethers');

module.exports = class BalanceTree {
  // private readonly tree: MerkleTree

  constructor(balances) {
    this.tree = new MerkleTree(
      balances.map(({ account, tokenId, tokenUri }, index) => {
        return BalanceTree.toNode(index, account, tokenId, tokenUri);
      }),
    );
  }

  static verifyProof(index, account, tokenId, tokenUri, proof, root) {
    let pair = BalanceTree.toNode(index, account, tokenId, tokenUri);
    // eslint-disable-next-line no-restricted-syntax
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  static toNode(index, account, tokenId, tokenUri) {
    return Buffer.from(
      utils
        .solidityKeccak256(
          ['uint256', 'address', 'uint256', 'string'],
          [index, account, tokenId, tokenUri],
        )
        .substr(2),
      'hex',
    );
  }

  getHexRoot() {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  getProof(index, account, tokenId, tokenUri) {
    return this.tree.getHexProof(
      BalanceTree.toNode(index, account, tokenId, tokenUri),
    );
  }
};
