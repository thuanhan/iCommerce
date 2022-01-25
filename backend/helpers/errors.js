export class UniqueConstraintError extends Error {
  constructor(value) {
    super(`${value} must be unique.`);

    Error.captureStackTrace(this, UniqueConstraintError);
  }
}

export class InvalidPropertyError extends Error {
  constructor(msg) {
    super(msg);

    Error.captureStackTrace(this, InvalidPropertyError);
  }
}

export class RequiredParameterError extends Error {
  constructor(param) {
    super(`${param} can not be null or undefined.`);

    Error.captureStackTrace(this, RequiredParameterError);
  }
}
