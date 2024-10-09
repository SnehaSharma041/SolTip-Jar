let walletAddress = '';
let walletBalance = 0;
const goalMap = {};

// Function to connect to Phantom Wallet
async function connectPhantomWallet() {
    if (window.solana && window.solana.isPhantom) {
        try {
            const wallet = await window.solana.connect({ onlyIfTrusted: false });
            walletAddress = wallet.publicKey.toString();
            document.querySelector('#walletAddress .data').innerText = walletAddress;
            updateWalletBalance();  // Update the wallet balance after connection
            showNotification('Connected to wallet!');
        } catch (err) {
            console.error('Connection to wallet failed:', err);
            showNotification('Failed to connect to wallet.');
        }
    } else {
        showNotification('Phantom Wallet not found!');
        console.error('Phantom Wallet not found!');
    }
}

// Function to update wallet balance
async function updateWalletBalance() {
    if (!walletAddress) {
        console.warn('Wallet is not connected.');
        return;
    }

    const connection = new solanaWeb3.Connection('https://api.devnet.solana.com');
    const balance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
    walletBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
    document.querySelector('#walletBalance .data').innerText = walletBalance.toFixed(2);
}

// Function to send tips
async function sendTip() {
    const recipient = document.getElementById('recipient').value;
    const tipAmount = parseFloat(document.getElementById('tipAmount').value);

    if (!recipient || !tipAmount || tipAmount <= 0) {
        showNotification('Please enter a valid recipient and tip amount!');
        return;
    }

    const connection = new solanaWeb3.Connection('https://api.devnet.solana.com');
    const transaction = new solanaWeb3.Transaction();
    const destinationPublicKey = new solanaWeb3.PublicKey(recipient);
    
    const lamports = tipAmount * solanaWeb3.LAMPORTS_PER_SOL;

    transaction.add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: new solanaWeb3.PublicKey(walletAddress),
            toPubkey: destinationPublicKey,
            lamports,
        })
    );

    transaction.feePayer = new solanaWeb3.PublicKey(walletAddress);
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    try {
        const { signature } = await window.solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature);

        showNotification(`Successfully sent ${tipAmount} SOL to ${recipient}!`);
        addTransactionToList(signature, tipAmount);
        updateWalletBalance();
        updateDonationGoal(tipAmount);
    } catch (error) {
        console.error('Error sending tip:', error);
        showNotification('Failed to send tip. Please try again.');
    }
}

// Function to show notifications
function showNotification(message) {
    document.getElementById('statusMessage').innerText = message;
}

// Function to add transactions to the list
function addTransactionToList(signature, amount) {
    const transactionList = document.getElementById('transactionList');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `Sent ${amount} SOL. Signature: <span class="text-primary">${signature}</span>`;
    transactionList.appendChild(listItem);
}

// Function to update donation goal progress
function updateDonationGoal(amount) {
    const goalSelect = document.getElementById('donationGoal');
    const selectedGoal = parseInt(goalSelect.value);
    
    if (!goalMap[selectedGoal]) {
        goalMap[selectedGoal] = 0;
    }
    goalMap[selectedGoal] += amount;
    
    const progressBar = document.getElementById('goalProgressBar');
    const progress = (goalMap[selectedGoal] / selectedGoal) * 100;
    
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}

// Theme switcher
document.getElementById('themeSwitch').addEventListener('click', function() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', currentTheme === 'light');
    document.body.classList.toggle('light-mode', currentTheme === 'dark');
});

// Add event listeners for connect wallet and send tip buttons
document.getElementById('connectWallet').addEventListener('click', connectPhantomWallet);
document.getElementById('sendTip').addEventListener('click', sendTip);
