const HistoryService = require("../service/history_service");

describe("HistoryService", () => {
  test("should return all history from storage client", async () => {
    const mockStorageClient = {
      getAll: jest.fn().mockResolvedValue([
        { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" }
      ])
    };

    const service = new HistoryService({
      storageClient: mockStorageClient
    });

    const result = await service.getAll();

    expect(result).toEqual([
      { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" }
    ]);

    expect(mockStorageClient.getAll).toHaveBeenCalledTimes(1);
  });
});
