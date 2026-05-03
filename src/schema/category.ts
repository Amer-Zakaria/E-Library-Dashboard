import z from 'zod';

const commonSchema = {
  name: z.string().min(1, 'Name is required').max(255).trim(),
  description: z.string().max(500).trim().optional(),
};

export const createCategorySchema = z
  .object({
    ...commonSchema,
  })
  .strict();

export const updateCategorySchema = z
  .object({
    ...commonSchema,
    deletedImg: z.string().trim().optional(),
  })
  .strict();

export type ICreateCategory = z.infer<typeof createCategorySchema>;
export type IUpdateCategory = z.infer<typeof updateCategorySchema>;
