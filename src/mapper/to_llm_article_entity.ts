import type { WeatherArticleRequestDto } from '../model/dto/request/weather_article_request.dto.ts';
import type { WeatherArticleResponseDto } from '../model/dto/response/weather_article_response.dto.ts';
import { LLMArticleEntity } from '../model/entity/llm_article_entity.ts';
import { Language } from '../model/enum/language.ts';

export function mapToLLMArticleEntity(
	weatherArticleRequest: WeatherArticleRequestDto,
	language: Language,
	articleData: WeatherArticleResponseDto,
	locationKey: string,
): LLMArticleEntity {
	const articleEntity = new LLMArticleEntity();

	articleEntity.locationKey = locationKey;
	articleEntity.title = articleData.headline;
	articleEntity.language = language;
	articleEntity.articleType = weatherArticleRequest.article.type;
	articleEntity.perex = articleData.perex;
	articleEntity.description = articleData.description;

	return articleEntity;
}
