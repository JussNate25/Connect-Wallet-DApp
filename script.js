// check if MetaMask is installed
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      document.getElementById("walletAddress").innerText = `Address: ${account}`;

      // use ethers.js to get balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      const balanceInEth = ethers.utils.formatEther(balance);
      document.getElementById("walletBalance").innerText = `Balance: ${balanceInEth} ETH`;
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("MetaMask not detected! Please install MetaMask.");
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);
