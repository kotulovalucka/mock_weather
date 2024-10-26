import express from 'npm:express';
import { HttpError } from '../model/error/HttpError.ts';
import { StatusCodes } from 'npm:http-status-codes';
export function errorHandler(
	error: unknown,
	_req: express.Request,
	res: express.Response,
	_next: express.NextFunction,
) {
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	let message = 'An unexpected error occurred';

	if (error instanceof HttpError) {
		statusCode = error instanceof HttpError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
		message = error.message;
	}

	res.status(statusCode).json({
		status: HttpError.name,
		statusCode,
		message,
	});
}
