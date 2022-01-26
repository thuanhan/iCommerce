import {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} from "./errors";

export default function createHttpError({ statusCode, errorMessage }) {
  if (arguments[0] instanceof Error) {
    const e = arguments[0];
    errorMessage = e.message;
    statusCode =
      e.name === "MongoError"
        ? 422
        : e instanceof UniqueConstraintError
        ? 409
        : e instanceof InvalidPropertyError ||
          e instanceof RequiredParameterError
        ? 400
        : 500;
  }

  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode,
    data: JSON.stringify({
      success: false,
      error: errorMessage,
    }),
  };
}
