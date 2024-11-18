// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateCampaignForm from "./components/CreateCampaignForm";
import LandingPage from "./components/LandingPage";
import "./App.css";
import CampaignPage from "./components/CampaignPage";
import DonationReceipt from "./components/DonationReceipt";
import TransactionsPage from "./components/TransactionsPage";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/create-campaign" element={<CreateCampaignForm />} />
          <Route path="/campaign-page" element={<CampaignPage />} />
          <Route path="/receipt" element={<DonationReceipt />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
