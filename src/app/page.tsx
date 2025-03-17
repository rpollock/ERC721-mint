"use client";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract, toEther } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useState } from "react";
import Image from 'next/image'


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
    <>

  {/* Hero Section */}
  <section className="w-full flex flex-col md:flex-row items-center justify-between py-20 bg-cover bg-center hero">
    
    {/* Left Container: Heading, Description & Button */}
    <div className="md:w-1/2 text-center md:text-left space-y-6 bg-opacity-50 p-8 rounded-lg px-15">
      <h1 className="text-4xl font-extrabold text-white">
        Welcome to Our NFT Project
      </h1>
      <p className="text-lg text-gray-200">
        Discover unique NFTs and mint your own today!
      </p>
      <a href="#mint" className="mt-6 inline-block bg-blue-500 text-white text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 btn-1">
        Mint Now
      </a>
    </div>

    {/* Right Container: image */}
    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
      <Image src="/frame.png" alt="NFT Art" className="w-full max-w-[400px] rounded-xl"/>
    </div>
    

  </section>


  {/* About Us Section */}
  <section id="about" className="w-full text-center py-20">
    <h2 className="text-3xl font-semibold">About Us</h2>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
    We are more than just pixel art on the blockchain; we are a thriving community. Cool Pixel Turtles is a project built by and for collectors and creators, dedicated to bringing the charm of pixelated turtles to the NFT world. Join us as we build a vibrant ecosystem where artistic expression and community spirit collide.
    </p>
    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
    Our mission is simple: to create a fun, engaging, and community-driven NFT experience centered around the delightful world of pixel turtles. We believe in the power of pixel art and its ability to connect people. At Cool Pixel Turtles, we are building a vibrant ecosystem where collectors and creators can come together to celebrate creativity and digital ownership.
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
            <h2 className="text-2xl font-semibold mt-4 hed2">
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
            className="bg-black text-white px-4 py-2 rounded-md mr-4 btn-1"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >-</button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-10 text-center border border-gray-300 rounded-md bg-black text-white"
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-md ml-4 btn-1"
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
          className="btn-1"
        >
          {`Claim NFT (${getPrice(quantity)} ETH)`}
        </TransactionButton>
        <a href="stakinglink" className="btn-1">Stake NFT</a>
      </div>
    </div>
  </section>

  {/* Footer Section */}
  <footer className="w-full text-center py-10 border-t border-gray-700 mt-10">
    <p className="text-lg text-gray-400">© 2025 COOL PIXEL TURTLES | All Rights Reserved</p>
   
  </footer>

</>
  );
}

function Header() {
  return (
    <header className="flex flex-row items-center">
     

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100 hed">
       COOL PIXEL TURTLES
      </h1>
    </header>
  );
}