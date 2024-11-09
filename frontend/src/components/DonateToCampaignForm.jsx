// DonateToCampaignForm.js
import React, { useState } from "react";
import "./css/DonateToCampaignForm.css";

function DonateToCampaignForm() {
  const [campaignId, setCampaignId] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleDonate = async (event) => {
    event.preventDefault();
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
