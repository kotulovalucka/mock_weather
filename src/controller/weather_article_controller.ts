import { Request, Response, Router } from 'npm:express@5.0.1';

import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import { validate } from '../middleware/zod_validation_middleware.ts';
import { WeatherArticleRequestSchema } from '../schema/weather_article_schema.ts';
import { WeatherArticleService } from '../service/weather_article_service.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';

export const weatherArticleController = Router();

weatherArticleController.post(
	'/article',
	validate(WeatherArticleRequestSchema),
	async (
		req: Request<WeatherArticleRequestDto>,
		res: Response<WeatherArticleResponseDto>,
	) => {
		const validatedData = req.body as WeatherArticleRequestDto;
		const weatherArticleService = WeatherArticleService.getInstance();
		const weatherArticle = await weatherArticleService.getWeatherArticle(
			validatedData,
			req['headers']['accept-language'],
		);

		res.status(200).json({ message: weatherArticle });
	},
);
