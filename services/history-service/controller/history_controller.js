const historyFactory = require("../factory/history_factory");


exports.getHistory = async (req, res) => {
    try{
        const service = historyFactory.create();
        const historyList = await service.getAll();
        

        return res.status(200).json(historyList);
    }catch(error){
        return res.status(500).json({
            error: {
                code:"INTERNAL_ERROR",
                message: error.message
            }
        });
    }
};