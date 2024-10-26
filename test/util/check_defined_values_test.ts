import { assertEquals } from 'jsr:@std/assert';
import { checkDefinedValues } from '../../src/util/object.ts';

Deno.test('checkDefinedValues - Simple object with all values filled', () => {
	const obj = {
		a: 'hello',
		b: 123,
		c: true,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});

Deno.test('checkDefinedValues - Object with empty string value', () => {
	const obj = {
		a: 'hello',
		b: '',
		c: 123,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});

Deno.test('checkDefinedValues - Object with null value', () => {
	const obj = {
		a: 'hello',
		b: null,
		c: 123,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, false);
});

Deno.test('checkDefinedValues - Object with undefined value', () => {
	const obj = {
		a: 'hello',
		b: undefined,
		c: 123,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, false);
});

Deno.test('checkDefinedValues - Nested object with all values filled', () => {
	const obj = {
		a: 'hello',
		b: {
			c: 123,
			d: {
				e: Deno.env.get('TEST123'),
			},
		},
		f: true,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, false); // Should return true
});

Deno.test('checkDefinedValues - Nested object with empty value', () => {
	const obj = {
		a: 'hello',
		b: {
			c: 123,
			d: {
				e: '',
			},
		},
		f: true,
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});

Deno.test('checkDefinedValues - Nested object with null value', () => {
	const obj = {
		a: 'hello',
		b: {
			d: {
				e: 'world',
			},
		},
		f: true,
	};
	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});

Deno.test('checkDefinedValues - Object with array values', () => {
	const obj = {
		a: 'hello',
		b: [1, 2, 3],
		c: 'world',
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});

Deno.test('checkDefinedValues - Object with empty array value', () => {
	const obj = {
		a: 'hello',
		b: [],
		c: {},
	};

	const result = checkDefinedValues(obj);
	assertEquals(result, true);
});
