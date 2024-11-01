import type { WeatherArticleRequestBaseSchema } from '../../../schema/weather_article_schema.ts';
import { z } from 'zod';

export type WeatherArticleRequestDto = z.infer<
	typeof WeatherArticleRequestBaseSchema
>;
