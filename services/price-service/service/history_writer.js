//write search history 
class HistoryWriter{
    async save(crypto){
        console.log("Saved history", {
            crypto,
            searchedAt: new Date().toISOString()
        });
    }
}

module.exports = HistoryWriter;