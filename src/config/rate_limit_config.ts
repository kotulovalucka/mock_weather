import { APP_CONFIG } from './app_config.ts';
import rateLimit from 'npm:express-rate-limit';
import * as localizationUtil from '../util/localization.ts';

export const RATE_LIMIT_CONFIG = rateLimit({
	windowMs: APP_CONFIG.rateLimit.windowMs,
	limit: APP_CONFIG.rateLimit.limit,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	statusCode: 429,
	handler: (req, res) => {
		const language = req['headers']['accept-language'];
		res.status(429).json({
			message: localizationUtil.getTranslation(
				'weatherServiceGeneralMessages.rateLimitExceeded',
				language,
			),
		});
	},
});
