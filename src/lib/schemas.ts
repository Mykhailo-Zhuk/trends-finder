import { z } from "zod";

export const searchFormSchema = z.object({
  query: z
    .string()
    .min(1, "Введіть пошуковий запит")
    .max(100, "Запит занадто довгий")
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s\-.,&]+$/, "Запит містить недозволені символи"),
  platform: z.enum(["aliexpress", "alibaba", "both"]),
});

export const searchApiSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s\-.,&]+$/),
  platform: z.enum(["aliexpress", "alibaba", "both"]),
  page: z.coerce.number().int().min(1).max(100).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
export type SearchApiParams = z.infer<typeof searchApiSchema>;
