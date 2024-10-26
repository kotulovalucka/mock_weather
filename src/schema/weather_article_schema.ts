import { ArticleType } from '../model/enum/article_type.ts';
import { Language } from '../model/enum/language.ts';
import * as schemaUtils from './schema_util.ts';
import { z } from 'zod';

// Base schema for WeatherArticleRequest
export const WeatherArticleRequestBaseSchema = z.object({
	location: z.string().min(2),
	targetDateTimestamp: z.number().positive().nullable().optional(),
	article: z.object({
		type: z.enum([ArticleType.FACTUAL, ArticleType.BULVAR]),
	}),
}, { message: schemaUtils.getErrorMessages(Language.EN).general });

// Extended schema with localized error messages
export const WeatherArticleRequestSchema = (lang: Language) => {
	const errorMessages = schemaUtils.getErrorMessages(lang);

	return WeatherArticleRequestBaseSchema.extend({
		location: z.string({ message: errorMessages.typeErrors.string }).min(2, {
			message: errorMessages.location,
		}),
		targetDateTimestamp: z
			.number({ message: errorMessages.typeErrors.number })
			.positive({ message: errorMessages.typeErrors.positive })
			.nullable()
			.optional(),
		article: z.object({
			type: z.enum(
				[ArticleType.FACTUAL, ArticleType.BULVAR],
				{ message: errorMessages.articleType },
			),
		}, { message: errorMessages.typeErrors.object }),
	});
};
