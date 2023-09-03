document.addEventListener('DOMContentLoaded', function () {
    // Check if wallet data exists in local storage
    let walletData = JSON.parse(localStorage.getItem('walletData')) || [];
    let mainWalletBalance = parseFloat(localStorage.getItem('mainWalletBalance')) || 2.0; // Initial main wallet balance

    // Function to save wallet data in local storage
    function saveWalletData() {
        localStorage.setItem('walletData', JSON.stringify(walletData));
        localStorage.setItem('mainWalletBalance', mainWalletBalance.toFixed(2));
    }

    // Function to populate the wallet list
    function populateWalletList() {
        const walletList = document.querySelector('.wallet-list');
        walletList.innerHTML = '';

        walletData.forEach(function (wallet, index) {
            const walletItem = document.createElement('div');
            walletItem.className = 'wallet-item';
            walletItem.innerHTML = `
                <p class="wallet-name">${wallet.name}</p>
                <p class="wallet-balance">Balance: ${wallet.balance.toFixed(2)} BTC</p>
                <button class="delete-wallet-btn" data-index="${index}">Delete</button>
            `;
            walletList.appendChild(walletItem);

            // Add event listener for the delete button
            const deleteBtn = walletItem.querySelector('.delete-wallet-btn');
            deleteBtn.addEventListener('click', function () {
                // Remove the wallet from the array
                walletData.splice(index, 1);

                // Save the updated wallet data in local storage
                saveWalletData();

                // Repopulate the wallet list
                populateWalletList();
            });
        });
    }

    // Function to update the main wallet balance
    function updateMainWalletBalance() {
        const mainWalletBalanceElement = document.getElementById('main-wallet-balance');
        mainWalletBalanceElement.textContent = `Balance: ${mainWalletBalance.toFixed(2)} BTC`;
    }

    // Function to handle creating a new wallet
    document.getElementById('create-wallet-btn').addEventListener('click', function () {
        // Create a new wallet data object (you can customize this part)
        const newWallet = {
            name: 'My Wallet',
            balance: 0.00, // New wallets start with zero balance
        };

        // Add the new wallet to the existing wallet data
        walletData.push(newWallet);

        // Save the updated wallet data in local storage
        saveWalletData();

        // Populate the wallet list with the updated data
        populateWalletList();
    });

    // Function to handle deposits to the main wallet
    document.getElementById('deposit-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const depositAmount = parseFloat(document.getElementById('deposit-amount').value);

        if (!isNaN(depositAmount) && depositAmount > 0) {
            // Add the deposited amount to the main wallet
            mainWalletBalance += depositAmount;

            // Update the main wallet balance display
            updateMainWalletBalance();

            // Clear the deposit input field
            document.getElementById('deposit-amount').value = '';

            // Save the updated main wallet balance in local storage
            saveWalletData();
        }
    });

    // Function to handle wallet transfers
    document.getElementById('transfer-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const recipientName = document.getElementById('recipient').value;
        const transferAmount = parseFloat(document.getElementById('amount').value);

        if (!isNaN(transferAmount) && transferAmount > 0) {
            // Find the sender wallet (main wallet)
            const senderWallet = {
                name: 'Main Wallet',
                balance: mainWalletBalance,
            };

            // Find the recipient wallet by name
            const recipientWallet = walletData.find(wallet => wallet.name === recipientName);

            if (recipientWallet) {
                // Check if the sender has enough balance for the transfer
                if (senderWallet.balance >= transferAmount) {
                    // Update sender and recipient wallet balances
                    senderWallet.balance -= transferAmount;
                    recipientWallet.balance += transferAmount;

                    // Save the updated wallet data in local storage
                    saveWalletData();

                    // Update the main wallet balance display
                    updateMainWalletBalance();

                    // Clear the transfer input fields
                    document.getElementById('recipient').value = '';
                    document.getElementById('amount').value = '';
                } else {
                    alert('Insufficient balance for the transfer.');
                }
            } else {
                alert('Recipient wallet not found.');
            }
        }
    });

    // Populate the wallet list on page load
    populateWalletList();
    updateMainWalletBalance();
});
