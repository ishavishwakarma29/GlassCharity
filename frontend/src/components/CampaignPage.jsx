import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import "./css/CampaignPage.css";
import { abi, CONTRACT_ADDRESS } from "../utils/constants";
import {pinata} from "../utils/pinataConfig.ts";

const CampaignPage = () => {
  const [id] = useSearchParams();
  const [campaign, setCampaign] = useState({});
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amountRaised, setAmountRaised] = useState("");
  const [collectedPercent, setCollectedPercent] = useState("");

  useEffect(() => {  
    const fetchCampaignData = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractAddress = CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const res = await contract.getCampaignById(id.get("id"));
        const collected = ethers.formatEther(Object.values(res)[5]);
        const goal = ethers.formatEther(Object.values(res)[4]);
        const percent = (collected*100/goal);
        setCampaign({
          id: Object.values(res)[1],
          title: Object.values(res)[2],
          description: Object.values(res)[3],
          goal: ethers.formatEther(Object.values(res)[4]),
          logoUrl: await pinata.gateways.convert(Object.values(res)[7]),
          creator: Object.values(res)[0],
          totalCollected: ethers.formatEther(Object.values(res)[5]),
        });
        setAmountRaised(ethers.formatEther(Object.values(res)[5]));
        setCollectedPercent(Math.min(100, percent).toFixed(10));
    };

    fetchCampaignData();
  }, []);

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
       console.log("from: "+transaction.from);
       console.log("gasPrice: "+ethers.formatEther(transaction.gasPrice));
       console.log("hash: "+transaction.hash);
       console.log("to: "+transaction.to);
        console.log("to: "+ethers.formatEther(transaction.value));
      alert("Thank you for your donation!");
      const tot = Number(ethers.parseEther(campaign.totalCollected)) + Number(value);
      setAmountRaised(ethers.formatEther(tot));
      const percent = (amountRaised*100)/campaign.goal;
      setCollectedPercent(Math.min(100, percent).toFixed(10));
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

  return (
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
        <div className="donation-section">
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
        </div>
      </main>
    </div>
  );
};

export default CampaignPage;
