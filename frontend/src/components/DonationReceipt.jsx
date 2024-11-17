import React, {useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";
import "./css/DonationReceipt.css";
import { ethers, Wallet } from "ethers";
import {pinata} from "../utils/pinataConfig.ts"
import favicon from "./assets/favicon.ico";
import html2pdf from "html2pdf.js";
import {
  abi,
  API_URL,
  CONTRACT_ADDRESS,
  PRIVATE_KEY,
} from "../utils/constants";

const DonationReceipt = () => {
  const [data] = useSearchParams();
  const [transactionHash, setTransactionHash] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [gasUsed, setGasUsed] = useState("");

  async function handleDownload(){
    const element = document.getElementById("receipt");
    html2pdf().from(element).save(transactionHash+".pdf");
  }

  useEffect(() => {
    const fetchReceipt = async () => {
    console.log(data.get("hash"));
    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.getTransactionReceipt(data.get("hash"));
      console.log(receipt);
      setCampaignName(data.get("name"));
      setTransactionHash(data.get("hash"));
      setOrganizationLogoUrl(await pinata.gateways.convert(data.get("logo")));
      setAmount(ethers.formatEther(data.get("value")));
      setDonorAddress(receipt.from);
      setReceiverAddress(data.get("address"));
      setGasPrice(ethers.formatEther(receipt.gasPrice));
      setGasUsed(ethers.formatEther(receipt.gasUsed));
    };
    fetchReceipt();
  }, []);
  return (
    <>
      <div id="receipt" className="receipt-container">
        <div className="receipt-header">
          <img src={favicon} alt="Website Logo" className="website-logo" />
          <h1>Donation Receipt</h1>
          <img
            src={organizationLogoUrl}
            alt="Organization Logo"
            className="organization-logo"
          />
        </div>

        <div className="receipt-body">
          <p>
            <strong>Thank you for your donation!</strong>
          </p>
          <p>
            Your contribution is greatly appreciated and will help support our
            cause.
          </p>

          <div className="receipt-details">
            <p>
              <strong>Date:</strong> {Date()}
            </p>
            <p>
              <strong>Campaign Name:</strong> {campaignName}
            </p>
            <p>
              <strong>Donor Address:</strong> {donorAddress}
            </p>
            <p>
              <strong>Receiver Address:</strong> {receiverAddress}
            </p>
            <p>
              <strong>Donation Amount:</strong> {amount} ETH
            </p>
            <p>
              <strong>Transaction Hash:</strong> {transactionHash}
            </p>
            <p>
              <strong>Gas Price:</strong> {gasPrice} ETH
            </p>
            <p>
              <strong>Gas Used:</strong> {gasUsed} ETH
            </p>
          </div>
        </div>

        <div className="receipt-footer">
          <p>
            <em>
              This is an auto-generated receipt for your donation. Please keep
              it for your records.
            </em>
          </p>
        </div>
      </div>
      <button className="downloadBtn" onClick={handleDownload}>
        Download
      </button>
    </>
  );
};

export default DonationReceipt;
