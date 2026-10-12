/** Base class of all errors thrown by the client. */
export class SpinShareError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class ApiMismatchError extends SpinShareError {}
export class NotFoundError extends SpinShareError {}
export class UnauthenticatedError extends SpinShareError {}
export class ApiStatusError extends SpinShareError {}
export class ServerError extends SpinShareError {}
export class ValidationError extends SpinShareError {}
