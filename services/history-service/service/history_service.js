
class HistoryService{
    constructor({storageClient}){
        this.storageClient = storageClient;
    }

    async getAll(){
        // return mock data
        return this.storageClient.getAll();
    }
}

module.exports = HistoryService;