import { StatusCodes } from 'npm:http-status-codes';
export class WeatherServiceCommonError extends Error {
	public statusCode: StatusCodes;

	constructor(
		statusCode: StatusCodes,
		message: string,
	) {
		super(message);
		this.statusCode = statusCode;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	toJSON() {
		return {
			statusCode: this.statusCode,
			message: this.message,
			stack: this.stack,
		};
	}
}
