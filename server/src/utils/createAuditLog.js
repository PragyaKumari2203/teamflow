const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
    user,
    action,
    entity,
    entityId,
    description
}) => {
    try {
        await AuditLog.create({
            user,
            action,
            entity,
            entityId,
            description
        });
    } catch (error) {
        console.error(
            "Failed to create audit log:",
            error.message
        );
    }
};

module.exports = createAuditLog;