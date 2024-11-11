// DonateToCampaignForm.js
import React, { useState } from "react";
import "./css/DonateToCampaignForm.css";
import { ethers } from "ethers";
import { abi, CONTRACT_ADDRESS } from "../utils/constants";

function DonateToCampaignForm() {
  const [campaignId, setCampaignId] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleDonate = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractAddress = CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const value = ethers.parseEther(donationAmount);
        const transaction = await contract.donate(campaignId, {value});
        await transaction.wait();
        console.log(transaction);
      } else {
        console.log("Metamask Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="donate-to-campaign-form">
      <h2>Donate to a Campaign</h2>
      <form onSubmit={handleDonate}>
        <div className="form-group">
          <label>Campaign ID:</label>
          <input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Donation Amount (ETH):</label>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Donate</button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
}

export default DonateToCampaignForm;
