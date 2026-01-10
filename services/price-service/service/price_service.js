const HistoryWriter = require("./history_writer");

// process service logic

class PriceService{
    constructor({ historyWriter }) {
        this.historyWriter = historyWriter;
    }

    async execute(crypto,email){

        //mock price 
        const price = 1000;

        //sending email

        //write search history to db 
        await this.historyWriter.save(crypto);

        //return states 
        return{
            message: "Price email has been sent",
            crypto,
            price,
            currency: "AUD"
        };
    }
}

module.exports = PriceService;