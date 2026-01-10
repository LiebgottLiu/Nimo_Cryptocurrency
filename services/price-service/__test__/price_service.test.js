const PriceService = require("../service/price_service");

describe("PriceService", () => {
  test("should return price result and save history", async () => {
    const mockHistoryWriter = {
      save: jest.fn().mockResolvedValue()
    };

    const service = new PriceService({
      historyWriter: mockHistoryWriter
    });

    const result = await service.execute("bitcoin", "test@test.com");

    // checking mock data
    expect(result).toEqual({
      message: "Price email has been sent",
      crypto: "bitcoin",
      price: 1000,
      currency: "AUD"
    });
    
    expect(mockHistoryWriter.save).toHaveBeenCalledTimes(1);
    expect(mockHistoryWriter.save).toHaveBeenCalledWith("bitcoin");
  });
});
