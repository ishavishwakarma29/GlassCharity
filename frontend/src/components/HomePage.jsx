import React, { useEffect, useState } from "react";
import "./css/HomePage.css";
import { ethers } from "ethers";
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
            id: actualValues[i][1],
            logo: await pinata.gateways.convert(actualValues[i][7]),
            title: actualValues[i][2],
            description: actualValues[i][3],
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
         <div className="page">
           <header className="header">
             <h1 className="heading">Our Charity Campaigns</h1>
             <p className="subheading">
               Explore all active campaigns and support a cause today! or
             </p>
             <a className="button" href="/create-campaign">
               Create a Campaign
             </a>
           </header>
           <div className="grid">
             {campaignsData.map((campaign) => (
               <div key={campaign.id} className="card">
                 <img
                   src={campaign.logo}
                   alt="Campaign Logo"
                   className="logo"
                 />
                 <h2 className="cardTitle">{campaign.title}</h2>
                 <p className="cardDescription">{campaign.description}</p>
                 <button className="button">Donate Now</button>
               </div>
             ))}
           </div>
         </div>
       </>
     );
}

export default HomePage;