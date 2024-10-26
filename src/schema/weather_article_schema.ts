import { ArticleType } from "../model/enum/article_type.ts";
import { z } from "zod";

const ArticleTypeSchema = z.enum([
  ArticleType.FACTUAL,
  ArticleType.BULVAR,
  ArticleType.DRAMATIC,
  ArticleType.SHORT,
]);

const LanguageSchema = z.enum(["sk", "en"]);

export const WeatherArticleGetSingleRequestSchema = z.object({
  location: z.string().min(2),
  targetDateTimestamp: z.number().positive().nullable().optional(),
  article: z.object({
    type: ArticleTypeSchema,
    language: LanguageSchema,
  }),
});

export const WeatherArticleGetCollectionRequestSchema = z.object({
  location: z.string().min(2),
  article: z.object({
    type: ArticleTypeSchema,
    language: LanguageSchema,
  }),
});
