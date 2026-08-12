const notFound = (req, res, next) => {
    res.status(404);

    next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: error.message,
        ...(process.env.NODE_ENV === "development" && {
            stack: error.stack
        })
    });
};

module.exports = {
    notFound,
    errorHandler
};