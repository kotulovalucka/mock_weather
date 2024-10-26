import { z } from "zod";
import type { WeatherArticleGetCollectionRequestSchema } from "../../../schema/weather_article_schema.ts";

export type WeatherArticleRequestCollectionDto = z.infer<
  typeof WeatherArticleGetCollectionRequestSchema
>;
