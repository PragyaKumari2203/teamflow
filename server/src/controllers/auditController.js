const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({
            logs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAuditLogs
};