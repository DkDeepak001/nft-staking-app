import {
  MediaRenderer,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { BigNumber } from "ethers";

import { collectionAddress, stakingAddress } from "../const/address";
import Header from "../components/header";
import { Stake } from "../components/stake";
import { Suspense, useState } from "react";
import Image from "next/image";
import CardSkeleton from "../components/cardSkeletopn";

const Home: NextPage = () => {
  const [stakePopup, setStakePopup] = useState<boolean>(true);
  const [selectedNft, setSelectedNft] = useState<string>("");
  const address = useAddress();
  const { contract: nftContract } = useContract(collectionAddress);
  const { contract: stakingContract } = useContract(stakingAddress);
  const { data: getStakedNfts } = useContractRead(
    stakingContract,
    "getStakedNfts",
    [address]
  );
  const { mutateAsync: stake } = useContractWrite(stakingContract, "stake");

  const {
    data: ownedNfts,
    isLoading: ownedNftsLoading,
    error: ownedNftsError,
  } = useOwnedNFTs(nftContract, address);

  console.log(ownedNfts);

  const handleStakeFn = async () => {
    if (!address) return;
    if (!selectedNft) alert("Please select a NFT to stake");

    const isApproved = await nftContract?.erc721.isApproved(
      address,
      stakingAddress
    );

    if (!isApproved) {
      await nftContract?.erc721.setApprovalForAll(stakingAddress, true);
    }
    const id: BigNumber = BigNumber.from(selectedNft);
    await stake({ args: [id] });
  };

  if (!address)
    return (
      <div className="bg-black h-screen px-28">
        <Header />
        <div className="border-b-2 border-slate-300/25  w-full mb-10 mt-3" />
        <h1 className="text-white text-center text-3xl font-bold">
          {" "}
          Please your Connect Wallet...
        </h1>
      </div>
    );

  return (
    <div className="bg-black  max-h-full min-h-screen  px-28">
      <Header />
      <div className="border-b-2 border-slate-300/25  w-full mb-10 mt-3" />
      <div className="flex flex-row items-center mb-10">
        <h1 className="text-white text-2xl font-bold">Staked NFTs</h1>
        <button
          className="px-5 py-2 bg-slate-200 rounded-lg ml-5"
          onClick={() => setStakePopup(true)}
        >
          Stake
        </button>
      </div>
      {getStakedNfts && (
        <div className="flex flex-row flex-wrap gap-5">
          {getStakedNfts.map((nft: any) => (
            <Suspense fallback={<CardSkeleton />} key={nft.tokenId._hex}>
              <Stake
                key={nft.tokenId._hex}
                tokenId={BigNumber.from(nft.tokenId._hex).toString()}
              />
            </Suspense>
          ))}
        </div>
      )}
      )
      {stakePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center ">
          <div className="bg-slate-800 w-1/2 h-3/5 rounded-lg py-3 px-10">
            <div className="flex flex-row justify-between items-center mb-2">
              <h1 className="text-xl font-bold text-white">
                Select a owned NFT&apos;s to Stake
              </h1>
              <button
                className="px-5 py-2 rounded-lg"
                onClick={() => setStakePopup(false)}
              >
                X
              </button>
            </div>

            <div className="flex flex-row flex-wrap gap-4 justify-center overflow-y-auto h-[80%] ">
              {ownedNfts?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center cursor-pointer h-32 w-32 rounded-lg ${
                      selectedNft === item.metadata.id &&
                      "border-4 border-slate-100"
                    }`}
                    onClick={() => {
                      if (selectedNft === item.metadata.id) {
                        setSelectedNft("");
                      } else {
                        setSelectedNft(item.metadata.id);
                      }
                    }}
                  >
                    <MediaRenderer
                      src={item?.metadata.image}
                      width="25"
                      height="25"
                      className="rounded-lg h-32 w-32"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row justify-center mt-5">
              <button
                className={`px-5 py-2 bg-slate-200 rounded-lg ${
                  !selectedNft &&
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                }}`}
                onClick={handleStakeFn}
                disabled={!selectedNft}
              >
                Stake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
