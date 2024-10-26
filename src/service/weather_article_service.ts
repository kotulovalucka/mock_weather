import { WeatherClient } from '../client/weather_client.ts';
import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';

export class WeatherArticleService {
	private static instance: WeatherArticleService | undefined;
	private constructor() {}

	public static getInstance(): WeatherArticleService {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new WeatherArticleService();
		return this.instance;
	}

	public async getWeatherArticle(
		weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string> {
		const weatherClientInstance = WeatherClient.getInstance();
		const searchLocationResponse = await weatherClientInstance.searchLocationByName(
			weatherArticleRequest.location,
		);
		const locationInfo = searchLocationResponse[0];
		const weatherInfo = await weatherClientInstance.getForecastByLocationID(locationInfo.Key);
		if (!weatherInfo || !weatherInfo.Headline) {
			return 'Weather info not found';
		}
		// TODO: Implement weather article generation
		return JSON.stringify(weatherInfo, null, 2);
	}

	public async getWeatherArticleCollection(
		_weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string[]> {
		return await Promise.resolve(['Weather article 1', 'Weather article 2']);
	}
}
