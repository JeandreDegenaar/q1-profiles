// server/middleware/validateBody.js
// ────────────────────────────────────────────────────────────
// Global middleware that rejects any JSON field containing
// whitespace or emoji characters. Safe for all routes (GET, POST, etc.).

const { isInvalid } = require("../utils/sanitise");

module.exports = (req, res, next) => {
    // Skip validation if the request has no body (e.g., GET /health-check)
    if (
        !req.body ||                       // undefined/null
        typeof req.body !== "object" ||    // non-object
        Object.keys(req.body).length === 0 // empty object
    ) {
        return next();
    }

    // Validate each string field in the body
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === "string" && isInvalid(value)) {
            return res
                .status(400)
                .json({ message: `Field "${key}" contains whitespace or emoji` });
        }
    }

    next(); // all good, continue to the route handler
};
