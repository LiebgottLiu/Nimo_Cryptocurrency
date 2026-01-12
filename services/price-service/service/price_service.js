const HistoryWriter = require("./history_writer");

// process service logic

class PriceService{
    constructor({ historyWriter,coinGeckoClient  }) {
        this.historyWriter = historyWriter;
        this.coinGeckoClient = coinGeckoClient;
    }


    async execute(crypto,email){

        const {
            price,
            marketCap,
            volume24h,
            change24h,
            lastUpdatedAt
            } = await this.coinGeckoClient.getCurrentPrice(crypto, "usd");

        await this.historyWriter.save(crypto);

        //write search history to db 
        await this.historyWriter.save({
            crypto,
            email,
            price,
            currency: "USD",
        });

        //sending email

        //return states 
        return{
            message: `Current price of ${crypto} has been sent to ${email}`,
            crypto,
            price,
            currency: "USD",
            lastUpdatedAt: new Date().toISOString()
        };
    }


}

module.exports = PriceService;