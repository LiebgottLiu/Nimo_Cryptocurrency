const PriceService = require("../service/price_service");

describe("PriceService", () => {
  test("should return price result and save history", async () => {
    // mock HistoryWriter
    const mockHistoryWriter = {
      save: jest.fn().mockResolvedValue()
    };

    // mock CoinGeckoClient
    const mockCoinGeckoClient = {
      getCurrentPrice: jest.fn().mockResolvedValue({
        price: 1000,
        marketCap: 1000000,
        volume24h: 50000,
        change24h: 1.5,
        lastUpdatedAt: 1711356300
      })
    };

    const service = new PriceService({
      historyWriter: mockHistoryWriter,
      coinGeckoClient: mockCoinGeckoClient
    });

    const result = await service.execute("bitcoin", "test@test.com");

    // checking result structure
    expect(result).toMatchObject({
      message: `Current price of bitcoin has been sent to test@test.com`,
      crypto: "bitcoin",
      price: 1000,
      currency: "USD"
    });

    expect(mockCoinGeckoClient.getCurrentPrice).toHaveBeenCalledTimes(1);
    expect(mockCoinGeckoClient.getCurrentPrice).toHaveBeenCalledWith("bitcoin", "usd");

    expect(mockHistoryWriter.save).toHaveBeenCalledTimes(2);
    expect(mockHistoryWriter.save).toHaveBeenCalledWith("bitcoin");
  });
});
