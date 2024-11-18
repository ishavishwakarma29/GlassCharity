import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import "./css/CampaignPage.css";
import { abi, CONTRACT_ADDRESS, API_URL, PRIVATE_KEY } from "../utils/constants";
import {pinata} from "../utils/pinataConfig.ts";

const CampaignPage = () => {
  const [id] = useSearchParams();
  const [campaign, setCampaign] = useState({});
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [amountRaised, setAmountRaised] = useState("");
  const [collectedPercent, setCollectedPercent] = useState("");
  const [myAddress, setMyAddress] = useState("");
  const [fetching, setFetching] = useState(true);


  // to handle account lock/disconnect or change
   window.ethereum.on("accountsChanged", function (accounts) {
     if (accounts.length === 0) {
       window.location.replace("http://localhost:3000");
     }
   });


  useEffect(() => {  
    // fetching campaign data
    const fetchCampaignData = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setMyAddress(accounts[0]);
        const signer = await provider.getSigner();
        const contractAddress = CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const res = await contract.getCampaignById(id.get("id"));
        const collected = ethers.formatEther(Object.values(res)[5]);
        const goal = ethers.formatEther(Object.values(res)[4]);
        const percent = (collected*100/goal);
        console.log(res);
        setCampaign({
          id: Object.values(res)[1],
          title: Object.values(res)[2],
          description: Object.values(res)[3],
          goal: ethers.formatEther(Object.values(res)[4]),
          logoUrl: await pinata.gateways.convert(Object.values(res)[7]),
          creator: Object.values(res)[0].toLowerCase(),
          totalCollected: ethers.formatEther(Object.values(res)[5]),
          isActive: Object.values(res)[6],
        });
        setAmountRaised(ethers.formatEther(Object.values(res)[5]));
        setCollectedPercent(Math.min(100, percent).toFixed(10));
        setFetching(false);
    };

    fetchCampaignData();
  }, []);

  // function to save transaction in blockchain
  const saveTransaction = async (transaction, name, logo, address, val) => {
   const provider = new ethers.JsonRpcProvider(API_URL);
   const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
   const contractAddress = CONTRACT_ADDRESS;
   const contract = new ethers.Contract(contractAddress, abi, wallet);
    const receipt = await provider.getTransactionReceipt(transaction.hash);
    console.log(receipt);
    const json = {
      date: Date(),
      transactionHash: transaction.hash,
      organizationLogoUrl: await pinata.gateways.convert(logo),
      campaignName: name,
      donorAddress: receipt.from,
      receiverAddress: address,
      amount: ethers.formatEther(val),
      gasPrice: ethers.formatEther(receipt.gasPrice),
      gasUsed: ethers.formatEther(receipt.gasUsed),
    };
    const res = await pinata.upload.json(json);
    console.log(res);
    const savedTxs = await contract.saveTransaction(res.IpfsHash);
    console.log(savedTxs);
  }

  // function to handle donations to a organisation
  const handleDonate = async () => {
    setIsLoading(true);
    try {
     if (window.ethereum) {
       const provider = new ethers.BrowserProvider(window.ethereum);
       await provider.send("eth_requestAccounts", []);
       const signer = await provider.getSigner();
       const contractAddress = CONTRACT_ADDRESS;
       const contract = new ethers.Contract(contractAddress, abi, signer);
       const value = ethers.parseEther(amount);
       const transaction = await contract.donate(campaign.id, { value });
       await transaction.wait();
       await saveTransaction(transaction, campaign.title, (campaign.logoUrl.split('/').pop()), campaign.creator, value);
      const tot = Number(ethers.parseEther(campaign.totalCollected)) + Number(value);
      setAmountRaised(ethers.formatEther(tot));
      const percent = (amountRaised*100)/campaign.goal;
      setCollectedPercent(Math.min(100, percent).toFixed(10));
      setAmount("");
      window.open(
        "http://localhost:3000/receipt?hash="+transaction.hash+"&name="+campaign.title+"&address="+campaign.creator+"&logo="+(campaign.logoUrl.split('/').pop())+"&value="+value,
        "mywindow",
        "menubar=1,resizable=1,width=650,height=1024"
      );
     } else {
       console.log("Metamask Not Found");
     }
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed");
    }
    setIsLoading(false);
  };

  // function to handle end organisation
  const handleEnd = async () => {
    setIsEnding(true);
    try {
     if (window.ethereum) {
       const provider = new ethers.BrowserProvider(window.ethereum);
       await provider.send("eth_requestAccounts", []);
       const signer = await provider.getSigner();
       const contractAddress = CONTRACT_ADDRESS;
       const contract = new ethers.Contract(contractAddress, abi, signer);
       const transaction = await contract.endCampaign(campaign.id);
       await transaction.wait();
     } else {
       console.log("Metamask Not Found");
     }
    } catch (error) {
      console.error("failed:", error);
      alert("failed to end campaign");
    }
    setIsEnding(false);
  }

  return (
    <>
       {fetching ? (<p>Loading...</p>):
       <div className="campaign-container">
      <aside className="campaign-sidebar">
        <img
          src={campaign.logoUrl}
          alt="Campaign Logo"
          className="campaign-logo"
        />
        <h1 className="campaign-title">{campaign.title}</h1>
        <p className="campaign-creator">Created by: {campaign.creator}</p>

        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${collectedPercent}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {amountRaised} / {campaign.goal} ETH raised
        </p>
      </aside>

      <main className="campaign-details">
        <h2>About this Campaign</h2>
        <p className="campaign-description">{campaign.description}</p>
        <h3 style={{display: (campaign.isActive?"none":"block"), color: "red"}}>This campaign is not active.</h3>
        <div className="donation-section" style={{display: (campaign.isActive?"block":"none")}}>
          <h2>Support this Campaign</h2>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            className="donation-input"
          />
          <button
            onClick={handleDonate}
            className="donate-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Donate Now"}
          </button>
             <button
            style={{display: (myAddress === campaign.creator)?"block":"none"}}
            onClick={handleEnd}
            className="end-button"
            disabled={isEnding}
          >
            {isEnding ? "Processing..." : "End Campaign"}
          </button>
        </div>
      </main>
    </div>}
    </>);
};

export default CampaignPage;
