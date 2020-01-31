# Destiny Quartermaster

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Setup

1. Register for an api key here https://www.bungie.net/en/Application and provide the following registration details.
    - OAuth Client Type - Confidential
    - Redirect URL - https://127.0.0.1:3000/return.html
    - Scope should include
        - Read your Destiny 2 information (Vault, Inventory, and Vendors), as well as Destiny 1 Vault and Inventory data.
        - Move or equip Destiny gear and other items.
    - Origin Header - https://127.0.0.1:3000
2. Put your API key and the client id and secret into the BUNGIE_API_KEY, BUNGIE_API_ID and BUNGIE_API_SECRET variables in the .env.development file variables. Make sure this is never committed.
