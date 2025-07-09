const { isInvalid } = require("../utils/sanitise");

module.exports = (req, res, next) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === "string" && isInvalid(value)) {
            return res
                .status(400)
                .json({ message: `Field "${key}" contains whitespace or emoji` });
        }
    }
    next();
};
