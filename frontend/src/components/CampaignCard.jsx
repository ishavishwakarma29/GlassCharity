import React from "react";

const CampaignCard = (props) => {
    var trimmedString = props.campaign.description.substr(0, 80);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    const pageUrl = "/campaign-page?id="+props.campaign.id;
  return (
    <div key={props.campaign.id} className="card">
      <img src={props.campaign.logo} alt="Campaign Logo" className="logo" />
      <h2 className="cardTitle">{props.campaign.title}</h2>
      <p className="cardDescription">{trimmedString}</p>
      <a className="button" href={pageUrl}>View</a>
    </div>
  );
};

export default CampaignCard;
