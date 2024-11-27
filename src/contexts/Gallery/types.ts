import { z } from 'zod';

export const Dimentions = z.object({
  height: z.coerce.number(),
  width: z.coerce.number(),
});

export type Dimentions = z.infer<typeof Dimentions>;

export const PhotoData = z.object({
  title: z.string().nullable(),
  dateTaken: z.coerce.date(),
  localization: z.string(),
  description: z.string().nullable(),
});

export type PhotoData = z.infer<typeof PhotoData>;

export const Photo = z.object({
  id: z.string(),
  dimensions: Dimentions,
  data: PhotoData,
});

export type Photo = z.infer<typeof Photo>;

export const GetAllResponse = z.object({
  images: z.array(Photo),
  count: z.number(),
});

export type GetAllResponse = z.infer<typeof GetAllResponse>;

export type PhotoPreview = {
  id: string;
  lowRes: Blob;
  cover: Blob;
};
