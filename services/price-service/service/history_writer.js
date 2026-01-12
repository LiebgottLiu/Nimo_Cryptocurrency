const{ DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

//write search history 
class HistoryWriter{
    constructor() {
        const client = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-4" })
        this.docClient = DynamoDBDocumentClient.from(client);
        this.tableName = process.env.CRYPTO_HISTORY_TABLE || "CryptoHistoryTable";
    
    }


    async save(cryptos, email, price, currency){
        const item = {
            id: crypto.randomUUID(),
            cryptos,
            email,
            price,
            currency,
            createdAt: new Date().toISOString()
        };

        await this.docClient.send(new PutCommand({
            TableName: this.tableName,
            Item: item
        }));

        return item;
    }
}

module.exports = HistoryWriter;