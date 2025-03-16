"use client";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract, toEther } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useState } from "react";


export default function Home() {
  const account = useActiveAccount();

  // Replace the chain with the chain you want to connect to
  const chain = defineChain( sepolia );

  const [quantity, setQuantity] = useState(1);

  // Replace the address with the address of the deployed contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x2ec92364276Bd9cb9cd4649197f495B4D460AEd1"
  });

  const { data: contractMetadata, isLoading: isContractMetadataLaoding } = useReadContract( getContractMetadata,
    { contract: contract }
  );

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract( getTotalClaimedSupply,
    { contract: contract}
  );

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract( nextTokenIdToMint,
    { contract: contract }
  );

  const { data: claimCondition } = useReadContract( getActiveClaimCondition,
    { contract: contract }
  );

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  }

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center container max-w-screen-lg mx-auto">

  {/* Hero Section */}
  <section className="w-full flex flex-col md:flex-row items-center justify-between py-20 bg-cover bg-center hero">
    
    {/* Left Container: Heading, Description & Button */}
    <div className="md:w-1/2 text-center md:text-left space-y-6 bg-opacity-50 bg-black p-8 rounded-lg">
      <h1 className="text-4xl font-extrabold text-white">
        Welcome to Our NFT Project
      </h1>
      <p className="text-lg text-gray-200">
        Discover unique NFTs and mint your own today!
      </p>
      <a href="#mint" className="mt-6 inline-block bg-blue-500 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
        Mint Now
      </a>
    </div>

    {/* Right Container: image */}
    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
      <img src="/frame.png" alt="NFT Art" className="w-full max-w-[400px] rounded-xl shadow-2xl" />
    </div>

  </section>


  {/* About Us Section */}
  <section id="about" className="w-full text-center py-20">
    <h2 className="text-3xl font-semibold">About Us</h2>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
      We are a community-driven NFT project focused on bringing pixel art to the blockchain.
      Our mission is to create a vibrant ecosystem for collectors and creators.
    </p>
  </section>

  {/* Minting Section */}
  <section id="mint" className="w-full text-center py-20">
    <h2 className="text-3xl font-semibold">Mint Your NFT</h2>

    <div className="flex flex-col items-center mt-6">
      <Header />
      <ConnectButton client={client} chain={chain} />

      {/* NFT Display & Metadata */}
      <div className="flex flex-col items-center mt-4">
        {isContractMetadataLaoding ? (
          <p>Loading...</p>
        ) : (
          <>
            <MediaRenderer
              client={client}
              src={contractMetadata?.image}
              className="rounded-xl"
            />
            <h2 className="text-2xl font-semibold mt-4">
              {contractMetadata?.name}
            </h2>
            <p className="text-lg mt-2">{contractMetadata?.description}</p>
          </>
        )}

        {/* NFT Supply */}
        {isClaimedSupplyLoading || isTotalSupplyLoading ? (
          <p>Loading...</p>
        ) : (
          <p className="text-lg mt-2 font-bold">
            Total NFT Supply: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
          </p>
        )}

        {/* Minting Controls */}
        <div className="flex flex-row items-center justify-center my-4">
          <button
            className="bg-black text-white px-4 py-2 rounded-md mr-4"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >-</button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-10 text-center border border-gray-300 rounded-md bg-black text-white"
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-md ml-4"
            onClick={() => setQuantity(quantity + 1)}
          >+</button>
        </div>

        {/* Claim Button */}
        <TransactionButton
          transaction={() => claimTo({
            contract: contract,
            to: account?.address || "",
            quantity: BigInt(quantity),
          })}
          onTransactionConfirmed={async () => {
            alert("NFT Claimed!");
            setQuantity(1);
          }}
        >
          {`Claim NFT (${getPrice(quantity)} ETH)`}
        </TransactionButton>
      </div>
    </div>
  </section>

  {/* Footer Section */}
  <footer className="w-full text-center py-10 border-t border-gray-700 mt-10">
    <p className="text-lg text-gray-400">© 2025 NFT Project | All Rights Reserved</p>
    <div className="flex justify-center mt-4 space-x-6">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <img src="/twitter-icon.png" alt="Twitter" className="w-6 h-6" />
      </a>
      <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
        <img src="/discord-icon.png" alt="Discord" className="w-6 h-6" />
      </a>
      <a href="https://opensea.io" target="_blank" rel="noopener noreferrer">
        <img src="/opensea-icon.png" alt="OpenSea" className="w-6 h-6" />
      </a>
    </div>
  </footer>

</main>
  );
}

function Header() {
  return (
    <header className="flex flex-row items-center">
     

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        NFT Claim App
      </h1>
    </header>
  );
}