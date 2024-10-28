import { assertEquals } from 'jsr:@std/assert';
import { ArticleType } from '../../../src/model/enum/article_type.ts';
import { Language } from '../../../src/model/enum/language.ts';
import { WeatherArticleCollectionRequestSchema } from '../../../src/schema/weather_article_collection_schema.ts';
import * as schemaUtils from '../../../src/schema/schema_util.ts';

Deno.test('WeatherArticleCollectionRequestSchema - Valid input', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);

	const validData = {
		limit: '5',
		offset: '0',
		locationName: 'Paris',
		dateFrom: '1672531199',
		dateTo: '1672531299',
		articleType: ArticleType.FACTUAL,
	};

	const result = schema.safeParse(validData);
	assertEquals(result.success, true);
});

Deno.test('WeatherArticleCollectionRequestSchema - Invalid limit (exceeds max)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	const invalidData = {
		limit: '15', // exceeds max
		offset: '0',
		locationName: 'Paris',
		dateFrom: '1672531199',
		dateTo: '1672531299',
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.limitMax10);
	}
});

Deno.test('WeatherArticleCollectionRequestSchema - Invalid offset (negative number)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	const invalidData = {
		limit: '5',
		offset: '-1', // negative offset
		locationName: 'Paris',
		dateFrom: '1672531199',
		dateTo: '1672531299',
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.typeErrors.nonNegative);
	}
});

// Test for invalid locationName (too short)
Deno.test('WeatherArticleCollectionRequestSchema - Invalid locationName (too short)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	const invalidData = {
		limit: '5',
		offset: '0',
		locationName: '', // too short
		dateFrom: '1672531199',
		dateTo: '1672531299',
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.location);
	}
});

// Test for invalid dateFrom (negative number)
Deno.test('WeatherArticleCollectionRequestSchema - Invalid dateFrom (negative number)', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	const invalidData = {
		limit: '5',
		offset: '0',
		locationName: 'Paris',
		dateFrom: '-123', // negative number
		dateTo: '1672531299',
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.typeErrors.positive);
	}
});

// Test for invalid articleType
Deno.test('WeatherArticleCollectionRequestSchema - Invalid articleType', () => {
	const lang = Language.EN;
	const schema = WeatherArticleCollectionRequestSchema(lang);
	const errorMessages = schemaUtils.getSchemaErrorMessages(lang);

	const invalidData = {
		limit: '5',
		offset: '0',
		locationName: 'Paris',
		dateFrom: '1672531199',
		dateTo: '1672531299',
		articleType: 'INVALID_TYPE',
	};

	const result = schema.safeParse(invalidData);
	assertEquals(result.success, false);
	if (!result.success) {
		assertEquals(result.error.issues[0].message, errorMessages.articleType);
	}
});
