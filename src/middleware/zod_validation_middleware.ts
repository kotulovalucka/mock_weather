import { NextFunction, Request, Response } from 'express';
import * as schemaUtils from '../schema/schema_util.ts';
import { ZodSchema } from 'zod';
import { Language } from '../model/enum/language.ts';

export const validate = (schemaFactory: (lang: Language) => ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const lang = (req.headers['accept-language'] === 'sk' ? Language.SK : Language.EN) ||
			Language.EN;
		const schema = schemaFactory(lang);

		const parseResult = schema.safeParse(req.body);

		if (!parseResult.success) {
			// Return 400 error if validation fails
			return res.status(400).json({
				error: schemaUtils.getErrorMessages(lang).general,
				details: parseResult.error.errors,
			});
		}

		req.body = parseResult.data;
		next();
	};
};
