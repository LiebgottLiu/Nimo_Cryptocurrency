const axios = require("axios");

class CoinGeckoClient {
    constructor(){
        this.baseUrl = "https://api.coingecko.com/api/v3";
        this.apiKey = process.env.COINGECKO_API_KEY;

    }

    async getCurrentPrice(crypto, currency = "usd"){

        try{
            const response = await axios.get(
                `${this.baseUrl}/simple/price`,
                {
                    params:{
                        ids: crypto,
                        vs_currencies: currency
                    },
                    headers: {
                        "x-cg-pro-api-key": this.apiKey
                    }
                }
            );

            const data = response.data[crypto];
            if(!data){
                throw new Error(`Unsupported cryptocurrency: ${crypto}`);
            }

            return{
                price: data[currency],
                marketCap: data[`${currency}_market_cap`],
                volume24h: data[`${currency}_24h_vol`],
                change24h: data[`${currency}_24h_change`],
                lastUpdatedAt: data.last_updated_at
            };
        }catch(error){
            console.error(
                "CoinGecko API error:",
                error.response?.data || error.message
            );
            throw new Error("Failed to fetch cryptocurrency price");
        }
    }
}

module.exports = CoinGeckoClient;