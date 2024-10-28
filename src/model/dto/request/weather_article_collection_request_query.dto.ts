import type { WeatherArticleCollectionRequestBaseSchema } from '../../../schema/weather_article_collection_schema.ts';
import { z } from 'zod';
import type { ArticleType } from '../../enum/article_type.ts';

export type WeatherArticleCollectionRequestQueryDto = z.infer<
	typeof WeatherArticleCollectionRequestBaseSchema
>;

export type WeatherArticleCollectionRequestQueryMappedDto = {
	limit: number;
	offset: number;
	locationName: string;
	dateFrom?: number;
	dateTo?: number;
	articleType?: ArticleType;
};
