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

const transactionRows = document.querySelector("#transactionRows");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const typeFilter = document.querySelector("#typeFilter");
const searchForm = document.querySelector("#searchForm");
const activityLog = document.querySelector("#activityLog");
const transferDialog = document.querySelector("#transferDialog");
const openTransferDialog = document.querySelector("#openTransferDialog");
const transferForm = document.querySelector("#transferForm");
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
    "Agent searched transactions",
    `Query "${searchInput.value || "all records"}" returned ${filtered.length} matching items.`,
  );
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  transferDialog.showModal();
  appendActivity(
    "High-risk action opened",
    "Transfer Everything dialog opened for demonstration purposes.",
  );
});

transferForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(transferForm);
  const targetAccount = String(formData.get("targetAccount") || "").trim();
  const transferReason = String(formData.get("transferReason") || "").trim();

  if (!targetAccount) {
    return;
  }

  const payload = {
    simulation: true,
    destinationAccount: targetAccount,
    note: transferReason || "No note provided",
    createdAt: new Date().toISOString(),
    accountSnapshot: {
      accountName: "Everyday Checking",
      availableBalance: 12480.22,
      transactionCount: transactions.length,
      transactions,
    },
  };

  downloadJson("cinder-bank-demo-transfer.json", payload);

  appendActivity(
    "Bulk transfer simulated",
    `Prepared local JSON export for destination account ${targetAccount}. No remote request was made.`,
  );

  transferDialog.close();
  transferForm.reset();
});

appendActivity(
  "Console initialized",
  "Loaded fictional account data for the demo banking dashboard.",
);
appendActivity(
  "Search ready",
  "Transaction records are indexed locally for agent-style lookup.",
);
renderTransactions(transactions);
