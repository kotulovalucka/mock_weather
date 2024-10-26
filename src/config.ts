import type { AppConfig } from './model/types/config.ts';

export const APP_CONFIG: AppConfig = {
	redis: {
		host: Deno.env.get('REDIS_HOST') || 'localhost',
		port: Number(Deno.env.get('REDIS_PORT')) || 6379,
	},
	database: {
		host: Deno.env.get('DB_HOST') || 'localhost',
		port: Number(Deno.env.get('DB_PORT')) || 5432,
		user: Deno.env.get('DB_USER')!,
		password: Deno.env.get('DB_PASSWORD')!,
		database: Deno.env.get('DB_NAME')!,
	},
	forecastApi: {
		url: Deno.env.get('WEATHER_API_URL')!,
		apiKey: Deno.env.get('WEATHER_API_KEY')!,
	},
	llm: {
		url: Deno.env.get('LLM_API_URL')!,
		apiKey: Deno.env.get('LLM_API_KEY')!,
	},
};
