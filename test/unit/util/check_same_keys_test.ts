import { assertEquals } from 'jsr:@std/assert';
import * as utils from '../../../src/util/object.ts';

const user = {
	name: 'John',
	settings: {
		theme: 'dark',
		notifications: true,
	},
};

const admin = {
	name: 123,
	settings: {
		theme: false,
		notifications: 'off',
	},
};

const randomUser = {
	name: 'Peter',
	settings: {
		notifications: true,
	},
};

Deno.test('checkSameKeys - Same keys', () => {
	const result = utils.haveSameKeys(user, admin);
	assertEquals(result, true);
});

Deno.test('checkSameKeys - Different keys', () => {
	const result = utils.haveSameKeys(user, randomUser);
	assertEquals(result, false);
});

Deno.test('checkSameKeys - One object is empty', () => {
	const result = utils.haveSameKeys(user, {});
	assertEquals(result, false);
});
