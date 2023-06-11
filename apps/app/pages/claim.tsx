import {
  useAddress,
  useClaimedNFTSupply,
  useContract,
  useOwnedNFTs,
  useUnclaimedNFTSupply,
  useUnclaimedNFTs,
} from "@thirdweb-dev/react";
import Header from "../components/header";
import { claimAddress } from "../const/address";
import CardSkeleton from "../components/cardSkeletopn";
import { Suspense } from "react";
import ClaimNft from "../components/claim";
import { BigNumber } from "ethers";

const Claim = () => {
  const address = useAddress();
  const { contract: claimContract } = useContract(claimAddress, "nft-drop");

  const { data: unclaimedNFTs, isLoading: unclaimedNFTsLoading } =
    useUnclaimedNFTs(claimContract);
  const { data: UnclaimedNFTSupply } = useUnclaimedNFTSupply(claimContract);

  const {
    data: claimedCount,
    isLoading: claimCountLoading,
    error,
  } = useOwnedNFTs(claimContract, address);

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

  if (unclaimedNFTsLoading || claimCountLoading) {
    return (
      <div className="bg-black max-h-full min-h-screen px-28">
        <Header />
        <div className="border-b-2 border-slate-300/25  w-full mb-10 mt-3" />
        <CardSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="bg-black  max-h-full min-h-screen  px-28">
      <Header />
      <div className="flex flex-row items-center mb-10  justify-center">
        <h1 className="text-white text-3xl font-bold">
          {BigNumber.from(UnclaimedNFTSupply?._hex).toString()} UnClaimed NFTs
        </h1>
      </div>
      {unclaimedNFTs ? (
        <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
          {unclaimedNFTs.map((nft, index) => (
            <Suspense fallback={<CardSkeleton />} key={index}>
              {/* @ts-ignore */}
              <ClaimNft data={nft} clamined={claimedCount?.length >= 1} />
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="flex flex-row items-center mb-10  justify-center">
          <h1 className="text-white text-2xl font-bold">
            NO NFTs avaialble to claim
          </h1>
        </div>
      )}
    </div>
  );
};

export default Claim;
