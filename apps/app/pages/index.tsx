import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const collectionAddress = "0xa853c7e388900046392b7C11Af1836FE09699180";
  const stakingAddress = "0x9653cB32056Fa2F52123879A686f32838fdDFCd8";

  const { contract } = useContract(collectionAddress);
  const { contract: stakingContract } = useContract(stakingAddress);

  const { data: getStakedNfts } = useContractRead(
    stakingContract,
    "getStakedNfts",
    [address]
  );
  const { mutateAsync: stake } = useContractWrite(stakingContract, "stake");
  const { mutateAsync: calculateReward, data: calculatedReward } =
    useContractWrite(stakingContract, "calculateReward");

  const { data: avaiableReward } = useContractRead(
    stakingContract,
    "availableRewards"
  );
  console.log("avaiableReward", avaiableReward);
  useEffect(() => {
    if (!address || !calculateReward) return;
  }, [address]);

  const handleStakeFn = async () => {
    if (!address) return;

    const isApproved = await contract?.erc721.isApproved(
      address,
      stakingAddress
    );

    if (!isApproved) {
      await contract?.erc721.setApprovalForAll(stakingAddress, true);
    }
    const id: BigNumber = BigNumber.from(18);
    await stake({ args: [id] });
  };
  if (!calculatedReward) return null;
  return (
    <>
      <ConnectWallet />

      <h1>
        claimableRewards : {BigNumber.from(calculatedReward?._hex).toString()}
      </h1>

      {getStakedNfts && (
        <div>
          <h1>Staked NFTs</h1>
          {getStakedNfts.map((nft: any) => (
            <div key={nft.tokenId._hex}>
              <p>{BigNumber.from(nft.tokenId._hex).toString()}</p>
            </div>
          ))}
        </div>
      )}

      <button className="bg-red-300 px-5 py-2" onClick={() => handleStakeFn()}>
        Stake
      </button>
    </>
  );
};

export default Home;
