const { getHistory } = require("../controller/history_controller");
const historyFactory = require("../factory/history_factory");

jest.mock("../factory/history_factory");

describe("getHistory controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("should return 200 and history list", async () => {
    const mockHistoryList = [
      { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" },
      { crypto: "ethereum", searchedAt: "2026-01-09T22:10:00Z" }
    ];

    const mockService = {
      getAll: jest.fn().mockResolvedValue(mockHistoryList)
    };

    historyFactory.create.mockReturnValue(mockService);

    await getHistory(req, res);

    expect(mockService.getAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockHistoryList);
  });

  test("should return 500 when service throws error", async () => {
    const mockService = {
      getAll: jest.fn().mockRejectedValue(new Error("DB failure"))
    };

    historyFactory.create.mockReturnValue(mockService);

    await getHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: "INTERNAL_ERROR",
        message: "DB failure"
      }
    });
  });
});
