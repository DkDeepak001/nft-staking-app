import { MediaRenderer, NFT } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
type StakingPopupProps = {
  setStakePopup: (value: boolean) => void;
  setSelectedNft: (value: string) => void;
  handleStake: () => void;
  ownedNftsLoading: boolean;
  ownedNfts: NFT[];
  selectedNft: string;
  claimCountLoading: boolean;
};

const StakingPopup = ({
  setStakePopup,
  ownedNfts,
  selectedNft,
  setSelectedNft,
  handleStake,
  ownedNftsLoading,
  claimCountLoading,
}: StakingPopupProps) => {
  let router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center ">
      <div className="bg-slate-800 w-1/2 h-3/5 rounded-lg py-3 px-10">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-white">
            Select a owned NFT&apos;s to Stake
          </h1>
          <button
            className="px-5 py-2 rounded-lg text-white"
            onClick={() => setStakePopup(false)}
          >
            X
          </button>
        </div>

        <div className="flex flex-row flex-wrap gap-4 justify-center overflow-y-auto h-[80%] ">
          {ownedNftsLoading ||
            (claimCountLoading && (
              <div className="flex flex-row items-center justify-center">
                <h2 className="text-white text-lg font-bold">
                  Loading NFT&apos;s...
                </h2>
              </div>
            ))}
          {ownedNfts && ownedNfts?.length <= 0 ? (
            <div className="flex flex-row items-center ">
              <h2 className="text-white text-lg font-bold">
                No NFT&apos;s owned
              </h2>
              <button
                className="px-5 py-2 bg-slate-200 rounded-lg ml-5"
                onClick={() =>
                  router.push(
                    "https://nft-marketplace-thirdweb-app.vercel.app/"
                  )
                }
              >
                Buy
              </button>
            </div>
          ) : (
            ownedNfts?.map((item, index) => {
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
            })
          )}
        </div>
        <div className="flex flex-row justify-center mt-5">
          {ownedNfts && ownedNfts?.length > 0 && (
            <button
              className={`px-5 py-2 bg-slate-200 rounded-lg ${
                !selectedNft &&
                "disabled:opacity-50 disabled:cursor-not-allowed"
              }}`}
              onClick={handleStake}
              disabled={!selectedNft}
            >
              Stake
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPopup;
