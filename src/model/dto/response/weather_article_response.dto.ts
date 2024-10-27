import type { z } from 'zod';
import type { LLMTextOutputSchema } from '../../../schema/client/llm_article_response_schema.ts';

export type WeatherArticleResponseDto = z.infer<typeof LLMTextOutputSchema>;
