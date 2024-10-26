import { assertEquals } from 'jsr:@std/assert';
import { ArticleType } from '../../src/model/enum/article_type.ts';
import { Language } from '../../src/model/enum/language.ts';
import { WeatherArticleRequestSchema } from '../../src/schema/weather_article_schema.ts';
import * as schemaUtils from '../../src/schema/schema_util.ts';

Deno.test('WeatherArticleRequestSchema - Valid input', () => {
	const lang = Language.EN;
	const schema = WeatherArticleRequestSchema(lang);

	const validData = {
		location: 'Paris',
		targetDateTimestamp: 1672531199,
		article: {
			type: ArticleType.FACTUAL,
		},
	};

	const result = schema.safeParse(validData);
	assertEquals(result.success, true);
});

Deno.test('WeatherArticleRequestSchema - Invalid location (too short)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleRequestSchema(lang);
	const errorMessages = schemaUtils.getErrorMessages(lang);

	const invalidData = {
		location: 'A', // short
		targetDateTimestamp: 1672531199,
		article: {
			type: ArticleType.FACTUAL,
		},
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.location);
	}
});

Deno.test('WeatherArticleRequestSchema - Invalid type in article', () => {
	const lang = Language.EN;
	const schema = WeatherArticleRequestSchema(lang);
	const errorMessages = schemaUtils.getErrorMessages(lang);

	const invalidData = {
		location: 'Paris',
		targetDateTimestamp: 1672531199,
		article: {
			type: 'INVALID_TYPE',
		},
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.articleType);
	}
});

Deno.test('WeatherArticleRequestSchema - Invalid type in article', () => {
	const lang = Language.SK;
	const schema = WeatherArticleRequestSchema(lang);
	const errorMessages = schemaUtils.getErrorMessages(lang);

	const invalidData = {
		location: 'Paris',
		targetDateTimestamp: 1672531199,
		article: {
			type: 'INVALID_TYPE',
		},
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.articleType);
	}
});

Deno.test('WeatherArticleRequestSchema - Missing targetDateTimestamp (optional)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleRequestSchema(lang);

	const validData = {
		location: 'Paris',
		article: {
			type: ArticleType.BULVAR,
		},
	};

	const result = schema.safeParse(validData);
	assertEquals(result.success, true);
});

Deno.test('WeatherArticleRequestSchema - Invalid targetDateTimestamp (negative number)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleRequestSchema(lang);
	const errorMessages = schemaUtils.getErrorMessages(lang);

	const invalidData = {
		location: 'Paris',
		targetDateTimestamp: -123, // Negative number
		article: {
			type: ArticleType.FACTUAL,
		},
	};

	const result = schema.safeParse(invalidData);

	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.typeErrors.positive);
	}
});
