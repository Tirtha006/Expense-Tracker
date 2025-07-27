document.addEventListener("DOMContentLoaded", () => {
    const balanceEl = document.getElementById("balance");
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateLocalStorage() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function calculateBalance() {
        const income = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        balanceEl.textContent = (income - expense).toFixed(2);
    }

    function renderTransactions() {
        transactionList.innerHTML = ""; // Clear old list
        transactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.classList.add("transaction-item", transaction.type);
            li.innerHTML = `
                ${transaction.name}: $${transaction.amount.toFixed(2)}
                <button class="delete-btn" data-index="${index}">x</button>
            `;
            transactionList.appendChild(li);
        });
        calculateBalance();
    }

    transactionList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            transactions.splice(index, 1);
            updateLocalStorage();
            renderTransactions();
        }
    });

    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("transactionName").value.trim();
        const amount = parseFloat(document.getElementById("transactionAmount").value);
        const type = document.getElementById("transactionType").value;

        if (!name || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid name and amount.");
            return;
        }

        transactions.push({
            name,
            amount: Math.abs(amount),
            type
        });

        updateLocalStorage();
        renderTransactions();
        transactionForm.reset();
    });

    renderTransactions(); // initial load
});
