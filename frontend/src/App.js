// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import CreateCampaignForm from "./components/CreateCampaignForm";
import DonateToCampaignForm from "./components/DonateToCampaignForm";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-campaign" element={<CreateCampaignForm />} />
          <Route path="/donate" element={<DonateToCampaignForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
