import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const address = useAddress();

  return (
    <div className="flex flex-row justify-between py-5">
      <Link className="flex flex-row items-center gap-x-2 " href="/">
        <Image
          src="/logo.png"
          alt="Thirdweb Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold text-white ml-2">Wiz staking</h1>
      </Link>
      <div className="flex flex-row items-center gap-x-5">
        <Link href="https://nft-marketplace-thirdweb-app.vercel.app/">
          <h2 className="text-white font-bold mr-5">Buy Nft&apos;s</h2>
        </Link>
        <Link href="/claim">
          <h2 className="text-white font-bold mr-5">Claim Nft&apos;s</h2>
        </Link>

        {address && (
          <Image
            src={`https://api.dicebear.com/6.x/bottts-neutral/png?seed=${address}`}
            width="100"
            height="100"
            className="rounded-full h-10 w-10"
            alt="avatar"
          />
        )}
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
