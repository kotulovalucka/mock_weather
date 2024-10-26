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
		_weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string> {
		return await Promise.resolve('Weather article');
	}

	public async getWeatherArticleCollection(
		_weatherArticleRequest: WeatherArticleRequestDto,
	): Promise<string[]> {
		return await Promise.resolve(['Weather article 1', 'Weather article 2']);
	}
}
