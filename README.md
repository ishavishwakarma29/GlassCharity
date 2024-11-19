# Glass Charity
<img src="https://github.com/user-attachments/assets/6e0ec517-7162-4a0c-ba41-97fc2c24f8fd" width="100" height="100" alt="img">

A **blockchain-based decentralized application (dApp)** that ensures transparency in Charity donations without any intermediary. Campaign creations and donations take place thorugh a smart contract.
***
## 🌟 Features

- **Transparency**: Donations are directly sent to the charity address.
- **Immutable Records**: Transaction data stored on the blockchain cannot be altered.
- **Decentralized Control**: Removes intermediaries, reducing fraud and operational costs.
- **Downloadable Receipts**: Donation receipts can be downloaded which contain all the information about a transaction.
- **End Campaign**: Campaign creator can end the campaign, the campaign becomes inactive after that.
- **Filter campaign and transactions**: The user can filter campaigns and transactions after which he/shey/they can see only their campaigns/transactions.
- **Set target amount, logo, description, title**: Campaign creator can give campaign logo, title, description and target amount as input in form.
- **User-friendly Interface**: Seamless interaction with blockchain for donors and charities.
****
## 🛠 Tech Stack

- **Frontend**: React.js
- **Blockchain**: Solidity, Hardhat, Sepolia testnet 
- **Tools**: Metamask, Alchemy, Pinata IPFS

****
## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MetaMask Wallet](https://metamask.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ishavishwakarma29/GlassCharity.git
   cd GlassCharity
2. Install Dependencies:
    ```bash
   cd frontend
   npm install
   cd ..
   cd blockchain
   npm install
3. Create .env in blockchain directory which contains two variables -: API_URL(alchemy api url) and PRIVATE_KEY(Metamask wallet private key)
4. Compile the smart contract :
     ```bash
   npx hardhat compile
5. Deploy the smart contract :
   ```bash
   npx hardhat run deployments/deploy.js --network sepolia
6. Create constants.js in frontend/src/utils directory :
7. Create variables abi(smart contract abi), API_URL(Alchemy Api url), PRIVATE_KEY(Metamask wallet private key), CONTRACT_ADDRESS, PINATA_API_KEY, PINATA_API_SECRET, PINATA_API_JWT, PINATA_GATEWAY (pinata api credentials) in constants.js and export all of them
8. Start the development server:
   ```bash
   cd frontend
   npm start
9. Open the application in your browser at "http://localhost:3000"
***
## 📷 Screenshots
### Landing page
![Screenshot (1112)](https://github.com/user-attachments/assets/b18a1087-4ccd-4b0b-a4a5-ed7ecc30847b)
***
### Home Page
- The toggle button in top left can filter the campaigns.
- inactive campaigns have gray color.
![Screenshot (1114)](https://github.com/user-attachments/assets/2f538aa7-9f7c-4dda-816a-036bbfd41c4a)
***
### Campaign Page
- Only campaign creator can end the campaign
- The sidepane bar gets filled as donations are made.
![Screenshot (1115)](https://github.com/user-attachments/assets/49a84b64-79d4-4dc2-92a3-45237ca7f511)
***
### Transactions Page
- The toggle button in top left can filter the transactions.
- The view button in each transaction can be used to view the transaction receipt.
![Screenshot (1110)](https://github.com/user-attachments/assets/77aaec8c-8d2b-45fe-ba03-a9fd4fcc0fdd)
***
### Create Campaign form
![Screenshot (1109)](https://github.com/user-attachments/assets/0e46e0f8-af51-4b2c-82fe-bf225966f124)
***
### Downloadable Receipt
![Screenshot (1113)](https://github.com/user-attachments/assets/446d8346-4586-47be-ac40-d28efce87b9b)
***
### Profile
![Screenshot (1111)](https://github.com/user-attachments/assets/c7d210ad-c16a-4d4b-8974-21d6e078e5e8)
***
## 📽️ Demo Video
![Demo](https://youtu.be/CdnUNf0Thsc)
***
## 🔮Future work
- Identity verification for campaign creators
- Search campaigns and transactions
- Upload images in charity description
***

## 👧Contributed By-:
[Isha Vishwakarma](https://github.com/ishavishwakarma29)










