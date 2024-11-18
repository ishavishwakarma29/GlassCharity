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
  const [allCampaignsData, setAllCampaignsData] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);
  const [myCampaignsData, setMyCampaignsData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

   window.ethereum.on('accountsChanged', function (accounts) {
      if(accounts.length === 0){
        window.location.replace("http://localhost:3000");
      }
   });

  async function getAllCampaigns() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
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
        var my = [];
        for(var i=0; i<actualValues.length; i++){
          const cpn = {
            creatorAddress: actualValues[i][0],
            id: actualValues[i][1],
            title: actualValues[i][2],
            description: actualValues[i][3],
            targetAmount: actualValues[i][4],
            totalDonated: actualValues[i][5],
            isActive: actualValues[i][6],
            logo: await pinata.gateways.convert(actualValues[i][7]),
          };
          arr.push(cpn);
          if(cpn.creatorAddress.toLowerCase() === accounts[0].toLowerCase()){
            my.push(cpn);
          }
        }
        setAllCampaignsData(arr);
        setCampaignsData(arr);
        setMyCampaignsData(my);
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

  const filterCampaigns = () => {
    if (!isChecked) {
      setCampaignsData(myCampaignsData);
    } else {
      setCampaignsData(allCampaignsData);
    }
    setIsChecked(!isChecked);
  };

     return (
       <>
         <Navbar></Navbar>
         <div className="toggle-button-container">
           <div className="Toggle-switch">
             <input
               type="checkbox"
               className="Toggle-switch-checkbox"
               name="ToggleSwitch"
               id="ToggleSwitch"
               onChange={filterCampaigns}
             />
             <label className="Toggle-switch-label" htmlFor="ToggleSwitch">
               <span className="Toggle-switch-inner" />
               <span className="Toggle-switch-switch" />
             </label>
           </div>
         </div>
         <div className="page">
           <header className="header"></header>
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