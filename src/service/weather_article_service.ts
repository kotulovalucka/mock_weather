import { WeatherClient } from '../client/weather_client.ts';
import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import { Language } from '../model/enum/language.ts';

export class WeatherArticleService {
	private static instance: WeatherArticleService | undefined;
	private weatherClientInstance = WeatherClient.getInstance();

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
		language: Language = Language.EN,
	): Promise<string> {
		const searchLocationResponse = await this.weatherClientInstance.searchLocationByName(
			weatherArticleRequest.location,
			language,
		);
		const locationInfo = searchLocationResponse[0];
		const weatherInfo = await this.weatherClientInstance.getForecastByLocationID(
			locationInfo.Key,
			language,
		);
		// TODO: Implement weather article generation
		return JSON.stringify(weatherInfo, null, 2);
	}

	public async getWeatherArticleCollection(
		_weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string[]> {
		return await Promise.resolve(['Weather article 1', 'Weather article 2']);
	}
}
