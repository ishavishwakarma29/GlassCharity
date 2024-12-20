// HomePage.js
import React, {useState, useEffect} from "react";
import "./css/LandingPage.css";
import { ethers } from "ethers";

function LandingPage() {
    async function getAccountAddress() {
      try {
        if (!window.ethereum) return alert("please install metamask!");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length) {
          console.log(accounts[0]);
          window.location.replace("http://localhost:3000/home");
        } else console.log("an error occured");
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div className="cont">
      <div className="subC">
        <div className="home-page">
          <h1 className="heading">Glass Charity</h1>
          <h2>Welcome to the Transparent Charity Platform</h2>
          <p>
            Our mission is to bring transparency to charitable donations,
            ensuring that every contribution reaches the intended cause. You can
            create a campaign or donate to one already in need!
          </p>
          <div className="home-buttons">
            <button className="home-button" onClick={getAccountAddress}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
