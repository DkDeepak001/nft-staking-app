import { MediaRenderer, useContract, useNFT } from "@thirdweb-dev/react";
import { collectionAddress } from "../const/address";
import Link from "next/link";
import Image from "next/image";
import CardSkeleton from "./cardSkeletopn";

type StakeProps = {
  tokenId: string;
};

export const Stake = ({ tokenId }: StakeProps) => {
  const { contract } = useContract(collectionAddress);
  const { data, isLoading, error } = useNFT(contract, tokenId);
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
        {/* <div className="w-2/5 flex flex-col">
          {isLoading ? (
            <p className="bg-white/50 animate-pulse w-36 rounded-lg h-10"> </p>
          ) : isListing && isListing[0] ? (
            <>
              <p className="text-white mb-2 text-center">
                {isListing[0].buyoutCurrencyValuePerToken.displayValue} MATIC
              </p>
              <button
                onClick={() => handleBuyout()}
                className="bg-slate-300 text-brand-primary rounded-lg w-full h-11  font-medium   tracking-wider hover:bg-slate-100"
              >
                Buy
              </button>
            </>
          ) : (
            <>
              <Link
                className="flex flex-row items-center justify-start gap-x-2"
                href={`/ownable/${item.owner}`}
              >
                <Image
                  src={`https://api.dicebear.com/6.x/bottts-neutral/png?seed=${item.owner}`}
                  width="100"
                  height="100"
                  className="rounded-full h-8 w-8"
                  alt="avatar"
                />

                <p className="text-white ">{item.owner.slice(0, 8)}...</p>
              </Link>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};
