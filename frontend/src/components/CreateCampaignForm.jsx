// CreateCampaignForm.js
import React, { useState } from "react";
import "./css/CreateCampaignForm.css";
import { ethers } from "ethers";
import {
  abi,
  API_URL,
  CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../utils/constants";
import { pinata } from "../utils/pinataConfig.ts";

function CreateCampaignForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [image, setImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const provider = new ethers.JsonRpcProvider(API_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contractAddress = CONTRACT_ADDRESS;
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const handleSubmit = async (event) => {
    event.preventDefault();
      try {
        if (window.ethereum) {
          const upload = await pinata.upload.file(image);
          const result = await contract.createCampaign(name, description, targetAmount, upload.IpfsHash);
          console.log(result);
        } else {
          console.log("Metamask Not Found");
        }
      } catch (err) {
        console.log(err);
      }
  };

  return (
    <div className="create-campaign-form">
      <h2>Create a New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Campaign Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Target Amount (ETH):</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Campaign Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default CreateCampaignForm;
