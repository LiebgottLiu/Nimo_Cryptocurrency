# Nimo Test Exercise – Cryptocurrency Microservices

## Project Overview

This project is a **test exercise for Nimo**, implementing two serverless
microservices on AWS using **Node.js**:

The project demonstrates **AWS Serverless architecture**, including **AWS
Lambda, API Gateway, DynamoDB, SES**, and integrates with **CoinGecko API** for
cryptocurrency data.

## Microservices

1. **Email Cryptocurrency Current Price**

**User Story**  
As an investor, I want to query the current price of a specific cryptocurrency
and receive a graceful email about the result.

**Functionality**

- Fetch real-time cryptocurrency prices from the CoinGecko API
- Send the result to the user via AWS SES
- Store the search record in DynamoDB

2. **Search History**

**User Story**  
As an investor, I want to retrieve all my historical cryptocurrency search
records.

**Functionality**

- Query DynamoDB for historical search data
- Return cryptocurrency name, price, currency, and search timestamp

---

## Usage

### 1️⃣ Local Usage

To run the project locally:

1. Install dependencies:

```bash
npm install
```

2. Create a .env file in the project root: AWS_REGION=your_region
   COINGECKO_API_KEY=your-api-key-if-needed

## Note:

- SES_SENDER_EMAIL must be verified in AWS SES.

- CoinGecko API key is optional unless required by your plan.

3. Start the application:

```bash
npm start
```

### 2️⃣ AWS Serverless Usage

The project is deployed using AWS Serverless architecture and is publicly
accessible via API Gateway.

API Endpoints 🔹 Service 1 – Email Cryptocurrency Current Price

Endpoint: POST /crypto/price

Full URL:

https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/price

Description: Fetches the current price of a cryptocurrency, sends the result via
email, and stores the query history.

Request Body (JSON) { "crypto": "bitcoin", "email": "test@test.com" }

Field Type Required Description crypto string ✅ Cryptocurrency name (e.g.
bitcoin) email string ✅ Valid email address

Response Example (200 OK) { "message": "Current price of bitcoin has been sent
to test@test.com", "crypto": "bitcoin", "price": xxxx, "currency": "USD",
"lastUpdatedAt": "xxx-xx-xx" }

curl Example curl -X POST \
 https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/price \
 -H "Content-Type: application/json" \
 -d '{ "crypto": "bitcoin", "email": "test@test.com" }'

Postman Example

Method: POST

URL:

https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/price

Headers:

Content-Type: application/json

Body → raw → JSON:

{ "crypto": "bitcoin", "email": "test@test.com" }

🔹 Service 2 – Search History

Endpoint: GET /crypto/history

Full URL Example:

https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/history?email=test@test.com

Description: Returns all historical cryptocurrency queries associated with the
provided email address.

Query Parameters Parameter Type Required Description email string ✅ Email
address Response Example (200 OK) [ { "crypto": "bitcoin", "searchedAt":
"xxxx-xx-xx", "price": xxxx, "currency": "xxx" }, { "crypto": "ethereum",
"searchedAt": "xxxx-xx-xx", "price": xxxx, "currency": "xxx" } ]

curl Example curl
"https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/history?email=test@test.com"

Postman Example

Method: GET

URL:

https://kdcv6q796b.execute-api.ap-southeast-4.amazonaws.com/Prod/crypto/history

Params:

Key Value email test@test.com

API Status Codes Code Description 200 Request succeeded 400 Invalid or missing
parameters 500 Internal server error (DB, SES, API failure) Environment
Variables Variable Description AWS_REGION AWS region (e.g. ap-southeast-4)
CRYPTO_HISTORY_TABLE DynamoDB table name SES_SENDER_EMAIL Verified SES sender
email COINGECKO_API_KEY Optional CoinGecko API key

Technology Stack

Node.js

AWS Lambda

AWS API Gateway

AWS DynamoDB

AWS SES

CoinGecko API

Git & GitHub

GitHub Actions (CI/CD)

Jest (Unit Testing)

Notes & Best Practices

Ensure SES_SENDER_EMAIL is verified in AWS SES.

Cryptocurrency names must be supported by CoinGecko (e.g. bitcoin, ethereum).

DynamoDB uses GSI (email-index) for efficient history lookup.

All services are deployed 100% serverless.

Consider adding pagination to /history if the dataset grows large.
