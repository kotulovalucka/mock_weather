import { NextFunction, Request, Response } from 'npm:express@5.0.1';
import LOG from '../log/default_logger.ts';

export function logRequests(req: Request, _res: Response, next: NextFunction) {
	const { method, url } = req;
	const timestamp = new Date().toISOString();
	const headers = JSON.stringify(req.headers);
	const body = JSON.stringify(req.body);
	LOG.log('message', `[${timestamp}] ${method} ${url} \n headers: ${headers} \n body: ${body}`);
	next();
}
