export type AppConfig = {
	database: {
		host: string;
		port: number;
		user: string;
		password: string;
		database: string;
	};
	forecastApi: {
		url: string;
		apiKey: string;
	};
	llm: {
		url: string;
		apiKey: string;
	};
	cache: {
		article: {
			ttl: number;
			maxItems: number;
		};
	};
	rateLimit: {
		windowMs: number;
		limit: number;
	};
};
