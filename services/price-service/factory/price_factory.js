const PriceService = require("../service/price_service");
const HistoryWriter = require("../service/history_writer");
const CoinGeckoClient = require("../service/coingecko_client");
const EmailClient = require("../service/email_client")

class PriceFactory{
    static create() {
        return new PriceService({
            historyWriter: new HistoryWriter(),
            coinGeckoClient: new CoinGeckoClient(),
            emailClient: new EmailClient()
        });
        
    }
}

module.exports = PriceFactory;