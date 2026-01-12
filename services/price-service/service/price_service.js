const HistoryWriter = require("./history_writer");

// process service logic

class PriceService{
    constructor({ historyWriter,coinGeckoClient,emailClient }) {
        this.historyWriter = historyWriter;
        this.coinGeckoClient = coinGeckoClient;
        this.emailClient = emailClient;
    }


    async execute(crypto,email){

        const {
            price,
            marketCap,
            volume24h,
            change24h,
            lastUpdatedAt
            } = await this.coinGeckoClient.getCurrentPrice(crypto, "usd");


        //write search history to db 
        await this.historyWriter.save({
            cryptos:crypto,
            email,
            price,
            currency: "USD",
        });

        //sending email
        const subject = `Current Price of ${crypto}`;
        const body = `The current price of ${crypto} is $${price} USD.`;
        await this.emailClient.send(email, subject, body);

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