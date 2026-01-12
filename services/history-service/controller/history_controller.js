const historyFactory = require("../factory/history_factory");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.getHistory = async (req, res) => {
    const email = req.query.email?.trim();
    if (!email) {
        return res.status(400).json({ error: { message: "Email is required" } });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: { message: "Invalid email format" } });
    }

    try {
        const service = historyFactory.create();
        const historyList = await service.getByEmail(email);
        return res.status(200).json(historyList);
    } catch (error) {
        return res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: error.message
            }
        });
    }
};
