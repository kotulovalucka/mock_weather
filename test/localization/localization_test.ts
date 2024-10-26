import { assertEquals } from 'jsr:@std/assert';

import { getTranslation } from '../../src/util/translation.ts';
import { Language } from '../../src/model/enum/language.ts';

Deno.test('getTranslation - Get translation fo sk', () => {
	const translation = getTranslation('test.test1', Language.SK);
	assertEquals(translation, 'Test1 sk');
});

Deno.test('getTranslation - Get translation fo en', () => {
	const translation = getTranslation('test.test1', Language.EN);
	assertEquals(translation, 'Test1 en');
});

Deno.test('getTranslation - Get translation fo en', () => {
	const translation = getTranslation('test.test1');
	assertEquals(translation, 'Test1 en');
});

Deno.test('getTranslation - Get translation for non existing key', () => {
	const translation = getTranslation('test.nonExisting');
	console.log(translation);
	assertEquals(translation, 'Translation not found');
});

Deno.test('getTranslation - Get nested translation', () => {
	const translation = getTranslation('test.innerTest.innerTest1');
	assertEquals(translation, 'InnerTest1 en');
});

Deno.test('getTranslation - Try to get translation for number type', () => {
	const translation = getTranslation('test.number');
	assertEquals(translation, 'Wrong translation value');
});

Deno.test('getTranslation - Try to get translation for null value', () => {
	const translation = getTranslation('test.null');
	assertEquals(translation, 'Wrong translation value');
});
