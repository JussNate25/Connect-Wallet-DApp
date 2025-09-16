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

// Check if in MetaMask mobile app
function isMetaMaskMobile() {
    return /MetaMask/i.test(navigator.userAgent);
}

// Connect wallet
async function connectWallet() {
    // Mobile app deep-link or browser extension
    if (!window.ethereum && isMetaMaskMobile()) {
        // Redirect to MetaMask app
        window.location.href = 'metamask://';
        showToast('Opening MetaMask app...', 'success');
        return;
    }
    if (window.ethereum) {
        try {
            // Request accounts
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            accountDisplay.textContent = `Account: ${account.slice(0,6)}...${account.slice(-4)}`;
            connectButton.style.display = 'none';
            disconnectButton.style.display = 'inline-block';

            // Get network and balance
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const { chainId } = await provider.getNetwork();
            networkDisplay.textContent = `Network: ${getNetworkName(chainId)}`;
            if (chainId !== 1 && chainId !== 11155111) {
                showToast('Please switch to Mainnet or Sepolia', 'error');
            }

            const balance = await provider.getBalance(account);
            const ethBalance = ethers.utils.formatEther(balance);
            let usdBalance = '0';
            try {
                const usdPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                usdBalance = (ethBalance * usdPrice.data.ethereum.usd).toFixed(2);
            } catch (apiError) {
                console.error('USD fetch failed:', apiError);
            }
            balanceDisplay.textContent = `Balance: ${ethBalance} ETH (${usdBalance} USD)`;

            showToast('Wallet connected!');
        } catch (error) {
            console.error('Connection error:', error);
            showToast('Connection failed: ' + error.message, 'error');
        }
    } else {
        showToast('Install MetaMask or open in MetaMask app', 'error');
        if (confirm('MetaMask not detected. Open MetaMask app?')) {
            window.location.href = 'metamask://';
        }
    }
}

// Disconnect wallet
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
if (window.ethereum) {
    ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnectWallet();
        else connectWallet();
    });
    ethereum.on('chainChanged', () => location.reload());
                }
