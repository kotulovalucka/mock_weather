import { APP_CONFIG } from '../config.ts';
import LOG from '../log/default_logger.ts';
import type { LocationSearchResponseDto } from '../model/dto/response/forecastApi/location_search.dto.ts';
import type { LocationWeatherResponseDto } from '../model/dto/response/forecastApi/location_weather.dto.ts';
import type { WeatherClientMockConfig } from '../model/types/weather_client_mock_config.ts';
import { LocationSearchResponseSchema } from '../schema/location_search_response_schema.ts';
import { LocationWeatherResponseSchema } from '../schema/location_weather_response_schema.ts';

export class WeatherClient {
	private static instance: WeatherClient | undefined;
	private apiUrl: string;
	private apiKey: string;

	private constructor(mockConfig: WeatherClientMockConfig = null) {
		if (mockConfig) {
			this.apiUrl = mockConfig.forecastApi.url;
			this.apiKey = mockConfig.forecastApi.apiKey;
		} else {
			this.apiUrl = APP_CONFIG.forecastApi.url;
			this.apiKey = APP_CONFIG.forecastApi.apiKey;
		}

		LOG.info(`Weather client initialized`, { apiUrl: this.apiUrl });
	}

	public static getInstance(mockConfig: WeatherClientMockConfig = null): WeatherClient {
		if (!this.instance) {
			this.instance = new WeatherClient(mockConfig);
		}
		return this.instance;
	}

	public async searchLocationByName(name: string): Promise<LocationSearchResponseDto> {
		const encodedQuery = encodeURIComponent(name);
		const url =
			`${this.apiUrl}/locations/v1/cities/search?apikey=${this.apiKey}&q=${encodedQuery}&language=en&details=false`;
		try {
			LOG.debug(`Searching for location: ${name}`);
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch location data: ${response.statusText}`);
			}

			const responseBody: unknown = await response.json();
			const parsedResult = LocationSearchResponseSchema.safeParse(responseBody);
			if (parsedResult.error) {
				LOG.error(`Failed to parse location data: ${parsedResult.error.errors}`);
				throw new Error(`Failed to parse location data: ${parsedResult.error.errors}`);
			}
			const data = parsedResult.data;
			if (data.length === 0) {
				LOG.warn(`No location found for query: ${name}`);
				throw new Error(`No location found for query: ${name}`);
			}

			LOG.debug(`Location found for query: ${name}`);
			return data;
		} catch (error) {
			LOG.error(`Error fetching location data for query: ${name}`, error);
			throw error;
		}
	}

	public async getForecastByLocationID(locationID: string): Promise<LocationWeatherResponseDto> {
		const url =
			`${this.apiUrl}/forecasts/v1/daily/1day/${locationID}?apikey=${this.apiKey}&details=true&metric=true`;

		try {
			LOG.debug(`Fetching forecast for location ID: ${locationID}`);
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch forecast data: ${response.statusText}`);
			}

			const responseBody: unknown = await response.json();
			const parsedResult = LocationWeatherResponseSchema.safeParse(responseBody);
			if (parsedResult.error) {
				LOG.error(`Failed to parse forecast data: ${parsedResult.error.errors}`);
				throw new Error(`Failed to parse forecast data: ${parsedResult.error.errors}`);
			}
			const data = parsedResult.data;
			LOG.debug(`Forecast fetched for location ID: ${locationID}`);

			return data;
		} catch (error) {
			LOG.error(`Error fetching forecast for location ID: ${locationID}`, error);
			throw error;
		}
	}
}
