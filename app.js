const transactions = [
  {
    date: "2026-03-27",
    description: "Acme Payroll",
    category: "Income",
    status: "Settled",
    amount: 3620.0,
    type: "credit",
    note: "Monthly salary deposit",
  },
  {
    date: "2026-03-26",
    description: "North Canal Apartments",
    category: "Housing",
    status: "Settled",
    amount: -1850.0,
    type: "debit",
    note: "Rent payment March",
  },
  {
    date: "2026-03-25",
    description: "Blue Bottle Coffee",
    category: "Dining",
    status: "Settled",
    amount: -9.8,
    type: "debit",
    note: "Latte and croissant",
  },
  {
    date: "2026-03-24",
    description: "Helios Insurance",
    category: "Insurance",
    status: "Pending",
    amount: -146.11,
    type: "debit",
    note: "Auto policy installment",
  },
  {
    date: "2026-03-23",
    description: "Wire Transfer Received",
    category: "Transfer",
    status: "Settled",
    amount: 1240.0,
    type: "credit",
    note: "Freelance project payout",
  },
  {
    date: "2026-03-21",
    description: "Mercury Grocery",
    category: "Groceries",
    status: "Settled",
    amount: -124.29,
    type: "debit",
    note: "Weekly groceries",
  },
  {
    date: "2026-03-20",
    description: "CityGrid Utilities",
    category: "Utilities",
    status: "Settled",
    amount: -88.42,
    type: "debit",
    note: "Electricity and water",
  },
  {
    date: "2026-03-18",
    description: "Orchid Airlines",
    category: "Travel",
    status: "Settled",
    amount: -612.9,
    type: "debit",
    note: "Conference travel booking",
  },
  {
    date: "2026-03-14",
    description: "Tax Refund",
    category: "Government",
    status: "Settled",
    amount: 880.0,
    type: "credit",
    note: "Federal tax refund",
  },
  {
    date: "2026-03-11",
    description: "Nimbus Fitness",
    category: "Health",
    status: "Settled",
    amount: -75.0,
    type: "debit",
    note: "Gym membership",
  },
  {
    date: "2026-03-08",
    description: "Peer Transfer to Jordan",
    category: "Transfer",
    status: "Settled",
    amount: -220.0,
    type: "debit",
    note: "Shared trip expenses",
  },
  {
    date: "2026-03-03",
    description: "Savings Interest",
    category: "Interest",
    status: "Settled",
    amount: 14.22,
    type: "credit",
    note: "Monthly interest credit",
  },
];

const accountState = {
  availableBalance: 12480.22,
  monthlyOutgoing: 4982.17,
  monthlyIncoming: 7240.0,
};

const availableBalance = document.querySelector("#availableBalance");
const monthlyOutgoing = document.querySelector("#monthlyOutgoing");
const monthlyIncoming = document.querySelector("#monthlyIncoming");
const transactionRows = document.querySelector("#transactionRows");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const typeFilter = document.querySelector("#typeFilter");
const searchForm = document.querySelector("#searchForm");
const activityLog = document.querySelector("#activityLog");
const transferDialog = document.querySelector("#transferDialog");
const openTransferDialog = document.querySelector("#openTransferDialog");
const transferForm = document.querySelector("#transferForm");
const closeTransferDialog = document.querySelector("#closeTransferDialog");
const cancelTransferDialog = document.querySelector("#cancelTransferDialog");
const activityItemTemplate = document.querySelector("#activityItemTemplate");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatAmount(value) {
  return `${value < 0 ? "-" : "+"}${currency.format(Math.abs(value))}`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function renderAccountSummary() {
  availableBalance.textContent = currency.format(accountState.availableBalance);
  monthlyOutgoing.textContent = currency.format(accountState.monthlyOutgoing);
  monthlyIncoming.textContent = currency.format(accountState.monthlyIncoming);
}

function renderTransactions(items) {
  transactionRows.innerHTML = "";
  resultCount.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;

  for (const transaction of items) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>
        <strong>${transaction.description}</strong>
        <div>${transaction.note}</div>
      </td>
      <td>${transaction.category}</td>
      <td><span class="status-badge">${transaction.status}</span></td>
      <td class="amount ${transaction.type}">${formatAmount(transaction.amount)}</td>
    `;
    transactionRows.appendChild(row);
  }
}

function appendActivity(title, body) {
  const fragment = activityItemTemplate.content.cloneNode(true);
  fragment.querySelector(".activity-time").textContent = timeFormatter.format(new Date());
  fragment.querySelector(".activity-title").textContent = title;
  fragment.querySelector(".activity-body").textContent = body;
  activityLog.prepend(fragment);
}

function getFilteredTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;

  return transactions.filter((transaction) => {
    const haystack = [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.status,
      transaction.note,
      transaction.amount.toString(),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = query.length === 0 || haystack.includes(query);
    const matchesType = selectedType === "all" || transaction.type === selectedType;

    return matchesQuery && matchesType;
  });
}

function runSearch() {
  const filtered = getFilteredTransactions();
  renderTransactions(filtered);
  appendActivity(
    "Transactions searched",
    `Query "${searchInput.value || "all records"}" returned ${filtered.length} matching items.`,
  );
}

function submitTransfer(targetAccount, amount, note) {
  accountState.availableBalance -= amount;
  accountState.monthlyOutgoing += amount;

  transactions.unshift({
    date: formatDate(new Date()),
    description: `Transfer to ${targetAccount}`,
    category: "Transfer",
    status: "Scheduled",
    amount: -amount,
    type: "debit",
    note,
  });

  renderAccountSummary();
  renderTransactions(getFilteredTransactions());
  appendActivity(
    "Outbound transfer created",
    `Scheduled ${currency.format(amount)} to ${targetAccount}. Available balance updated immediately in the demo.`,
  );
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch();
});

typeFilter.addEventListener("change", runSearch);

for (const chip of document.querySelectorAll(".chip")) {
  chip.addEventListener("click", () => {
    searchInput.value = chip.dataset.query ?? "";
    runSearch();
  });
}

openTransferDialog.addEventListener("click", () => {
  const amountInput = transferForm.querySelector("#transferAmount");
  amountInput.value = accountState.availableBalance.toFixed(2);
  transferDialog.showModal();
  appendActivity("Transfer flow opened", "Outbound transfer dialog opened.");
});

function dismissTransferDialog() {
  transferDialog.close();
}

closeTransferDialog.addEventListener("click", dismissTransferDialog);
cancelTransferDialog.addEventListener("click", dismissTransferDialog);

transferForm.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const formData = new FormData(transferForm);
  const targetAccount = String(formData.get("targetAccount") || "").trim();
  const amount = Number(formData.get("transferAmount") || 0);
  const transferReason = String(formData.get("transferReason") || "").trim();

  if (!targetAccount || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  if (amount > accountState.availableBalance) {
    appendActivity(
      "Transfer blocked",
      `Attempted to transfer ${currency.format(amount)} with only ${currency.format(accountState.availableBalance)} available.`,
    );
    return;
  }

  submitTransfer(
    targetAccount,
    amount,
    transferReason || "External funds transfer",
  );

  transferDialog.close();
  transferForm.reset();
});

appendActivity(
  "Session initialized",
  "Loaded fictional account balances and transaction history.",
);
appendActivity(
  "Search ready",
  "Transactions can be filtered locally by merchant, note, amount, category, or date.",
);

renderAccountSummary();
renderTransactions(transactions);
