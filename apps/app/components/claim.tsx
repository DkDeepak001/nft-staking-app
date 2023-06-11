import {
  MediaRenderer,
  NFT,
  useAddress,
  useClaimNFT,
  useContract,
} from "@thirdweb-dev/react";

import { toast } from "react-hot-toast";
import { claimAddress } from "../const/address";

export type claimNftProps = {
  data: {
    id: string;
    name: string;
    image: string;
    uri: string;
  };
  clamined: boolean;
};

const ClaimNft = ({ data, clamined }: claimNftProps) => {
  const address = useAddress();
  const { contract: claimContract } = useContract(claimAddress);
  const { mutate: claimNft, isLoading, error } = useClaimNFT(claimContract);

  const handleClaim = async (id: string) => {
    if (!id) return toast.error("Please select a NFT to claim");
    if (clamined) return toast.error("Only one NFT per address");
    try {
      //@ts-ignore
      await toast.promise(claimNft({ quantity: 1, tokenId: id, to: address }), {
        loading: "Claiming NFT",
        success: "NFT Claimed",
        error: "Error Claiming NFT",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border-2 border-slate-300 rounded-lg  p-4 " key={data?.id}>
      <MediaRenderer
        src={data?.image}
        width="75"
        height="75"
        className="rounded-lg h-80 w-8h-80"
      />
      <div className="pt-5 flex flex-row justify-between items-center ">
        <div className="flex-col flex ">
          <h4 className="text-slate-300 text-3xl text-extrabold">
            #{data?.id}
          </h4>
          <p className="text-slate-300 text-xl text-extrabold pt-2">
            {data?.name}
          </p>
        </div>
        <button
          className="px-5 py-2 bg-slate-200 rounded-lg"
          onClick={() => handleClaim(data?.id ?? "")}
        >
          Free Claim
        </button>
      </div>
    </div>
  );
};
export default ClaimNft;
