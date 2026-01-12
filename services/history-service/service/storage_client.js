const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

class DynamoDBStorageClient {
    constructor() {
        const client = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-2" });
        this.docClient = DynamoDBDocumentClient.from(client);
        this.tableName = process.env.CRYPTO_HISTORY_TABLE || "CryptoHistoryTable";
        this.emailIndex = "email-index"; // DynamoDB GSI
    }

    async getByEmail(email) {
        if (!email) throw new Error("Email is required");

        const params = {
            TableName: this.tableName,
            IndexName: this.emailIndex,
            KeyConditionExpression: "#email = :emailVal",
            ExpressionAttributeNames: { "#email": "email" },
            ExpressionAttributeValues: { ":emailVal": email },
            ScanIndexForward: false 
        };

        try {
            const data = await this.docClient.send(new QueryCommand(params));
            return data.Items.map(item => ({
                crypto: item.crypto,
                searchedAt: item.searchedAt,
                price: item.price,
                currency: item.currency
            }));
        } catch (error) {
            console.error("Error querying DynamoDB:", error);
            throw error;
        }
    }
}

module.exports = DynamoDBStorageClient;
