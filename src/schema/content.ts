import z from 'zod';

const commonSchema = {
  title: z.string().min(1, 'Title is required').max(255).trim(),
  author: z.string().min(1, 'Author is required').max(255).trim(),
  category: z.string().min(1, 'Category is required'),
  rating: z.number().min(1).max(5),
  description: z.string().min(1, 'Description is required').max(2000).trim(),
};

export const createContentSchema = z
  .object({
    ...commonSchema,
  })
  .strict();

export const updateContentSchema = z
  .object({
    ...commonSchema,
    deletedMainImage: z.string().trim().optional(),
    deletedPdf: z.string().trim().optional(),
    deletedAudio: z.string().trim().optional(),
    deletedGallery: z.array(z.string().trim()).optional(),
  })
  .strict();

export type ICreateContent = z.infer<typeof createContentSchema>;
export type IUpdateContent = z.infer<typeof updateContentSchema>;
