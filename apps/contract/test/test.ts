import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Token", () => {
  let totalSupply = 1000;
  let token: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);
  });

  describe("Deployment", () => {
    it("should assign total supply to the contract", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token?.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transfer", () => {
    it("Should allow transfer of tokens", async function () {
      // Transfer tokens from owner to addr1
      await token.transfer(addr1.address, 100);

      // Check updated balances
      expect(await token.balanceOf(owner.address)).to.equal(900);
      expect(await token.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should not allow transfer of tokens exceeding balance", async function () {
      // Attempt to transfer more tokens than the owner's balance
      await expect(token.transfer(addr1.address, 1001)).to.be.reverted;

      // Check that the balances remain unchanged
      expect(await token.balanceOf(owner.address)).to.equal(1000);
      expect(await token.balanceOf(addr1.address)).to.equal(0);
    });
  });
});
