const { getPrice } = require("../controller/price_controller");
const priceFactory = require("../factory/price_factory");

jest.mock("../factory/price_factory", () => ({
  create: jest.fn()
}));

describe("getPrice controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test("should return 400 if crypto or email is missing", async () => {
    req.body = {};
    await getPrice(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["crypto type and email are required"]
    });
  });

  test("should return 400 if email format is invalid", async () => {
    req.body = {
      crypto: "bitcoin",
      email: "invalid-email"
    };
    await getPrice(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Invalid email format"]
    });
  });

  test("should return 200 and trimmed inputs when service succeeds", async () => {
    req.body = {
      crypto: " bitcoin ",
      email: " tessafasfat@test.com "
    };

    const mockService = {
      execute: jest.fn().mockResolvedValue({
        message: "Current price of bitcoin has been sent to tessafasfat@test.com",
        crypto: "bitcoin",
        price: 1000,
        currency: "USD",
        lastUpdatedAt: "2026-01-12T03:00:00Z"
      })
    };

    priceFactory.create.mockReturnValue(mockService);

    await getPrice(req, res);

    expect(priceFactory.create).toHaveBeenCalledTimes(1);
    expect(mockService.execute).toHaveBeenCalledWith(
      "bitcoin",
      "tessafasfat@test.com"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Current price of bitcoin has been sent to tessafasfat@test.com",
      crypto: "bitcoin",
      price: 1000,
      currency: "USD",
      lastUpdatedAt: "2026-01-12T03:00:00Z"
    });
  });

  test("should return 500 when service throws error", async () => {
    req.body = {
      crypto: "bitcoin",
      email: "tessafasfat@test.com"
    };

    const mockService = {
      execute: jest.fn().mockRejectedValue(new Error("Service failure"))
    };

    priceFactory.create.mockReturnValue(mockService);

    await getPrice(req, res);

    expect(priceFactory.create).toHaveBeenCalledTimes(1);
    expect(mockService.execute).toHaveBeenCalledWith(
      "bitcoin",
      "tessafasfat@test.com"
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: "INTERNAL_ERROR",
        message: "Service failure"
      }
    });
  });
});
