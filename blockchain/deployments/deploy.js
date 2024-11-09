const hre=require("hardhat");
async function main() {
  const contractFactory = await hre.ethers.getContractFactory("CharityDonationTracker");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  console.log("contract deployed to address : " + await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
