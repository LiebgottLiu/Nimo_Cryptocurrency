const priceFactory = require("../factory/price_factory");

// check is the email valid
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// input req body check
const validateRequest = ({ crypto, email }) => {
  const errors = [];

  if (!crypto || !email) errors.push("crypto type and email are required");
  if (crypto && typeof crypto !== "string") errors.push("'crypto' must be a string");
  if (email && typeof email !== "string") errors.push("'email' must be a string");
  if (email && !isValidEmail(email)) errors.push("Invalid email format");

  return errors;
};

// request entry point
exports.getPrice = async(req, res) => {
    let { crypto, email } = req.body;

    if (typeof crypto === "string") crypto = crypto.trim().toLowerCase();
    if (typeof email === "string") email = email.trim();

    const errors = validateRequest({ crypto, email });
    if (errors.length > 0) {
        return res.status(400).json({
        errors
        });
    }

    try {
        const service = priceFactory.create();
        const result = await service.execute(crypto, email);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: error.message
        }
        });
    }
};