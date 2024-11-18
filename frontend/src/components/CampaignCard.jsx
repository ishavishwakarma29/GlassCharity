import React from "react";

const CampaignCard = (props) => {
    var trimmedString = props.campaign.description.substr(0, 80);
    if((props.campaign.description.length)>(trimmedString.length)) {
      trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
     if (props.campaign.description.length > trimmedString.length){
        trimmedString += "...";
     }
    }
    const pageUrl = "/campaign-page?id="+props.campaign.id;
  return (
    <div key={props.campaign.id} className="card" style={{backgroundColor: (props.campaign.isActive)?'#eef9b6':"gray"}}>
      <img src={props.campaign.logo} alt="Campaign Logo" className="logo" />
      <h2 className="cardTitle" style={{color: (props.campaign.isActive)?'black':"white"}}>{props.campaign.title}</h2>
      <p className="cardDescription" style={{color: (props.campaign.isActive)?'black':"white"}}>{trimmedString}</p>
      <a className="button" href={pageUrl}>View</a>
      <p className="cardDescription" style={{display: (props.campaign.isActive)?'none':"block", color: "white"}}>Not Active</p>
    </div>
  );
};

export default CampaignCard;
