//https://eth-goerli.g.alchemy.com/v2/aHH-WZaED3cDgiOjQGArYAcU0Ibf8wGS
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "goerli",
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/aHH-WZaED3cDgiOjQGArYAcU0Ibf8wGS",
      accounts: [
        "778b5aecf05ec005146d4db0442016d8c6df8e8851360739b0cf46d8410646e0",
      ],
    },
  },
};
