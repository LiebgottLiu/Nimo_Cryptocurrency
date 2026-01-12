const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const EmailClient = require("../service/email_client");

// Mock AWS SDK SESClient
jest.mock("@aws-sdk/client-ses", () => {
  return {
    SESClient: jest.fn(() => ({
      send: jest.fn() 
    })),
    SendEmailCommand: jest.fn((params) => params) 
  };
});

describe("EmailClient Unit Test", () => {
  let emailClient;
  let mockSend;

  beforeEach(() => {
    emailClient = new EmailClient();

    mockSend = emailClient.client.send;
    mockSend.mockReset();
  });

  test("should call SES send with correct parameters", async () => {
    const to = "user@test.com";
    const subject = "Test Email";
    const body = "Hello World";

    // Mock send to resolve successfully
    mockSend.mockResolvedValue({ MessageId: "12345" });

    await emailClient.send(to, subject, body);

    expect(mockSend).toHaveBeenCalledTimes(1);

    const sentCommand = mockSend.mock.calls[0][0];
    
    // Verify SendEmailCommand was called with the correct parameters
    expect(sentCommand).toEqual({
      Destination: { ToAddress: [to] }, 
      Message: {
        Body: { Text: { Data: body } },
        Subject: { Data: subject }
      },
      Source: emailClient.senderEmail
    });
  });

  test("should throw an error if SES send fails", async () => {
    // Arrange
    const to = "user@test.com";
    const subject = "Test Email";
    const body = "Hello World";

    // Mock send to reject with an error
    mockSend.mockRejectedValue(new Error("SES send error"));

    // Act & Assert
    await expect(emailClient.send(to, subject, body))
      .rejects.toThrow("SES send error");
  });
});