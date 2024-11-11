import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import "./css/CampaignPage.css";
import { abi, CONTRACT_ADDRESS } from "../utils/constants";

const CampaignPage = () => {
  const [data] = useSearchParams();
  const [campaign, setCampaign] = useState({});
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amountRaised, setAmountRaised] = useState("");
  const [collectedPercent, setCollectedPercent] = useState("");

  useEffect(() => {  
    const fetchCampaignData = async () => {
        const collected = Number(ethers.formatEther(data.get("totalDonated")));
        const goal = Number(ethers.formatEther(data.get("targetAmount")));
        console.log(collected);
        console.log(goal);
        const percent = (collected*100/goal);
        console.log(collectedPercent);
        setCampaign({
          title: data.get("title"),
          description: data.get("description"),
          goal: ethers.formatEther(data.get("targetAmount")),
          logoUrl: data.get("logo"),
          creator: data.get("creatorAddress"),
        });
        setAmountRaised(ethers.formatEther(data.get("totalDonated")));
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
       console.log(value);
       const transaction = await contract.donate(data.get("id"), { value });
       await transaction.wait();
       console.log(transaction);
      alert("Thank you for your donation!");
      const tot = Number(data.get("totalDonated")) + Number(value);
      setAmountRaised(ethers.formatEther(tot));
      const percent = ((amountRaised+value)*100)/campaign.goal;
      setCollectedPercent(Math.min(100, percent).toFixed(10));
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
