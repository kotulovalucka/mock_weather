import { Router } from 'npm:express';
import { weatherArticleController } from './weather_article_controller.ts';
import { healthCheckRouter } from './healt_check.ts';

/**
 * Modular exporter of all defined controllers/routes
 */
export const controllers = Router();

controllers.use('/v1/weather', weatherArticleController);
controllers.use('/v1/health', healthCheckRouter);
