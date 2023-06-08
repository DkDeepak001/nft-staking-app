import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Staking", () => {
  let totalSupply = 1000;
  let token: Contract;
  let staking: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);

    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(
      token.address,
      "0xa853c7e388900046392b7C11Af1836FE09699180"
    );

    await token.deployed();
    await staking.deployed();
  });

  describe("Deployment", () => {
    it("should assign total supply to the contract", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token?.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Stake", () => {
    it("should allow staking", async () => {
      await token.approve(staking.address, 100);
      const res = await staking.stake(1);
      console.log(res);
    });
  });

  describe("Reward", () => {
    it("should get available reward", async () => {
      const reward = await staking.availableRewards();
      console.log(reward);
      expect(reward).to.equal(0);
    });
  });
});
