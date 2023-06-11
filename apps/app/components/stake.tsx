import {
  MediaRenderer,
  useContract,
  useContractWrite,
  useNFT,
} from "@thirdweb-dev/react";
import { collectionAddress, stakingAddress } from "../const/address";

import CardSkeleton from "./cardSkeletopn";
import { toast } from "react-hot-toast";
import { BigNumber } from "ethers";

type StakeProps = {
  tokenId: string;
  refetch: () => void;
};

export const Stake = ({ tokenId, refetch }: StakeProps) => {
  const { contract: nftContract } = useContract(collectionAddress);
  const { contract: stakingContract } = useContract(stakingAddress);
  const { data, isLoading, error } = useNFT(nftContract, tokenId);
  const { mutateAsync: withdraw } = useContractWrite(
    stakingContract,
    "withdraw"
  );

  const handleWithdraw = async (id: string) => {
    if (!id) return toast.error("Please select a NFT to withdraw");
    try {
      await toast.promise(withdraw({ args: [BigNumber.from(id)._hex] }), {
        loading: "Withdrawing NFT...",
        success: "NFT Withdrawn",
        error: "Error Withdrawing NFT",
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <CardSkeleton />;
  return (
    <div
      className="border-2 border-slate-300 rounded-lg  p-4 "
      key={data?.metadata.id}
    >
      <MediaRenderer
        src={data?.metadata.image}
        width="75"
        height="75"
        className="rounded-lg h-80 w-8h-80"
      />
      <div className="pt-5 flex flex-row justify-between items-center ">
        <div className="flex-col flex ">
          <h4 className="text-slate-300 text-3xl text-extrabold">
            #{data?.metadata.id}
          </h4>
          <p className="text-slate-300 text-xl text-extrabold pt-2">
            {data?.metadata.name}
          </p>
        </div>
        <button
          className="px-5 py-2 bg-slate-200 rounded-lg"
          onClick={() => handleWithdraw(data?.metadata?.id ?? "")}
        >
          withdraw
        </button>
      </div>
    </div>
  );
};
