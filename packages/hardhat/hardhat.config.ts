import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    artifacts: "../frontend/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    mumbai: {
      url: process.env.MUMBAI_ALCHEMY_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 80001,
    },
  },
  typechain: {
    outDir: "../frontend/types/typechain",
    target: "ethers-v5",
  },
};

export default config;
