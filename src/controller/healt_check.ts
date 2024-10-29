import { Request, Response, Router } from 'npm:express@5.0.1';

export const healthCheckRouter = Router();

healthCheckRouter.get('/status', (_req: Request, res: Response) => {
	res.status(200).json({ status: 'healthy' });
});
