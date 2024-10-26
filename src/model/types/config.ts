export type AppConfig = {
	redis: {
		host: string;
		port: number;
	};
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
};
