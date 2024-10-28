import { ArticleType } from '../model/enum/article_type.ts';
import { Language } from '../model/enum/language.ts';
import * as schemaUtils from './schema_util.ts';
import { z } from 'zod';

export const WeatherArticleCollectionRequestBaseSchema = z.object({
	limit: z.string(),
	offset: z.string(),
	locationName: z.string(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	articleType: z.enum([ArticleType.FACTUAL, ArticleType.BULVAR]).optional(),
});

// Extended schema with localized error messages
export const WeatherArticleCollectionRequestSchema = (lang: Language) => {
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	return WeatherArticleCollectionRequestBaseSchema.extend({
		limit: z.preprocess(
			(val) => {
				if (typeof val === 'string') {
					return +val;
				}
				return val;
			},
			z.number().int({ message: errorMessages.typeErrors.int }).max(10, {
				message: errorMessages.limitMax10,
			}).positive({ message: errorMessages.typeErrors.positive }),
		),

		offset: z.preprocess(
			(val) => {
				if (typeof val === 'string') {
					return +val;
				}
				return val;
			},
			z.number().int({ message: errorMessages.typeErrors.int }).nonnegative({
				message: errorMessages.typeErrors.nonNegative,
			}),
		),

		locationName: z.string()
			.min(1, { message: errorMessages.location }),

		dateFrom: z.preprocess((val) => {
			if (typeof val === 'string') {
				return +val;
			}
			return val;
		}, z.number().positive({ message: errorMessages.typeErrors.positive }).optional()),

		dateTo: z.preprocess((val) => {
			if (typeof val === 'string') {
				return +val;
			}
			return val;
		}, z.number().positive({ message: errorMessages.typeErrors.positive }).optional()),

		articleType: z.enum(
			[ArticleType.FACTUAL, ArticleType.BULVAR],
			{ message: errorMessages.articleType },
		).optional(),
	});
};
