const AiService = require("../services/Ai");

const codeReviewController = async (req, res) => {
    const code = req.body.code

    if (!code || typeof code !== "string" || code.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Code input is required."
        });
    }

    const response = await AiService(code)

    return res.status(200).send(response)
}

module.exports = codeReviewController;
