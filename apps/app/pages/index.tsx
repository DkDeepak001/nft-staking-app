import {
  MediaRenderer,
  useAddress,
  useClaimNFT,
  useContract,
  useContractRead,
  useContractWrite,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { BigNumber } from "ethers";

import {
  claimAddress,
  collectionAddress,
  stakingAddress,
  tokenAddress,
} from "../const/address";
import Header from "../components/header";
import { Stake } from "../components/stake";
import { Suspense, useEffect, useState } from "react";
import CardSkeleton from "../components/cardSkeletopn";
import { toast } from "react-hot-toast";
import StakingPopup from "../components/stakingPopup";
import { useBalance } from "@thirdweb-dev/react";
import Image from "next/image";

const Home: NextPage = () => {
  const [stakePopup, setStakePopup] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean | undefined>(false);
  const [selectedNft, setSelectedNft] = useState<string>("");
  const address = useAddress();
  const { contract: nftContract } = useContract(collectionAddress);
  const { contract: stakingContract } = useContract(stakingAddress);
  const { contract: tokenContract } = useContract(tokenAddress);
  const { contract: claimContract } = useContract(claimAddress);

  const { data: tokenBalance, refetch: refetchAvailableToken } =
    useBalance(tokenAddress);

  const { data: getStakedNfts } = useContractRead(
    stakingContract,
    "getStakedNfts",
    [address]
  );
  const { mutateAsync: stake } = useContractWrite(stakingContract, "stake");

  const {
    mutateAsync: calculateReward,
    data: calculatedReward,
    isError,
  } = useContractWrite(stakingContract, "calculateReward");

  const {
    data: claimedNfts,
    isLoading: claimCountLoading,
    error,
  } = useOwnedNFTs(claimContract, address);
  useEffect(() => {
    const timeout = setTimeout(() => {
      calculateRewardFn();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [address]);

  const calculateRewardFn = async () => {
    if (!address) return;
    calculateReward({ args: [address] });
  };

  if (isError) toast.error("Error Calculating Reward");

  const {
    data: ownedNfts,
    isLoading: ownedNftsLoading,
    refetch: refetchOwnedNfts,
  } = useOwnedNFTs(nftContract, address);

  const { mutateAsync: claimReward } = useContractWrite(
    stakingContract,
    "claimRewards"
  );

  useEffect(() => {
    if (!address) return;
    const call = async () =>
      await nftContract?.erc721.isApproved(address, stakingAddress);
    call()
      .then((res) => setIsApproved(res))
      .catch((e) => console.log("e", e));
  }, [address]);

  const handleStake = async () => {
    if (!address) return;
    if (!selectedNft) toast.error("Please select a NFT to stake");
    setStakePopup(false);

    try {
      const isApproved = await nftContract?.erc721.isApproved(
        address,
        stakingAddress
      );

      const id: string = BigNumber.from(selectedNft).toString();

      await toast.promise(stake({ args: [id] }), {
        loading: "Staking NFT...",
        success: "NFT Staked",
        error: "Error Staking NFT",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleApproveFn = async (): Promise<void> => {
    await nftContract?.erc721.setApprovalForAll(stakingAddress, true);
  };

  const handleClaim = async () => {
    if (!address) return;

    try {
      await tokenContract?.erc20.allowance(address);
      await toast.promise(claimReward({}), {
        loading: "Claiming Reward...",
        success: "Reward Claimed",
        error: "Error Claiming Reward",
      });
      await refetchAvailableToken();
      await calculateReward({ args: [address] });
    } catch (e) {
      console.log("e", e);
    }
  };

  const handleApprove = async () => {
    if (!address) return;
    try {
      toast.promise(handleApproveFn(), {
        loading: "Approving NFT...",
        success: "NFT Approved",
        error: "Error Approving NFT",
      });
    } catch (e) {
      console.log("e", e);
    } finally {
      setStakePopup(true);
    }
  };
  console.log("isApproved", isApproved);

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
  //  @ts-ignore
  const reward = Number(BigNumber.from(calculatedReward._hex).toString());

  return (
    <div className="bg-black  max-h-full min-h-screen  px-28">
      <Header />
      <div className="border-b-2 border-slate-300/25  w-full mb-10 mt-3" />
      <div className="flex flex-row items-center mb-10 justify-center gap-10">
        <div className="border border-slate-300/75 rounded-lg px-5  w-1/4 items-center justify-center flex flex-col gap-3 py-5">
          <h1 className="text-white text-2xl ">Claimable Rewards</h1>
          <div className="flex flex-row items-center justify-center gap-x-2">
            <Image src="/coin.png" width={30} height={30} alt="coin" />

            <h1 className="text-white text-2xl ">
              {calculatedReward ? (reward / 1e18).toFixed(18) : (0).toFixed(18)}
            </h1>
          </div>
        </div>
        <div className="border border-slate-300/75 rounded-lg px-5  w-1/4 items-center justify-center flex flex-col gap-3 py-5">
          <h1 className="text-white text-2xl ">Current Balance</h1>
          <div className="flex flex-row items-center justify-center gap-x-2">
            <Image src="/coin.png" width={30} height={30} alt="coin" />
            <h1 className="text-white text-2xl ">
              {tokenBalance?.displayValue}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          className="px-5 py-2 bg-slate-200 rounded-lg mb-10 w-1/6"
          onClick={() => handleClaim()}
        >
          Claim Rewards
        </button>
      </div>
      <div className="flex flex-row items-center mb-10  justify-center">
        <div className="flex flex-row items-center">
          <h1 className="text-white text-2xl font-bold">Staked NFTs</h1>
          <button
            className="px-5 py-2 bg-slate-200 rounded-lg ml-5"
            onClick={() => {
              !isApproved ? handleApprove() : setStakePopup(true);
            }}
          >
            {!isApproved ? `approve` : "Stake"}
          </button>
        </div>
        {claimedNfts && claimedNfts?.length >= 1 && (
          <div className="flex flex-row items-center justify-center gap-x-2 ml-10 border border-slate-300/75 p-5 rounded-xl ">
            <MediaRenderer
              alt="nft"
              src={claimedNfts?.[0]?.metadata.image}
              width="75"
              height="75"
              className="rounded-xl w-20 h-20"
            />
            <h1 className="text-white text-2xl ">
              {claimedNfts?.[0].metadata.name}
            </h1>
          </div>
        )}
      </div>
      {getStakedNfts && (
        <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
          {getStakedNfts.map((nft: any) => (
            <Suspense fallback={<CardSkeleton />} key={nft.tokenId._hex}>
              <Stake
                key={nft.tokenId._hex}
                tokenId={BigNumber.from(nft.tokenId._hex).toString()}
                refetch={refetchOwnedNfts}
              />
            </Suspense>
          ))}
        </div>
      )}
      )
      {stakePopup && (
        <StakingPopup
          handleStake={handleStake}
          setSelectedNft={(val: string) => setSelectedNft(val)}
          ownedNfts={[...(ownedNfts ?? [])] ?? []}
          selectedNft={selectedNft}
          setStakePopup={setStakePopup}
          ownedNftsLoading={ownedNftsLoading}
          claimCountLoading={claimCountLoading}
        />
      )}
    </div>
  );
};

export default Home;
