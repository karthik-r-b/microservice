import logger from "../src/middleware/logger.js";

async function errorHandler(error, request, response, next) {
  try {
    logger.error(error.message);
    response
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.message || "Internal server error",
      });
  } catch (error) {
    logger.error(JSON.stringify(error));
    next(error);
  }
}

export default errorHandler;
