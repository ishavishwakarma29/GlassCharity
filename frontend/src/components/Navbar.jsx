import React, { useEffect, useState } from "react";
import "./css/Navbar.css";
import favicon from "./assets/favicon.ico";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userAddress, setUserAddress] = useState("");


   async function getAccountAddress() {
     try {
       if (!window.ethereum) return alert("please install metamask!");
       const accounts = await window.ethereum.request({
         method: "eth_requestAccounts",
       });
       if (accounts.length) {
         setUserAddress(accounts[0]);
       } else console.log("an error occured");
     } catch (error) {
       console.log(error);
     }
   }


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

   useEffect(() => {
     getAccountAddress();
   }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={favicon} className="icon"></img>
            <div className="title">Glass Charity</div>
            <div className="subtitle">
              Explore all active campaigns and support a cause today!
            </div>
        </div>
        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <span className="link"><a href="/home">Home</a></span>
          <span className="link"><a href="/create-campaign">Create a Campaign</a></span>
          <span className="address"><a>{userAddress}</a></span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
