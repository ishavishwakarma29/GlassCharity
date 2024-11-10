// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonationTracker {
    address public owner;
    uint256 public campaignCount;

    // Struct for each donation
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // Struct for each campaign
    struct Campaign {
        uint256 id;
        string name;
        string description;
        uint256 targetAmount;
        uint256 totalDonated;
        bool isActive;
    }

    // Mapping to store all campaigns
    mapping(uint256 => Campaign) public campaigns;

    //mapping for donations
    mapping(uint256 => Donation[]) donation;

    // Event for each donation
    event NewDonation(uint256 indexed campaignId, address indexed donor, uint256 amount);

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Constructor to set the contract deployer as the owner
    constructor() {
        owner = msg.sender;
        campaignCount = 0;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _name, 
        string memory _description, 
        uint256 _targetAmount
    ) public onlyOwner {
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            name: _name,
            description: _description,
            targetAmount: _targetAmount,
            totalDonated: 0,
            isActive: true
        });
        campaignCount++;
    }

    // Function to donate to a specific campaign
    function donate(uint256 _campaignId) public payable {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        require(msg.value > 0, "Donation must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.totalDonated += msg.value;

        // Add the new donation to the donations array
        donation[_campaignId].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit NewDonation(_campaignId, msg.sender, msg.value);
    }

    // Function to end a campaign
    function endCampaign(uint256 _campaignId) public onlyOwner {
        campaigns[_campaignId].isActive = false;
    }

    // Function to get donations for a specific campaign
    function getDonations(uint256 _campaignId) 
        public view returns (Donation[] memory) 
    {
        return donation[_campaignId];
    }

    function getAllCampaigns() public view returns (Campaign[] memory)
    {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint256 i = 0; i < campaignCount; i++) {
            allCampaigns[i]=campaigns[i];
        }
        return allCampaigns;
    }
}
