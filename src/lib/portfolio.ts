import axios from 'axios';
import { z } from 'zod';
import { API_URL } from '~/config';

const nullableNum = z.coerce.number().nullish().catch(null);
const nullableStr = z.string().nullish().catch(null);

export const ImageRole = z.enum(['HERO', 'LARGE', 'NORMAL']).catch('NORMAL');
export type ImageRole = z.infer<typeof ImageRole>;

export const Orientation = z.enum(['LANDSCAPE', 'PORTRAIT', 'SQUARE']);
export type Orientation = z.infer<typeof Orientation>;

export const Exif = z
  .object({
    cameraMake: nullableStr,
    cameraModel: nullableStr,
    lens: nullableStr,
    focalLength: nullableNum,
    fNumber: nullableNum,
    iso: nullableNum,
    exposureTime: nullableStr,
    takenAt: nullableStr,
  })
  .partial()
  .catch({});
export type Exif = z.infer<typeof Exif>;

export const PortfolioImage = z.object({
  imageId: z.string(),
  order: z.coerce.number().catch(0),
  role: ImageRole,
  coverUrl: z.string(),
  lowResUrl: z.string(),
  width: nullableNum,
  height: nullableNum,
  orientation: Orientation.nullish().catch(null),
  localization: nullableStr,
  exif: Exif,
});
export type PortfolioImage = z.infer<typeof PortfolioImage>;

export const GalleryListItem = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: nullableStr,
  coverUrl: nullableStr,
  imageCount: z.coerce.number().catch(0),
});
export type GalleryListItem = z.infer<typeof GalleryListItem>;

export const GalleryListResponse = z.object({
  total: z.coerce.number().catch(0),
  galleries: z.array(GalleryListItem).catch([]),
});
export type GalleryListResponse = z.infer<typeof GalleryListResponse>;

export const GalleryDetailResponse = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: nullableStr,
  coverUrl: nullableStr,
  imageCount: z.coerce.number().catch(0),
  items: z.array(PortfolioImage).catch([]),
});
export type GalleryDetailResponse = z.infer<typeof GalleryDetailResponse>;

export const HeroResponse = z.object({
  images: z.array(PortfolioImage).catch([]),
});
export type HeroResponse = z.infer<typeof HeroResponse>;

export const HomeSection = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: nullableStr,
  coverUrl: nullableStr,
  imageCount: z.coerce.number().catch(0),
  previewItems: z.array(PortfolioImage).catch([]),
});
export type HomeSection = z.infer<typeof HomeSection>;

export const HomeResponse = z.object({
  hero: z.array(PortfolioImage).catch([]),
  sections: z.array(HomeSection).catch([]),
});
export type HomeResponse = z.infer<typeof HomeResponse>;

export const PortfolioSettings = z.object({
  heroLimit: z.coerce.number().catch(12),
  galleryPreviewCount: z.coerce.number().catch(6),
  homeGalleryLimit: z.coerce.number().nullish().catch(null),
  galleryPageSize: z.coerce.number().catch(24),
});
export type PortfolioSettings = z.infer<typeof PortfolioSettings>;

export const ImageMeta = z.object({
  author: nullableStr,
  dateTaken: nullableStr,
  title: nullableStr,
  description: nullableStr,
  localization: nullableStr,
});
export type ImageMeta = z.infer<typeof ImageMeta>;

export const GearCategory = z
  .enum(['CAMERA', 'LENS', 'TRIPOD', 'BAG', 'LIGHTING', 'ACCESSORY', 'OTHER'])
  .catch('OTHER');
export type GearCategory = z.infer<typeof GearCategory>;

export const GearItem = z.object({
  id: z.string(),
  category: GearCategory,
  brand: z.string().catch(''),
  model: z.string().catch(''),
  systemId: nullableStr,
  description: nullableStr,
  coverUrl: nullableStr,
  lowResUrl: nullableStr,
  order: z.coerce.number().catch(0),
  visible: z.boolean().catch(true),
});
export type GearItem = z.infer<typeof GearItem>;

export const GearSystem = z.object({
  id: z.string(),
  name: z.string(),
  label: nullableStr,
  description: nullableStr,
  coverUrl: nullableStr,
  lowResUrl: nullableStr,
  order: z.coerce.number().catch(0),
  visible: z.boolean().catch(true),
  items: z.array(GearItem).catch([]),
});
export type GearSystem = z.infer<typeof GearSystem>;

export const GearOverview = z.object({
  systems: z.array(GearSystem).catch([]),
  ungrouped: z.array(GearItem).catch([]),
});
export type GearOverview = z.infer<typeof GearOverview>;

const client = axios.create({ baseURL: API_URL });

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const fetchHero = async (limit = 12, signal?: AbortSignal): Promise<HeroResponse> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockHero(limit, signal);
  const res = await client.get('/portfolio/hero', { params: { limit }, signal });
  return HeroResponse.parse(res.data);
};

export const fetchGalleries = async (signal?: AbortSignal): Promise<GalleryListResponse> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockGalleries(signal);
  const res = await client.get('/portfolio/galleries', { signal });
  return GalleryListResponse.parse(res.data);
};

export const fetchHome = async (signal?: AbortSignal): Promise<HomeResponse> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockHome();
  const res = await client.get('/portfolio/home', { signal });
  return HomeResponse.parse(res.data);
};

export const fetchSettings = async (signal?: AbortSignal): Promise<PortfolioSettings> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockSettings();
  const res = await client.get('/portfolio/settings', { signal });
  return PortfolioSettings.parse(res.data);
};

export type GalleryQuery = { orientation?: Orientation; take?: number; skip?: number };

export const fetchGalleryBySlug = async (
  slug: string,
  query: GalleryQuery = {},
  signal?: AbortSignal,
): Promise<GalleryDetailResponse> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockGalleryBySlug(slug, query);
  const res = await client.get(`/portfolio/galleries/${encodeURIComponent(slug)}`, {
    params: { orientation: query.orientation, take: query.take, skip: query.skip },
    signal,
  });
  return GalleryDetailResponse.parse(res.data);
};

export const fetchImageMeta = async (id: string, signal?: AbortSignal): Promise<ImageMeta> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockImageMeta(id, signal);
  const res = await client.get('/image', { params: { id }, signal });
  return ImageMeta.parse(res.data);
};

export const fetchGear = async (signal?: AbortSignal): Promise<GearOverview> => {
  if (USE_MOCK) return (await import('~/lib/mock')).mockGear();
  const res = await client.get('/portfolio/gear', { signal });
  return GearOverview.parse(res.data);
};

export const aspectRatio = (img: Pick<PortfolioImage, 'width' | 'height' | 'orientation'>): number => {
  if (img.width && img.height && img.height > 0) return img.width / img.height;
  if (img.orientation === 'PORTRAIT') return 2 / 3;
  if (img.orientation === 'SQUARE') return 1;
  return 3 / 2;
};

export const formatExifSpecs = (exif: Exif): string =>
  [
    exif.focalLength ? `${exif.focalLength}mm` : null,
    exif.fNumber ? `f/${exif.fNumber}` : null,
    exif.exposureTime ?? null,
    exif.iso ? `ISO ${exif.iso}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ');

export const formatCamera = (exif: Exif): string => [exif.cameraMake, exif.cameraModel].filter(Boolean).join(' ');

export const hasExif = (exif: Exif): boolean => Object.values(exif).some((v) => v !== null && v !== undefined);
