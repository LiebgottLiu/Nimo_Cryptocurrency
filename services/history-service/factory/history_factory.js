const HistoryService = require("../service/history_service");
const DynamoDBStorageClient = require("../service/storage_client");


class historyFactory{
    static create() {
        const storageClient = new DynamoDBStorageClient();
        return new HistoryService({ storageClient });
    }
}

module.exports = historyFactory;