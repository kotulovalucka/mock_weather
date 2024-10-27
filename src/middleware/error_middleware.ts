import express from 'npm:express';
import { WeatherServiceCommonError } from '../model/error/weather_service_common_error.ts';
import { StatusCodes } from 'npm:http-status-codes';
export function errorHandler(
	error: unknown,
	_req: express.Request,
	res: express.Response,
	_next: express.NextFunction,
) {
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	let message = 'An unexpected error occurred';

	if (error instanceof WeatherServiceCommonError) {
		statusCode = error instanceof WeatherServiceCommonError
			? error.statusCode
			: StatusCodes.INTERNAL_SERVER_ERROR;
		message = error.message;
	}

	res.status(statusCode).json({
		status: WeatherServiceCommonError.name,
		statusCode,
		message,
	});
}
