// Business Logic for BankAccount
function BankAccount(initialDeposit, username, password) {
    this.balance = initialDeposit;
    this.transactions = [];
    this.username = username;
    this.password = password;
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
        showPopupMessage("Insufficient Funds");
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

BankApp.prototype.findAccountByUsername = function(username) {
    for (let id in this.accounts) {
        if (this.accounts[id].username === username) {
            return this.accounts[id];
        }
    }
    return false;
};

BankApp.prototype.findAccountById = function(id) {
    if (this.accounts[id] !== undefined) {
        return this.accounts[id];
    }
    return false;
};

// User Interface Logic
let bankApp = new BankApp();
let currentAccount;

function displayAccountDetails(account) {
    let transactionList = $("ul#transaction-history");
    let htmlForTransactionInfo = "";
    account.transactions.forEach(function(transaction) {
        htmlForTransactionInfo += `<li>${transaction.type}: NGN${transaction.amount}</li>`;
    });
    transactionList.html(htmlForTransactionInfo);

    $("#balance").text(`Balance: NGN${account.getBalance()}`);
    $("#account-holder").text(`Account Holder: ${account.username}`);
    $("#account-number").text(`Account Number: ${account.id}`);
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
    
    // Close pop-up message
    document.getElementById("popup-close").addEventListener("click", hidePopupMessage);
}

$(document).ready(function() {
    // Sign Up
    $("form#signup-form").submit(function(event) {
        event.preventDefault();
        const username = $("#signup-customer-id").val();
        const password = $("#signup-password").val();
        let initialDeposit = 0;  // Default initial deposit as 0, can be modified

        if (bankApp.findAccountByUsername(username)) {
            showPopupMessage("Username already exists. Please choose another one.");
            return;
        }

        let newAccount = new BankAccount(initialDeposit, username, password);
        bankApp.addAccount(newAccount);
        currentAccount = newAccount;
        showPopupMessage("Account created successfully! You can now log in.");

        // Clear the form fields
        $("#signup-customer-id").val("");
        $("#signup-password").val("");
    });

    // Log In
    $("form#login-form").submit(function(event) {
        event.preventDefault();
        const username = $("#login-customer-id").val();
        const password = $("#login-password").val();
        let account = bankApp.findAccountByUsername(username);

        if (account && account.password === password) {
            currentAccount = account;
            displayAccountDetails(currentAccount);
            $("#account-section").show();
            $("#login-form").hide();
            $("#signup-form").hide();
        } else {
            showPopupMessage("Invalid username or password.");
        }

        // Clear the form fields
        $("#login-customer-id").val("");
        $("#login-password").val("");
    });

    // Logout
    $("#logout-btn").click(function() {
        // Hide the account section and show the sign-up and login forms
        $("#account-section").hide();
        $("#login-form").show();
        $("#signup-form").show();
        currentAccount = null; // Clear the current account
    });

    attachAccountListeners();
});

