import { Language } from '../model/enum/language.ts';
import en from '../../i18n/en.json' with { type: 'json' };
import sk from '../../i18n/sk.json' with { type: 'json' };

const locales = { sk, en };
const notFoundFallbackMessage = 'Translation not found';
const wrongValueOfTranslationMessage = 'Wrong translation value';

export function getTranslation(key: string, language: Language = Language.EN): string {
	try {
		const keys = key.split('.');
		// deno-lint-ignore no-explicit-any
		let current: any = locales[language];

		for (const k of keys) {
			if (current[k] === undefined) {
				return notFoundFallbackMessage;
			}
			current = current[k];
		}

		if (typeof current !== 'string') {
			return wrongValueOfTranslationMessage;
		}

		return current;
	} catch (_error: unknown) {
		return notFoundFallbackMessage;
	}
}
