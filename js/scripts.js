// Business Logic for BankAccount
function BankAccount(initialDeposit) {
    this.balance = initialDeposit;
    this.transactions = [];
}

BankAccount.prototype.deposit = function(amount) {
    this.balance += amount;
    this.transactions.push({ type: "Deposit", amount: amount });
};

BankAccount.prototype.withdraw = function(amount) {
    if (amount <= this.balance) {
        this.balance -= amount;
        this.transactions.push({ type: "Withdrawal", amount: amount });
    } else {
        showPopupMessage("Insufficient Funds")
    }
};

BankAccount.prototype.getBalance = function() {
    return this.balance;
};

// Business Logic for BankApp
function BankApp() {
    this.accounts = {};
    this.currentId = 0;
}

BankApp.prototype.addAccount = function(account) {
    account.id = this.assignId();
    this.accounts[account.id] = account;
};

BankApp.prototype.assignId = function() {
    this.currentId += 1;
    return this.currentId;
};

BankApp.prototype.findAccount = function(id) {
    if (this.accounts[id] !== undefined) {
        return this.accounts[id];
    }
    return false;
};

// User Interface Logic
let bankApp = new BankApp();

function displayAccountDetails(account) {
    let transactionList = $("ul#transactions");
    let htmlForTransactionInfo = "";
    account.transactions.forEach(function(transaction) {
        htmlForTransactionInfo += `<li>${transaction.type}: $${transaction.amount}</li>`;
    });
    transactionList.html(htmlForTransactionInfo);

    $("#balance").text(`Balance: $${account.getBalance()}`);
}

function showPopupMessage(message) {
    const popup = document.getElementById("popup-message");
    document.getElementById("popup-text").textContent = message;
    popup.classList.remove("hidden");
    popup.style.display = "block";
}

function hidePopupMessage() {
    const popup = document.getElementById("popup-message");
    popup.classList.add("hidden");
    popup.style.display = "none";
}

function attachAccountListeners() {
    $("form#transaction-form").submit(function(event) {
        event.preventDefault();
        const selectedAction = $("input[name='action']:checked").val();
        const transactionAmount = parseFloat($("#transaction-amount").val());

        if (selectedAction === "deposit") {
            currentAccount.deposit(transactionAmount);
        } else if (selectedAction === "withdraw") {
            currentAccount.withdraw(transactionAmount);
        }

        displayAccountDetails(currentAccount);
        $("#transaction-amount").val("");
    });
    
}

    // Close pop-up message
    document.getElementById("popup-close").addEventListener("click", hidePopupMessage);


$(document).ready(function() {
    $("form#new-account").submit(function(event) {
        event.preventDefault();
        const initialDeposit = parseFloat($("#initial-deposit").val());
        let newAccount = new BankAccount(initialDeposit);
        bankApp.addAccount(newAccount);
        currentAccount = newAccount;  // Save the current account globally
        displayAccountDetails(currentAccount);
        $("#account-section").show();
        $("#initial-deposit").val("");
    });

    attachAccountListeners();
});
