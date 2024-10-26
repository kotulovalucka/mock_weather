import { assertEquals } from 'jsr:@std/assert';
import {
	LocationSearchObjectResponseSchema,
	LocationSearchResponseSchema,
} from '../../../src/schema/location_search_response_schema.ts';
// Valid mock data for LocationSearchResponseSchema
const validLocationSearchData = [{
	Key: '301523',
	LocalizedName: 'Parnica',
	Country: {
		ID: 'SK',
		LocalizedName: 'Slovakia',
	},
}];

const invalidLocationSearchData = [{
	Key: 301523,
	LocalizedName: 'Parnica',
	Country: {
		ID: 'SK',
		LocalizedName: 123,
	},
}];

const missingKeyLocationSearchData = [{
	LocalizedName: 'Parnica',
	Country: {
		ID: 'SK',
		LocalizedName: 'Slovakia',
	},
}];

const notArrayLocationSearchData = {
	Key: '301523',
	LocalizedName: 'Parnica',
	Country: {
		ID: 'SK',
		LocalizedName: 'Slovakia',
	},
};

Deno.test('LocationSearchResponseSchema - Valid data', () => {
	const result = LocationSearchResponseSchema.safeParse(validLocationSearchData);
	assertEquals(result.success, true);
});

Deno.test('LocationSearchResponseSchema - Invalid data', () => {
	const result = LocationSearchResponseSchema.safeParse(invalidLocationSearchData);
	assertEquals(result.success, false);
});

Deno.test('LocationSearchResponseSchema - Missing key', () => {
	const result = LocationSearchResponseSchema.safeParse(missingKeyLocationSearchData);
	assertEquals(result.success, false);
});

Deno.test('LocationSearchResponseSchema - Missing whole object', () => {
	const result = LocationSearchResponseSchema.safeParse({});
	assertEquals(result.success, false);
});

Deno.test('LocationSearchResponseSchema - Not an array', () => {
	const result = LocationSearchResponseSchema.safeParse(notArrayLocationSearchData);
	assertEquals(result.success, false);
});

Deno.test('LocationSearchResponseSchema - Plain object check', () => {
	const result = LocationSearchObjectResponseSchema.safeParse(validLocationSearchData[0]);
	assertEquals(result.success, true);
});
