import { z } from 'zod';

export const LLMTextOutputSchema = z.object({
	headline: z.string().min(1),
	perex: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
});

export const LLMArticleResponseSchema = z.object({
	id: z.string().uuid(),
	message: z.object({
		content: z.array(
			z.object({
				type: z.literal('text'),
				text: z.string().min(1),
			}),
		),
	}),
	finish_reason: z.literal('COMPLETE'),
});
