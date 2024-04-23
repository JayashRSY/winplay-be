export const errorHandler = (statusCode, message) => {
    console.log("🚀errHand", statusCode, message);

    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}