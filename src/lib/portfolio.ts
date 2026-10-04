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
  /** Contact form config for the requested locale — decides whether "Ask about…" is offered. */
  contact: z
    .lazy(() => ContactConfig)
    .nullish()
    .catch(null),
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
  .enum([
    'CAMERA',
    'FILM_CAMERA',
    'LENS',
    'TELECONVERTER',
    'ADAPTER',
    'FILTER',
    'TELESCOPE',
    'SMART_TELESCOPE',
    'ASTRO_CAMERA',
    'GUIDE_SCOPE',
    'MOUNT',
    'EYEPIECE',
    'BINOCULARS',
    'DIAGONAL',
    'DEW_HEATER',
    'TRIPOD',
    'HEAD',
    'GIMBAL',
    'FLASH',
    'LIGHTING',
    'LIGHT_MODIFIER',
    'BATTERY',
    'CHARGER',
    'POWER_BANK',
    'POWER_STATION',
    'DRONE',
    'ACTION_CAM',
    'REMOTE',
    'MEMORY_CARD',
    'CARD_READER',
    'STORAGE',
    'COMPUTER',
    'BAG',
    'STRAP',
    'RAIN_COVER',
    'CLEANING',
    'CABLE',
    'ACCESSORY',
    'OTHER',
  ])
  .catch('OTHER');
export type GearCategory = z.infer<typeof GearCategory>;

export const GearItem = z.object({
  id: z.string(),
  category: GearCategory,
  brand: z.string().catch(''),
  model: z.string().catch(''),
  ownership: z.enum(['OWNED', 'WISHLIST', 'RETIRED']).catch('OWNED'),
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


export const fetchHero = async (limit = 12, signal?: AbortSignal): Promise<HeroResponse> => {
  const res = await client.get('/portfolio/hero', { params: { limit }, signal });
  return HeroResponse.parse(res.data);
};

export const fetchGalleries = async (signal?: AbortSignal): Promise<GalleryListResponse> => {
  const res = await client.get('/portfolio/galleries', { signal });
  return GalleryListResponse.parse(res.data);
};

export const fetchHome = async (signal?: AbortSignal): Promise<HomeResponse> => {
  const res = await client.get('/portfolio/home', { signal });
  return HomeResponse.parse(res.data);
};

export const fetchSettings = async (signal?: AbortSignal): Promise<PortfolioSettings> => {
  const res = await client.get('/portfolio/settings', { signal });
  return PortfolioSettings.parse(res.data);
};

export type GalleryQuery = { orientation?: Orientation; take?: number; skip?: number };

export const fetchGalleryBySlug = async (
  slug: string,
  query: GalleryQuery = {},
  signal?: AbortSignal,
): Promise<GalleryDetailResponse> => {
  const locale = contactLocale();
  const res = await client.get(`/portfolio/galleries/${encodeURIComponent(slug)}`, {
    params: { orientation: query.orientation, locale, take: query.take, skip: query.skip },
    signal,
  });
  const data = GalleryDetailResponse.parse(res.data);
  // Same payload as GET /portfolio/contact — reuse it so the contact page needn't refetch.
  if (data.contact && !contactCache.has(locale)) contactCache.set(locale, Promise.resolve(data.contact));
  return data;
};

export const fetchImageMeta = async (id: string, signal?: AbortSignal): Promise<ImageMeta> => {
  const res = await client.get('/image', { params: { id }, signal });
  return ImageMeta.parse(res.data);
};

export const fetchGear = async (signal?: AbortSignal): Promise<GearOverview> => {
  const res = await client.get('/portfolio/gear', { signal });
  return GearOverview.parse(res.data);
};

export const InquiryTopic = z.enum(['SESSION', 'PRINT', 'LICENSE', 'COLLABORATION', 'OTHER']);
export type InquiryTopic = z.infer<typeof InquiryTopic>;

export const INQUIRY_TOPIC_LABEL: Record<InquiryTopic, string> = {
  SESSION: 'Photo session',
  PRINT: 'Print / photo purchase',
  LICENSE: 'Usage license',
  COLLABORATION: 'Collaboration',
  OTHER: 'Other',
};

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  topic: InquiryTopic;
  message: string;
  galleryId?: string;
  imageId?: string;
  acknowledgedPrivacyNotice: true;
  /** Language the visitor used — the one the contact config was resolved to. */
  locale?: string;
  website: string;
};

export type InquiryError = 'rate' | 'context' | 'disabled' | 'invalid' | 'error';

const errorMessage = (data: unknown): string => {
  const msg = (data as { message?: unknown } | undefined)?.message;
  return Array.isArray(msg) ? msg.join(' ') : typeof msg === 'string' ? msg : '';
};

export const inquiryErrorOf = (e: unknown): InquiryError => {
  if (!axios.isAxiosError(e) || !e.response) return 'error';
  if (e.response.status === 429) return 'rate';
  if (e.response.status === 403) return 'disabled';
  if (e.response.status === 400)
    return /unknown gallery or photo/i.test(errorMessage(e.response.data)) ? 'context' : 'invalid';
  return 'error';
};

export const submitInquiry = async (payload: InquiryPayload): Promise<void> => {
  await client.post('/portfolio/inquiries', payload);
};

export const ContactConfig = z.object({
  enabled: z.boolean().catch(false),
  /** Locale the texts were resolved to. */
  locale: z.string().catch('en'),
  intro: nullableStr,
  topics: z.array(InquiryTopic.or(z.string())).catch([]),
  privacyNotice: nullableStr,
  /** Language of the notice — differs from `locale` when the backend fell back to its default. */
  privacyNoticeLocale: nullableStr,
  privacyNoticeVersion: nullableNum,
  privacyNoticeFallback: z.boolean().catch(false),
  administrator: z.object({ name: z.string(), email: z.string(), address: nullableStr }).nullish().catch(null),
});
export type ContactConfig = z.infer<typeof ContactConfig>;

/** Offered topics, in canonical order, ignoring values this build doesn't know. */
export const contactTopics = (c: ContactConfig): InquiryTopic[] =>
  InquiryTopic.options.filter((t) => c.topics.includes(t));

/** The form is usable only when enabled with a notice to acknowledge and at least one topic. */
export const contactFormOpen = (c: ContactConfig | null | undefined): c is ContactConfig & { privacyNotice: string } =>
  !!(c?.enabled && c.privacyNotice && contactTopics(c).length);

/** Languages the contact texts (intro, privacy notice) are offered in. */
export const CONTACT_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
] as const;

/**
 * Where the visitor writes from: Polish for Polish browsers, English otherwise (the site UI is
 * English, so not the backend's default). This decides the form's texts, the `locale` sent with
 * an inquiry and therefore which privacy notice is recorded as acknowledged — reading another
 * translation in the privacy modal does not change it.
 */
export const contactLocale = (): string => {
  const langs = typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language];
  return langs[0]?.toLowerCase().startsWith('pl') ? 'pl' : 'en';
};

// Shared by the footer and the contact page — one request per locale per page load.
const contactCache = new Map<string, Promise<ContactConfig>>();
export const fetchContact = (locale: string): Promise<ContactConfig> => {
  let pending = contactCache.get(locale);
  if (!pending) {
    pending = (async () => {
      const res = await client.get('/portfolio/contact', { params: { locale } });
      return ContactConfig.parse(res.data);
    })().catch((e) => {
      contactCache.delete(locale);
      throw e;
    });
    contactCache.set(locale, pending);
  }
  return pending;
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
