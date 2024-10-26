import type { PaginationResult } from "../../types/pagination_result.ts";
import type { WeatherArticleResponseDto } from "./weather_article_response.dto.ts";

export type WeatherArticleCollectionResponseDto = PaginationResult<
  WeatherArticleResponseDto
>;
