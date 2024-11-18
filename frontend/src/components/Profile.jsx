import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { ethers } from "ethers";

function Profile() {
  const [myAddress, setMyAddress] = useState("");

  window.ethereum.on("accountsChanged", function (accounts) {
    if (accounts.length === 0) {
      window.location.replace("http://localhost:3000");
    }
  });

  // get user address
  async function getAddress() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setMyAddress(accounts[0]);
      } else {
        console.log("Metamask Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div style={{marginTop: "5%", marginLeft: "40%"}}>
        <MetaMaskAvatar address={myAddress} size={256}></MetaMaskAvatar>
        <h3>Address: {myAddress}</h3>
      </div>
    </>
  );
}

export default Profile;
