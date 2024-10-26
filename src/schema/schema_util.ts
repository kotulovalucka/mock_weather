import en from '../../i18n/en.json' with { type: 'json' };
import sk from '../../i18n/sk.json' with { type: 'json' };
import type { Language } from '../model/enum/language.ts';

const locales = { sk, en };

export const getSchemaErrorMessages = (lang: Language) => {
	return locales[lang].schemaErrors;
};
