import type { WeatherArticleCollectionRequestQueryDto } from '../model/dto/request/weather_article_collection_request_query.dto.ts';

export function mapToDefaultArticleCollectionQuery(
	requestQuery: WeatherArticleCollectionRequestQueryDto,
) {
	return {
		limit: +requestQuery.limit,
		offset: +requestQuery.offset,
		locationName: requestQuery.locationName,
		dateFrom: requestQuery.dateFrom ? +requestQuery.dateFrom : undefined,
		dateTo: requestQuery.dateTo ? +requestQuery.dateTo : undefined,
		articleType: requestQuery.articleType,
	};
}
