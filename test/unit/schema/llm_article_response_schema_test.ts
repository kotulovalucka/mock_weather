import { LLMArticleResponseSchema } from '../../../src/schema/client/llm_article_response_schema.ts';
import { assertEquals } from 'jsr:@std/assert';

const validLLMArticleData = {
	message: {
		id: '3567b6de-0d22-4967-82ba-f62d07d82a9a',
		message: {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						headline: 'Teplé počasie od pondelka do utorka v Podbrezovej, Slovensko',
						perex: 'Predpoveď počasia naznačuje príjemné a mierne teploty v nasledujúcich dňoch.',
						description:
							'V Podbrezovej, Slovensko, sa od pondelka do utorka očakáva teplé a príjemné počasie. Teploty počas dňa dosiahnu maximálne 18,5 °C, s minimálnou nocnou teplotou 6,4 °C. V pondelok bude obloha mierne zatažená s 40% pravdepodobnosťou dažďa. Veterný van bude mierny, s rýchlosťou okolo 14,8 km/h z juhozápadu. Relatívna vlhkosť vzduchu sa bude pohybovať medzi 63% a 75%.',
						location: 'Podbrezová, Slovensko',
					}),
				},
			],
		},
		finish_reason: 'COMPLETE',
	},
};

const invalidLLMArticleData = {
	message: {
		id: '3567b6de-0d22-4967-82ba-f62d07d82a9a',
		message: {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						headline: 'Teplé počasie od pondelka do utorka v Podbrezovej, Slovensko',
						// - perex key
						description: 'This is a test description.',
						location: 'Podbrezová, Slovensko',
					}),
				},
			],
		},
		finish_reason: 'COMPLETE',
	},
};

const secondInvalidLLMArticleData = {
	message: {
		id: '3567b6de-0d22-4967-82ba-f62d07d82a9a',
		message: {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						headline: '',
						perex: 'This is a test perex.',
						description: 'This is a test description.',
						location: 'Podbrezová, Slovensko',
					}),
				},
			],
		},
		finish_reason: 'COMPLETE',
	},
};

Deno.test('LLMArticleResponseSchema - Valid data', () => {
	const result = LLMArticleResponseSchema
		.safeParse(validLLMArticleData);
	assertEquals(result.success, true);
});

Deno.test('LLMArticleResponseSchema - Invalid data (missing keys in content JSON)', () => {
	const result = LLMArticleResponseSchema.safeParse(invalidLLMArticleData);
	assertEquals(result.success, false);
});

Deno.test('LLMArticleResponseSchema - Invalid finish_reason', () => {
	const result = LLMArticleResponseSchema.safeParse({
		...validLLMArticleData,
		message: { ...validLLMArticleData.message, finish_reason: 'BLABLA' },
	});
	assertEquals(result.success, false);
});

Deno.test('LLMArticleResponseSchema - Missing id field', () => {
	const result = LLMArticleResponseSchema.safeParse({
		message: {
			...validLLMArticleData.message,
			id: undefined,
		},
	});
	assertEquals(result.success, false);
});

Deno.test('LLMArticleResponseSchema - Missing entire message object', () => {
	const result = LLMArticleResponseSchema.safeParse({});
	assertEquals(result.success, false);
});

Deno.test('LLMArticleResponseSchema - Invalid data (headline too short)', () => {
	const result = LLMArticleResponseSchema.safeParse(secondInvalidLLMArticleData);
	assertEquals(result.success, false);
});
