import { Request, Response, Router } from "npm:express@5.0.1";

import type { WeatherArticleRequestDto } from "../model/dto/request/weather_article_request.dto.ts";
import type { WeatherArticleCollectionResponseDto } from "../model/dto/response/weather_article_collection_response.dto.ts";
import { validate } from "../middleware/zod_validation_middleware.ts";
import {
  WeatherArticleGetCollectionRequestSchema,
  WeatherArticleGetSingleRequestSchema,
} from "../schema/weather_article_schema.ts";
import { WeatherArticleService } from "../service/weather_article_service.ts";
import type { WeatherArticleRequestCollectionDto } from "../model/dto/request/weather_article_collection_request.dto.ts";
import type { WeatherArticleResponseDto } from "../model/dto/response/weather_article_response_collectio_dto.ts";

export const weatherArticleController = Router();

weatherArticleController.get(
  "/article",
  validate(WeatherArticleGetSingleRequestSchema),
  async (
    req: Request<WeatherArticleRequestDto>,
    res: Response<WeatherArticleResponseDto>,
  ) => {
    const validatedData = req.body as WeatherArticleRequestDto;
    const weatherArticleService = WeatherArticleService.getInstance();
    const weatherArticle = await weatherArticleService.getWeatherArticle(
      validatedData,
    );

    res.status(200).json({ message: weatherArticle });
  },
);

weatherArticleController.get(
  "/article/collection",
  validate(WeatherArticleGetCollectionRequestSchema),
  async (
    req: Request<WeatherArticleRequestCollectionDto>,
    res: Response<WeatherArticleCollectionResponseDto>,
  ) => {
    const validatedData = req.body as WeatherArticleRequestCollectionDto;
    const weatherArticleService = WeatherArticleService.getInstance();
    const weatherArticleCollection = await weatherArticleService
      .getWeatherArticleCollection(validatedData);

    res.status(200).json({ message: weatherArticleCollection });
  },
);
