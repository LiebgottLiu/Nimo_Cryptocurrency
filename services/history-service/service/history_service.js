
class HistoryService{
    constructor({storageClient }){
        this.storageClient = storageClient;
    }

    async getByEmail(email){
        // return mock data
        return this.storageClient.getByEmail(email);
    }
}

module.exports = HistoryService;