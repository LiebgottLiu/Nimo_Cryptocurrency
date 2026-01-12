const { getHistory } = require("../controller/history_controller");
const historyFactory = require("../factory/history_factory");

jest.mock("../factory/history_factory");

describe("getHistory controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test("should return 200 and history list for valid email", async () => {
    req.query.email = "user@test.com";

    const mockHistoryList = [
      { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z", price: 20000, currency: "USD" },
      { crypto: "ethereum", searchedAt: "2026-01-09T22:10:00Z", price: 1500, currency: "USD" }
    ];

    const mockService = {
      getByEmail: jest.fn().mockResolvedValue(mockHistoryList)
    };

    historyFactory.create.mockReturnValue(mockService);

    await getHistory(req, res);

    expect(mockService.getByEmail).toHaveBeenCalledTimes(1);
    expect(mockService.getByEmail).toHaveBeenCalledWith("user@test.com");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHistoryList);
  });

  test("should return 400 for invalid email format", async () => {
    req.query.email = "invalid-email";

    await getHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Invalid email format" }
    });
  });

  test("should return 400 if email is missing", async () => {
    // req.query.email = undefined
    await getHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Email is required" }
    });
  });

  test("should return 500 if service throws error", async () => {
    req.query.email = "user@test.com";

    const mockService = {
      getByEmail: jest.fn().mockRejectedValue(new Error("DB failure"))
    };

    historyFactory.create.mockReturnValue(mockService);

    await getHistory(req, res);

    expect(mockService.getByEmail).toHaveBeenCalledWith("user@test.com");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "INTERNAL_ERROR", message: "DB failure" }
    });
  });
});
