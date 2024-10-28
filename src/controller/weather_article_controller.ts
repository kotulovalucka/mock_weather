import { Request, Response, Router } from 'npm:express@5.0.1';

import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import {
	validateRequestBody,
	validateRequestQuery,
} from '../middleware/zod_validation_middleware.ts';
import { WeatherArticleRequestSchema } from '../schema/weather_article_schema.ts';
import { WeatherArticleService } from '../service/weather_article_service.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';
import { WeatherArticleCollectionRequestSchema } from '../schema/weather_article_collection_schema.ts';
import type { WeatherArticleCollectionRequestQueryDto } from '../model/dto/request/weather_article_collection_request_query.dto.ts';
import { mapToDefaultArticleCollectionQuery } from '../mapper/to_default_article_collection_query.ts';

export const weatherArticleController = Router();

weatherArticleController.post(
	'/article',
	validateRequestBody(WeatherArticleRequestSchema),
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

weatherArticleController.get(
	'/article/collection',
	validateRequestQuery(WeatherArticleCollectionRequestSchema),
	async (
		req: Request,
		res: Response<WeatherArticleResponseDto[]>,
	) => {
		const reqQuery = mapToDefaultArticleCollectionQuery(
			req.query as WeatherArticleCollectionRequestQueryDto,
		);
		const weatherArticleService = WeatherArticleService.getInstance();
		const audits = await weatherArticleService.getWeatherArticleCollection(
			reqQuery,
			req['headers']['accept-language'],
		);

		res.status(200).json({ message: audits });
	},
);
