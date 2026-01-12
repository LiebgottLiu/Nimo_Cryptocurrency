const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const EmailClient = require("../service/email_client");


process.env.SES_SENDER_EMAIL = "sender@test.com";


// Mock AWS SDK SESClient
jest.mock("@aws-sdk/client-ses", () => {
  return {
    SESClient: jest.fn(() => ({
      send: jest.fn()
    })),
    SendEmailCommand: jest.fn((params) => params)
  };
});

describe("EmailClient", () => {
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

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await emailClient.send(to, subject, body);

    expect(mockSend).toHaveBeenCalledTimes(1);

    const sentCommand = mockSend.mock.calls[0][0];

    await emailClient.send(to, subject, body);

    
    // Verify SendEmailCommand was called with the correct parameters
   expect(sentCommand).toEqual({
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Text: { Charset: "UTF-8", Data: body } },
        Subject: { Charset: "UTF-8", Data: subject }
      },
      Source: "sender@test.com"
    });

    expect(logSpy).toHaveBeenCalledWith("Email sent, Message ID:", "12345");

    logSpy.mockRestore();
  });

  test("should throw an error if SES send fails", async () => {
    const to = "user@test.com";
    const subject = "Test Email";
    const body = "Hello World";

    const error = new Error("SES send error");
    mockSend.mockRejectedValue(error);

    // spy console.error 
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(emailClient.send(to, subject, body)).rejects.toThrow("SES send error");

    expect(errorSpy).toHaveBeenCalledWith("Error sending email via SES:", error);

    errorSpy.mockRestore();
  });
});