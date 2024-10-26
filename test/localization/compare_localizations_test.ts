import { assertEquals } from 'jsr:@std/assert';
import en from '../../i18n/en.json' with { type: 'json' };
import sk from '../../i18n/sk.json' with { type: 'json' };
import * as utils from '../../src/util/object.ts';

Deno.test('compare_localizations_test - Both should have same keys', () => {
	const result = utils.haveSameKeys(en, sk);
	assertEquals(result, true);
});
