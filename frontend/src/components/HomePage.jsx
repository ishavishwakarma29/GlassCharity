// HomePage.js
import React from "react";
import "./css/HomePage.css";
import bannerImage from "../assets/bannerImage.avif";

function HomePage() {
  return (
    <div className="home-page">
      <img src={bannerImage} alt="Charity Banner" className="banner-image" />
      <h1>Welcome to the Transparent Charity Platform</h1>
      <p>
        Our mission is to bring transparency to charitable donations, ensuring
        that every contribution reaches the intended cause. You can create a
        campaign or donate to one already in need!
      </p>
      <div className="home-buttons">
        <a href="/create-campaign" className="home-button">
          Create a Campaign
        </a>
        <a href="/donate" className="home-button">
          Donate to a Campaign
        </a>
      </div>
    </div>
  );
}

export default HomePage;
