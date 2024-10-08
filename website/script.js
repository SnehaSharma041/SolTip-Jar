// Ensure you have imported solana-web3.js

const { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, SystemProgram, Transaction } = solanaWeb3;

// DOM Elements
const connectButton = document.getElementById('connectWallet');
const sendTipButton = document.getElementById('sendTip');
const walletAddressDisplay = document.getElementById('walletAddress').querySelector('.data');
const walletBalanceDisplay = document.getElementById('walletBalance').querySelector('.data');
const statusMessage = document.getElementById('statusMessage');
const themeSwitchButton = document.getElementById('themeSwitch');
const transactionList = document.getElementById('transactionList');

// Variables
let provider = null;
let connection = null;
let publicKey = null;

// Get provider function to detect Phantom wallet
function getProvider() {
    if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
            return provider;
        }
    }
    window.open("https://phantom.app/", "_blank");
}

// Connect wallet functionality
connectButton.onclick = async () => {
    provider = getProvider();
    if (!provider) return;
    try {
        const resp = await provider.connect();
        publicKey = resp.publicKey.toString();
        walletAddressDisplay.textContent = publicKey; // Show wallet address
        connection = new Connection(clusterApiUrl('devnet')); // Connect to devnet
        await updateBalance(); // Update balance after connecting
        statusMessage.textContent = 'Wallet connected successfully';
    } catch (err) {
        statusMessage.textContent = 'Failed to connect wallet';
    }
};

// Update Wallet Balance
async function updateBalance() {
    if (publicKey) {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        walletBalanceDisplay.textContent = (balance / LAMPORTS_PER_SOL).toFixed(4); // Display balance
    }
}

// Send tip functionality
sendTipButton.onclick = async () => {
    const tipAmount = parseFloat(document.getElementById('tipAmount').value);
    if (!tipAmount || !publicKey) return;

    try {
        const recipient = new PublicKey(document.getElementById('recipient').value); // Get selected recipient
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(publicKey),
                toPubkey: recipient,
                lamports: tipAmount * LAMPORTS_PER_SOL,
            })
        );
        const { signature } = await provider.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature);
        statusMessage.textContent = Tip of ${tipAmount} SOL sent successfully!;
        addTransactionToList(signature, tipAmount); // Add transaction to list
        await updateBalance(); // Update balance after sending tip
    } catch (err) {
        statusMessage.textContent = 'Transaction failed';
    }
};

// Function to add transaction to the list
function addTransactionToList(signature, amount) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.dataset.signature = signature;
    listItem.dataset.amount = amount;
    listItem.textContent = Tip of ${amount} SOL - Signature: ${signature};

    // Click event for showing transaction details in modal
    listItem.onclick = function () {
        document.getElementById('modalSignature').textContent = signature;
        document.getElementById('modalAmount').textContent = amount;
        document.getElementById('modalTimestamp').textContent = new Date().toLocaleString();
    };

    transactionList.appendChild(listItem);
}

// Theme toggle functionality
themeSwitchButton.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeSwitchButton.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
};

// Initialize tooltips
$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
});