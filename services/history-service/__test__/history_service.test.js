const HistoryService = require("../service/history_service");

describe("HistoryService", () => {
  test("getByEmail should return data from storageClient", async () => {
    const mockStorageClient = {
      getByEmail: jest.fn().mockResolvedValue([
        { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" }
      ])
    };

    const service = new HistoryService({ storageClient: mockStorageClient });

    const result = await service.getByEmail("user@test.com");

    expect(result).toEqual([
      { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" }
    ]);

    expect(mockStorageClient.getByEmail).toHaveBeenCalledTimes(1);
    expect(mockStorageClient.getByEmail).toHaveBeenCalledWith("user@test.com");
  });

  test("getByEmail should throw if storageClient fails", async () => {
    const mockStorageClient = {
      getByEmail: jest.fn().mockRejectedValue(new Error("DB error"))
    };

    const service = new HistoryService({ storageClient: mockStorageClient });

    await expect(service.getByEmail("user@test.com")).rejects.toThrow("DB error");
  });
});
