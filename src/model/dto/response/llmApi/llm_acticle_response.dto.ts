import type { z } from 'zod';
import type { LLMArticleResponseSchema } from '../../../../schema/client/llm_article_response_schema.ts';

export type LLMActicleResponseDto = z.infer<typeof LLMArticleResponseSchema>;
