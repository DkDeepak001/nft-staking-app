import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { BigNumber } from "ethers";
import { collectionAddress, stakingAddress } from "../const/address";
import Header from "../components/header";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract } = useContract(collectionAddress);
  const { contract: stakingContract } = useContract(stakingAddress);

  const { data: getStakedNfts } = useContractRead(
    stakingContract,
    "getStakedNfts",
    [address]
  );
  const { mutateAsync: stake } = useContractWrite(stakingContract, "stake");

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

  return (
    <div className="bg-black h-screen">
      <Header />

      {getStakedNfts && (
        <div>
          <h1 className="text-white">Staked NFTs</h1>
          {getStakedNfts.map((nft: any) => (
            <div key={nft.tokenId._hex}>
              <p className="text-white">
                {BigNumber.from(nft.tokenId._hex).toString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        className="px-5 py-2 bg-slate-500
        "
        onClick={() => handleStakeFn()}
      >
        Stake
      </button>
    </div>
  );
};

export default Home;
