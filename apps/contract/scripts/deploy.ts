import { ethers } from "hardhat";
import { promises as fs } from "fs";
import { Contract } from "ethers";

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(100);

  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    token.address,
    "0xa853c7e388900046392b7C11Af1836FE09699180"
  );

  await token.deployed();
  await staking.deployed();
  await deploymentInfo(token, "token.json");
  await deploymentInfo(staking, "staking.json");
}

async function deploymentInfo(contract: Contract, fileName: string) {
  const data = {
    contract: {
      address: contract.address,
      abi: contract.interface.format(),
      // @ts-ignore
      signerAddress: contract.signer.address,
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(fileName, content);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
