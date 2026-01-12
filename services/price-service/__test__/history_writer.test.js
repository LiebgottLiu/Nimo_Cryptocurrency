const HistoryWriter = require("../service/history_writer");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Jest mock DynamoDBDocumentClient
jest.mock("@aws-sdk/lib-dynamodb", () => {
  const actual = jest.requireActual("@aws-sdk/lib-dynamodb");
  return {
    ...actual,
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: jest.fn() 
      }))
    },
    PutCommand: actual.PutCommand
  };
});

describe("HistoryWriter Unit Test", () => {
  let writer;
  let mockSend;

  beforeEach(() => {
    writer = new HistoryWriter();

    mockSend = writer.docClient.send;
    mockSend.mockReset();
  });

  test("should save an item to DynamoDB", async () => {
    // mock sending
    mockSend.mockResolvedValue({});

    const item = await writer.save("bitcoin", "test@example.com", 12345, "USD");

    // check returned item
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("cryptos", "bitcoin");
    expect(item).toHaveProperty("email", "test@example.com");
    expect(item).toHaveProperty("price", 12345);
    expect(item).toHaveProperty("currency", "USD");
    expect(item).toHaveProperty("createdAt");

    // check DynamoDBDocumentClient.send 
    expect(mockSend).toHaveBeenCalledTimes(1);
    const calledCommand = mockSend.mock.calls[0][0];
    expect(calledCommand).toBeInstanceOf(PutCommand);
    expect(calledCommand.input.TableName).toBe(writer.tableName);
    expect(calledCommand.input.Item).toMatchObject({
      cryptos: "bitcoin",
      email: "test@example.com",
      price: 12345,
      currency: "USD"
    });
  });

  test("should throw if DynamoDB send fails", async () => {
    mockSend.mockRejectedValue(new Error("DynamoDB error"));

    await expect(
      writer.save("bitcoin", "test@example.com", 12345, "USD")
    ).rejects.toThrow("DynamoDB error");
  });
});
