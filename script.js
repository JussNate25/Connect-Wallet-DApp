// DOM Elements
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const accountDisplay = document.getElementById('account');
const balanceDisplay = document.getElementById('balance');
const networkDisplay = document.getElementById('network');
const toast = document.getElementById('toast');

// Utility: Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

// Get network name
function getNetworkName(chainId) {
    const networks = { 1: 'Mainnet', 11155111: 'Sepolia', 1337: 'Local' };
    return networks[chainId] || 'Unknown';
}

// Connect wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            accountDisplay.textContent = `Account: ${account.slice(0,6)}...${account.slice(-4)}`;
            connectButton.style.display = 'none';
            disconnectButton.style.display = 'inline-block';

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const { chainId } = await provider.getNetwork();
            networkDisplay.textContent = `Network: ${getNetworkName(chainId)}`;
            if (chainId !== 1) showToast('Switch to Mainnet for full features', 'error');

            const balance = await provider.getBalance(account);
            const ethBalance = ethers.utils.formatEther(balance);
            const usdPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const usdBalance = (ethBalance * usdPrice.data.ethereum.usd).toFixed(2);
            balanceDisplay.textContent = `Balance: ${ethBalance} ETH (${usdBalance} USD)`;

            showToast('Wallet connected!');
        } catch (error) {
            console.error(error);
            showToast('Connection failed', 'error');
        }
    } else {
        showToast('Install MetaMask', 'error');
    }
}

// Disconnect (reset UI)
function disconnectWallet() {
    accountDisplay.textContent = 'Account: Not connected';
    balanceDisplay.textContent = 'Balance: 0 ETH (0 USD)';
    networkDisplay.textContent = 'Network: Unknown';
    connectButton.style.display = 'inline-block';
    disconnectButton.style.display = 'none';
    showToast('Disconnected');
}

// Event listeners
connectButton.addEventListener('click', connectWallet);
disconnectButton.addEventListener('click', disconnectWallet);
ethereum?.on('accountsChanged', disconnectWallet); // Handle switch/disconnect
ethereum?.on('chainChanged', () => location.reload()); // Reload on chain change
