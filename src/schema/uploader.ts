import z from 'zod';

export const createUploaderSchema = z
  .object({
    username: z.string().min(1).max(255).trim(),
    password: z.string().min(6).max(255),
  })
  .strict();

/* Extracting typescript types from schemas  */
export type ICreateUploader = z.infer<typeof createUploaderSchema>;
