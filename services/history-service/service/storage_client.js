const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION || "ap-southeast-4" });

class DynamoDBStorageClient{
    constructor(){
        this.docClient = new AWS.DynamoDB.DocumentClient();
        this.tableName = process.env.CRYPTO_HISTORY_TABLE || "CryptoHistoryTable";

    }

    async getByEmail(email){    
        const params = {
            TableName: this.tableName,
            FilterExpression: "#email = :emailVal",
            ExpressionAttributeNames: { "#email": "email" },
            ExpressionAttributeValues: { ":emailVal": email }
        };

        try{
            const data = await this.docClient.scan(params).promise();
            return data.Items.map(item => ({
                crypto: item.crypto,
                searchedAt: item.searchedAt,
                price: item.price,
                currency: item.currency
            }));
        }catch(error){
            console.error("Error querying DynamoDB:", error);
            throw error;
        }

    }
}

module.exports = DynamoDBStorageClient;