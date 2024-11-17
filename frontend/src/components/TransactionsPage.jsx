import React, { useEffect, useState } from 'react';
import './css/TransactionsPage.css';
import { CONTRACT_ADDRESS, abi } from '../utils/constants';
import { ethers } from 'ethers';
import Navbar from './Navbar';
import {pinata} from "../utils/pinataConfig.ts";

const TransactionsPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [myTransactions, setMyTransactions] = useState("");

  useEffect(() => {
    const getTransactions = async () => {
       try {
          if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const contractAddress = CONTRACT_ADDRESS;
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const txs = await contract.getTransactions();
            const txsData = [];
            const my = [];
            for(var i=0; i<txs.length; i++){
              const link = await pinata.gateways.convert(txs[i]);
              const response = await fetch(link);
              const jsonData = await(response.json());
              const txn = {
                date: jsonData.date,
                transactionHash: jsonData.transactionHash,
                organizationLogoUrl: jsonData.organizationLogoUrl,
                amount: jsonData.amount,
                campaignName: jsonData.campaignName,
                donorAddress: jsonData.donorAddress,
                gasPrice: jsonData.gasPrice,
                gasUsed: jsonData.gasUsed,
                receiverAddress: jsonData.receiverAddress,
              };
              txsData.push(txn);
              // addresses are not case sensitive
              if(txn.donorAddress.toLowerCase()===accounts[0].toLowerCase() || txn.receiverAddress.toLowerCase()===accounts[0].toLowerCase()){
                my.push(txn);
              }
            }
            setAllTransactions(txsData);
            setTransactions(txsData);
            setMyTransactions(my);
            setLoading(false);
          } else {
            console.log("Metamask Not Found");
          }
    } catch (error) {
     console.log(error);
    }
    }
    getTransactions();
  }, []);

 const filterTransactions = () => {
   const txs = [];

   if (!isChecked) {
     setTransactions(myTransactions);
   } else {
     setTransactions(allTransactions);
   }
   setIsChecked(!isChecked);
 };

  return (
    <>
      <Navbar></Navbar>
      <div className="toggle-button-container">
        <div className="toggle-switch">
          <input
            type="checkbox"
            className="toggle-switch-checkbox"
            name="toggleSwitch"
            id="toggleSwitch"
            onChange={filterTransactions}
          />
          <label className="toggle-switch-label" htmlFor="toggleSwitch">
            <span className="toggle-switch-inner" /> 
            <span className="toggle-switch-switch" />
          </label>
        </div>
      </div>
      <div className="transactions-container">
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Campaign Name</th>
                <th>Amount (ETH)</th>
                <th>Date</th>
                <th>Donor Address</th>
                <th>Receiver Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>
                    {tx.transactionHash.substring(0, 5)}...
                    {tx.transactionHash.slice(-5)}
                  </td>
                  <td>{tx.campaignName}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.date}</td>
                  <td>
                    {tx.donorAddress.substring(0, 5)}...
                    {tx.donorAddress.slice(-5)}
                  </td>
                  <td>
                    {tx.receiverAddress.substring(0, 5)}...
                    {tx.receiverAddress.slice(-5)}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        window.open(
                          "http://localhost:3000/receipt?hash=" +
                            tx.transactionHash +
                            "&name=" +
                            tx.campaignName +
                            "&address=" +
                            tx.receiverAddress +
                            "&logo=" +
                            tx.organizationLogoUrl +
                            "&value=" +
                            ethers.parseEther(tx.amount),
                          "mywindow",
                          "menubar=1,resizable=1,width=650,height=1024"
                        );
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
