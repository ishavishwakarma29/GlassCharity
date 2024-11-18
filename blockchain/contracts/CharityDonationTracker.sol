// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonationTracker {
    address public owner;
    uint256 public campaignCount;
    uint256 public transactionCount;

    // Struct for each campaign
    struct Campaign {
        address creatorAddress;
        uint256 id;
        string name;
        string description;
        uint256 targetAmount;
        uint256 totalDonated;
        bool isActive;
        string imageHash;
    }

    

    // Mapping to store transactions
    mapping(uint256 => string) public transactions;

    // Mapping to store index 

    // Mapping to store all campaigns
    mapping(uint256 => Campaign) public campaigns;

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Constructor to set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
        campaignCount = 0;
        transactionCount = 0;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _name, 
        string memory _description, 
        uint256 _targetAmount,
        string memory ipfshash
    ) public {
        campaigns[campaignCount] = Campaign({
            creatorAddress: msg.sender,
            id: campaignCount,
            name: _name,
            description: _description,
            targetAmount: _targetAmount,
            totalDonated: 0,
            isActive: true,
            imageHash: ipfshash
        });
        campaignCount++;
    }

    // Function to donate to a specific campaign
    function donate(uint256 _campaignId) public payable {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        require(msg.value > 0, "Donation must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.totalDonated += msg.value;

        address payable rec = payable(campaign.creatorAddress);
        rec.transfer(msg.value);
    }

    // Function to save a transaction
    function saveTransaction(string memory ipfshash) public {
        transactions[transactionCount] = ipfshash;
        transactionCount++;
    }

    //Function to get transaction
    function getTransactions() public view returns (string[] memory){
        string[] memory allTransactions = new string[](transactionCount);
        for (uint256 i = 0; i < transactionCount; i++) {
            allTransactions[i]=transactions[i];
        }
        return allTransactions;
    }

    // Function to end a campaign
    function endCampaign(uint256 _campaignId) public {
        campaigns[_campaignId].isActive = false;
    }

    function getAllCampaigns() public view returns (Campaign[] memory)
    {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint256 i = 0; i < campaignCount; i++) {
            allCampaigns[i]=campaigns[i];
        }
        return allCampaigns;
    }

    function getCampaignById(uint256 _campaignId) public view returns (Campaign memory)
    {
        return campaigns[_campaignId];
    }
}
