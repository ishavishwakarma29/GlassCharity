import React from "react";

const CampaignCard = (props) => {
    console.log(props.campaign.isActive);
    
    const pageUrl = "/campaign-page?creatorAddress="+props.campaign.creatorAddress+"&id="+props.campaign.id+"&title="+props.campaign.title+"&description="+props.campaign.description+"&targetAmount="+props.campaign.targetAmount+"&totalDonated="+props.campaign.totalDonated+"&isActive="+props.campaign.isActive+"&logo="+props.campaign.logo;
  return (
    <div key={props.campaign.id} className="card">
      <img src={props.campaign.logo} alt="Campaign Logo" className="logo" />
      <h2 className="cardTitle">{props.campaign.title}</h2>
      <p className="cardDescription">{props.campaign.description}</p>
      <a className="button" href={pageUrl}>View</a>
    </div>
  );
};

export default CampaignCard;
