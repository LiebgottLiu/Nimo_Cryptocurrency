const { DynamoDBClient, DeleteTableCommand, CreateTableCommand, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const HistoryWriter = require("../service/history_writer");

//create a test use table 
const TABLE_NAME = "CryptoHistoryTable_Test"; 

describe("HistoryWriter Integration Test (AWS)", () => {
  let writer;
  let client;

  beforeAll(async () => {
    client = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-southeast-4" });
    const docClient = DynamoDBDocumentClient.from(client);

    // check is the test use table exist
    const tables = await client.send(new ListTablesCommand({}));
    if (!tables.TableNames.includes(TABLE_NAME)) {
      await client.send(new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" }
        ],
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" }
        ],
        BillingMode: "PAY_PER_REQUEST"
      }));
    }

    writer = new HistoryWriter();
    writer.tableName = TABLE_NAME;
    writer.docClient = docClient;
  }, 30000);

  test("should save a crypto query to DynamoDB", async () => {
    const item = await writer.save({
      crypto: "bitcoin",
      email: "test@example.com",
      price: 12345,
      currency: "USD"
    });

    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("createdAt");
    expect(item.crypto).toBe("bitcoin");
    expect(item.email).toBe("test@example.com");
    expect(item.price).toBe(12345);
    expect(item.currency).toBe("USD");
  });

  afterAll(async () => {
    // remove test table
    await client.send(new DeleteTableCommand({ TableName: TABLE_NAME }));
  });
});