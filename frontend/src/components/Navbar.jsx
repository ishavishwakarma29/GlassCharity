import React, { useState, useEffect } from 'react';
import './css/Navbar.css';
import favicon from "./assets/favicon.ico";
import { useLocation, Link } from "react-router-dom";

function Navbar() {
  const [userAddress, setUserAddress] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/home");
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  async function getAccountAddress() {
     try {
       if (!window.ethereum) return alert("please install metamask!");
       const accounts = await window.ethereum.request({
         method: "eth_requestAccounts",
       });
       if (accounts.length) {
         setUserAddress(accounts[0]);
       } else console.log("an error occurred");
     } catch (error) {
       console.log(error);
     }
   }

   useEffect(() => {
     getAccountAddress();
     setActiveLink(location.pathname); // Set the active link based on current route
   }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={favicon} className="icon" alt="favicon" />
        <div className="title">Glass Charity</div>
        <div className="subtitle">
          Explore all active campaigns and support a cause today!
        </div>
      </div>
      <ul className="navbar-links">
        <li className={`link ${activeLink === '/home' ? 'active' : ''}`}> 
          <Link to="/home">Home</Link>
        </li>
        <li className={`link ${activeLink === '/create-campaign' ? 'active' : ''}`}>
          <Link to="/create-campaign">Create a Campaign</Link>
        </li>
         <li className={`link ${activeLink === '/transactions' ? 'active' : ''}`}>
          <Link to="/transactions">Transactions</Link>
        </li>
        <li onClick={toggleDropdown} className="dropdown address">
          {userAddress.substring(0, 5)}...{userAddress.slice(-5)}
          <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <li>Profile</li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
