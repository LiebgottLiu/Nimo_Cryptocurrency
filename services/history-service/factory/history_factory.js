const HistoryService = require("../service/history_service");

class MockStorageClient{
    async getAll(){
        return [
            { crypto: "bitcoin", searchedAt: "2026-01-10T09:21:00Z" },
            { crypto: "ethereum", searchedAt: "2026-01-09T22:10:00Z" }
        ];
    }
}


class historyFactory{
    static create(){
        return new HistoryService({storageClient: new MockStorageClient()});
    }
}

module.exports = historyFactory;