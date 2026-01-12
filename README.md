# Nimo Test Exercise – Cryptocurrency Microservices

> **Two small serverless microservices (Node.js) deployed on AWS — Email current crypto price & Search history.**

## Table of contents

* [Project Overview](#project-overview)
* [Microservices](#microservices)

  * [Email Cryptocurrency Current Price](#email-cryptocurrency-current-price)
  * [Search History](#search-history)
* [Quick Start (Local)](#quick-start-local)
* [AWS Serverless Usage / Deployment](#aws-serverless-usage--deployment)
* [API Reference](#api-reference)

  * [Service 1 — POST /crypto/price](#service-1---post-cryptoprice)
  * [Service 2 — GET /crypto/history](#service-2---get-cryptohistory)
* [Environment Variables](#environment-variables)
* [DynamoDB Schema / Indexes](#dynamodb-schema--indexes)
* [Testing](#testing)
* [Tech Stack](#tech-stack)
* [Notes & Best Practices](#notes--best-practices)
* [Contributing](#contributing)
* [License](#license)

---

## Project Overview

This project is a **test exercise for Nimo** that implements two serverless
microservices on AWS using **Node.js**. It demonstrates a typical serverless
architecture using **AWS Lambda**, **API Gateway**, **DynamoDB**, and **SES**,
and integrates with the **CoinGecko API** for cryptocurrency price data.

## Microservices

### 1. Email Cryptocurrency Current Price

**User story**: As an investor, I want to query the current price of a specific
cryptocurrency and receive a graceful email with the result.

**What it does**:

* Fetches live cryptocurrency price data (CoinGecko).
* Sends a formatted email to the user via AWS SES.
* Persists the search record to DynamoDB for later retrieval.

### 2. Search History

**User story**: As an investor, I want to retrieve all my historical
cryptocurrency search records.

**What it does**:

* Queries DynamoDB for historical search data filtered by user email.
* Returns cryptocurrency name, price, currency, and search timestamp.

---

## Quick Start (Local)

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in project root with the following variables (example):

```
AWS_REGION=ap-southeast-4
SES_SENDER_EMAIL=verified-sender@example.com
CRYPTO_HISTORY_TABLE=CryptoHistory
COINGECKO_API_KEY=your_coingecko_key_optional
```

> **Note:** `SES_SENDER_EMAIL` must be verified in the AWS SES console for the
> region you run the service in.

3. Start the app locally (project may include local runners / mocks):

```bash
npm start
```

If you include AWS SDK calls locally, configure credentials using the AWS CLI or
environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).

---

## AWS Serverless Usage / Deployment

> The project is intended to be deployed 100% serverless. Typical deployment
> options are AWS SAM, the Serverless Framework, or CloudFormation.

Minimum deployment checklist:

* Configure AWS credentials and region.
* Ensure `SES_SENDER_EMAIL` is verified in SES for the target region.
* Create the DynamoDB table (or let IaC create it) and ensure a GSI on `email` is configured.
* Deploy the Lambda functions and API Gateway endpoints.

> Example (SAM / CLI):
>
> 1. `sam build`
> 2. `sam deploy --guided` (or use CI/CD with GitHub Actions)

---

## API Reference

### Service 1 — POST /crypto/price

**Full URL (example)**

```
POST https://<api-id>.execute-api.<region>.amazonaws.com/Prod/crypto/price
```

**Description**: Fetch the current price for a cryptocurrency, send the
result by email, and store the search in DynamoDB.

**Request body (JSON)**

```json
{
  "crypto": "bitcoin",
  "email": "test@test.com",
  "currency": "USD" // optional, defaults to USD if not provided
}
```

**Response (200 OK)**

```json
{
  "message": "Current price of bitcoin has been sent to test@test.com",
  "crypto": "bitcoin",
  "price": 12345.67,
  "currency": "USD",
  "lastUpdatedAt": "2026-01-12T06:30:00Z"
}
```

**Errors**

* `400` — missing or invalid parameters (e.g. invalid email, missing `crypto`).
* `500` — backend failure (DynamoDB, SES, CoinGecko API errors).

**curl example**

```bash
curl -X POST \
  https://<api-id>.execute-api.<region>.amazonaws.com/Prod/crypto/price \
  -H "Content-Type: application/json" \
  -d '{ "crypto": "bitcoin", "email": "test@test.com" }'
```

---

### Service 2 — GET /crypto/history

**Full URL (example)**

```
GET https://<api-id>.execute-api.<region>.amazonaws.com/Prod/crypto/history?email=test@test.com
```

**Description**: Returns all historical cryptocurrency queries associated with
an email address (most recent first).

**Query parameters**

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| email     | string | ✅        | Email to filter by       |
| limit     | number | ❌        | Max results (pagination) |
| lastKey   | string | ❌        | DynamoDB pagination key  |

**Response (200 OK)**

```json
[
  {
    "crypto": "bitcoin",
    "searchedAt": "2026-01-12T06:30:00Z",
    "price": 12345.67,
    "currency": "USD",
    "email": "test@test.com"
  },
  {
    "crypto": "ethereum",
    "searchedAt": "2026-01-11T12:00:00Z",
    "price": 2345.67,
    "currency": "USD",
    "email": "test@test.com"
  }
]
```

**curl example**

```bash
curl "https://<api-id>.execute-api.<region>.amazonaws.com/Prod/crypto/history?email=test@test.com"
```

**Notes**: Consider adding `limit` + `lastKey` pagination when the dataset
grows large.

---

## Environment Variables

| Variable             | Required | Description                        |
| -------------------- | :------: | ---------------------------------- |
| AWS_REGION           |     ✅    | AWS region (e.g. `ap-southeast-4`) |
| CRYPTO_HISTORY_TABLE |     ✅    | DynamoDB table name for history    |
| SES_SENDER_EMAIL     |     ✅    | Verified SES sender email          |
| COINGECKO_API_KEY    |     ❌    | Optional CoinGecko API key         |

---

## DynamoDB Schema / Indexes

**Table name**: `CryptoHistory` (example)

Primary key (partition + sort):

* `pk` (string) — e.g. `USER#<email>`
* `sk` (string) — e.g. `SEARCH#<timestamp>`

Attributes stored:

* `crypto` (string)
* `price` (number)
* `currency` (string)
* `searchedAt` (ISO8601 string)
* `email` (string)

**Global secondary index (GSI)**

* `email-index` with `email` as partition key and `searchedAt` as sort key to
  query history by email efficiently.

---

## Testing

Unit tests are implemented with **Jest**. To run tests locally:

```bash
npm test
```

Include tests for:

* Successful CoinGecko responses (mock API).
* SES send success / failure (mock SES).
* DynamoDB read/write behaviours (mock DynamoDB or use LocalStack).

---

## Tech Stack

* Node.js
* AWS Lambda
* API Gateway
* DynamoDB
* SES
* CoinGecko API
* Git & GitHub
* GitHub Actions (CI/CD)
* Jest (Unit Testing)

---

## Notes & Best Practices

* Verify `SES_SENDER_EMAIL` in the correct AWS region before sending emails.
* Use a GSI on `email` for efficient history queries.
* Validate user input (email format, supported cryptocurrency names).
* Implement retries and exponential backoff for external API calls.
* Add pagination for `/crypto/history` when store grows large.

---
