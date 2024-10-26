export class WeatherClient {
	private static instance: WeatherClient | undefined;
	private constructor() {}

	public static getInstance(): WeatherClient {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new WeatherClient();
		return this.instance;
	}

	public async getWeather(_location: string): Promise<string> {
		return await Promise.resolve('Sunny');
	}
}
