# Fake Bank App

Static fictional banking dashboard for demos.

## What it does

- Shows mock account balances and transaction history
- Supports local search across transactions
- Includes a "Transfer Everything" simulation for nefarious-agent demos
- Generates a downloadable JSON payload locally instead of sending data to a server

## Safety

This app is intentionally fictional:

- no live banking connection
- no real account data
- no backend
- no network exfiltration in the transfer simulation

## Local run

Open `index.html` directly in a browser.

## GitHub Pages

This repo includes a GitHub Actions workflow that deploys the site to GitHub Pages on pushes to `main`.
