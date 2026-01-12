const PriceService = require("../service/price_service");
const HistoryWriter = require("../service/history_writer");
const CoinGeckoClient = require("../service/coingecko_client");

class PriceFactory{
    static create() {
        return new PriceService({
            historyWriter: new HistoryWriter(),
            coinGeckoClient: new CoinGeckoClient()
        });
        
    }
}

module.exports = PriceFactory;