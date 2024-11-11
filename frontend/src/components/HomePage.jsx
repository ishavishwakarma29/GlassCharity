import React, { act, useEffect, useState } from "react";
import "./css/HomePage.css";
import Navbar from "./Navbar.jsx";
import { ethers } from "ethers";
import CampaignCard, {campaignCard} from "./CampaignCard.jsx";

import {
  abi,
  CONTRACT_ADDRESS,
} from "../utils/constants";
import { pinata } from "../utils/pinataConfig.ts";

function HomePage () {
  const [campaignsData, setCampaignsData] = useState([]);

  async function getAllCampaigns() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractAddress = CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const AllCampaigns = await contract.getAllCampaigns();
        console.log(AllCampaigns);
        const actualValues = Array.from(
          { length: Object.keys(AllCampaigns).length },
          (_, i) => Object.values(AllCampaigns[i])
        );
        var arr = [];
        for(var i=0; i<actualValues.length; i++){
          arr.push({
            creatorAddress: actualValues[i][0],
            id: actualValues[i][1],
            title: actualValues[i][2],
            description: actualValues[i][3],
             targetAmount: actualValues[i][4],
             totalDonated: actualValues[i][5],
             isActive: actualValues[i][6],
            logo: await pinata.gateways.convert(actualValues[i][7]),
          });
        }
        console.log(arr);
        setCampaignsData(arr);
      } else {
        console.log("Metamask Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=>{
    getAllCampaigns();
  }, []);

     return (
       <>
         <Navbar></Navbar>
         <div className="page">
           <header className="header">
           </header>
           <div className="grid">
             {campaignsData.map((campaign) => (
                <CampaignCard campaign={campaign}></CampaignCard>
             ))}
           </div>
         </div>
       </>
     );
}

export default HomePage;