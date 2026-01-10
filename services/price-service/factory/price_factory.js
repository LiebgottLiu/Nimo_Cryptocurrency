const PriceService = require("../service/price_service");
const HistoryWriter = require("../service/history_writer");


class PriceFactory{
    static create() {
        return new PriceService({
            historyWriter: new HistoryWriter()
        });
        
    }
}

module.exports = PriceFactory;