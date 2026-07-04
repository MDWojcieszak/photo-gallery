import axios from 'axios';
import { z } from 'zod';
import { API_URL } from '~/config';
import {
  Exif,
  GalleryDetailResponse,
  GalleryListResponse,
  GalleryQuery,
  GearOverview,
  HeroResponse,
  HomeResponse,
  ImageMeta,
  Orientation,
  PortfolioImage,
  PortfolioSettings,
} from '~/lib/portfolio';

const RawImage = z.object({
  id: z.string(),
  dimensions: z.object({ height: z.coerce.number(), width: z.coerce.number() }).partial().catch({}),
  data: z
    .object({
      title: z.string().nullish().catch(null),
      dateTaken: z.string().nullish().catch(null),
      localization: z.string().nullish().catch(null),
      description: z.string().nullish().catch(null),
    })
    .partial()
    .catch({}),
});
const RawResponse = z.object({ images: z.array(RawImage).catch([]) });
type RawImage = z.infer<typeof RawImage>;

const GALLERY_DEFS = [
  { slug: 'landscapes', title: 'Landscapes', description: 'Mountains, valleys and the wide open world.' },
  { slug: 'cityscapes', title: 'Cityscapes', description: 'Urban light after dark.' },
  { slug: 'travels', title: 'Travels', description: 'Moments gathered on the road.' },
];

let cache: Promise<RawImage[]> | null = null;
const loadRaw = (signal?: AbortSignal): Promise<RawImage[]> => {
  if (!cache) {
    cache = axios
      .get(`${API_URL}/gallery/all`, { signal })
      .then((r) => RawResponse.parse(r.data).images)
      .catch((e) => {
        cache = null;
        throw e;
      });
  }
  return cache;
};

const orientationOf = (w?: number, h?: number): Orientation | null => {
  if (!w || !h) return null;
  const r = w / h;
  if (r > 1.15) return 'LANDSCAPE';
  if (r < 0.87) return 'PORTRAIT';
  return 'SQUARE';
};

const toImage = (raw: RawImage, order: number): PortfolioImage => {
  const exif: Exif = { takenAt: raw.data.dateTaken ?? null };
  return {
    imageId: raw.id,
    order,
    role: order % 7 === 0 ? 'LARGE' : 'NORMAL',
    coverUrl: `/image/cover?id=${raw.id}`,
    lowResUrl: `/image/low-res?id=${raw.id}`,
    width: raw.dimensions.width ?? null,
    height: raw.dimensions.height ?? null,
    orientation: orientationOf(raw.dimensions.width, raw.dimensions.height),
    localization: raw.data.localization ?? null,
    exif,
  };
};

const groupsOf = (raws: RawImage[]) => {
  const per = Math.ceil(raws.length / GALLERY_DEFS.length) || 1;
  return GALLERY_DEFS.map((def, i) => ({
    def,
    items: raws.slice(i * per, (i + 1) * per).map((r, idx) => toImage(r, idx)),
  })).filter((g) => g.items.length > 0);
};

export const mockHero = async (limit: number, signal?: AbortSignal): Promise<HeroResponse> => {
  const raws = await loadRaw(signal);
  return { images: raws.slice(0, limit).map((r, i) => ({ ...toImage(r, i), role: 'HERO' as const })) };
};

export const mockGalleries = async (signal?: AbortSignal): Promise<GalleryListResponse> => {
  const raws = await loadRaw(signal);
  const groups = groupsOf(raws);
  return {
    total: groups.length,
    galleries: groups.map((g) => ({
      id: g.def.slug,
      title: g.def.title,
      slug: g.def.slug,
      description: g.def.description,
      coverUrl: g.items[0]?.coverUrl ?? null,
      imageCount: g.items.length,
    })),
  };
};

export const mockGalleryBySlug = async (slug: string, query: GalleryQuery = {}): Promise<GalleryDetailResponse> => {
  const raws = await loadRaw();
  const group = groupsOf(raws).find((g) => g.def.slug === slug);
  if (!group) {
    const err = new axios.AxiosError('Not found');
    err.response = { status: 404 } as never;
    throw err;
  }
  const all = group.items;
  const skip = query.skip ?? 0;
  const items = query.take != null ? all.slice(skip, skip + query.take) : all;
  return {
    id: group.def.slug,
    title: group.def.title,
    slug: group.def.slug,
    description: group.def.description,
    coverUrl: all[0]?.coverUrl ?? null,
    imageCount: all.length,
    items,
  };
};

const PREVIEW_COUNT = 6;

export const mockHome = async (): Promise<HomeResponse> => {
  const raws = await loadRaw();
  const hero = raws.slice(0, 12).map((r, i) => ({ ...toImage(r, i), role: 'HERO' as const }));
  const sections = groupsOf(raws).map((g) => ({
    id: g.def.slug,
    title: g.def.title,
    slug: g.def.slug,
    description: g.def.description,
    coverUrl: g.items[0]?.coverUrl ?? null,
    imageCount: g.items.length,
    previewItems: g.items.slice(0, PREVIEW_COUNT),
  }));
  return { hero, sections };
};

export const mockSettings = async (): Promise<PortfolioSettings> => ({
  heroLimit: 12,
  galleryPreviewCount: PREVIEW_COUNT,
  homeGalleryLimit: null,
  galleryPageSize: 24,
});

export const mockImageMeta = async (id: string, signal?: AbortSignal): Promise<ImageMeta> => {
  const raws = await loadRaw(signal);
  const raw = raws.find((r) => r.id === id);
  return {
    author: 'Mateusz Wojcieszak',
    dateTaken: raw?.data.dateTaken ?? null,
    title: raw?.data.title ?? null,
    description: raw?.data.description ?? null,
    localization: raw?.data.localization ?? null,
  };
};

export const mockGear = async (): Promise<GearOverview> => {
  const item = (
    id: string,
    category: GearOverview['ungrouped'][number]['category'],
    brand: string,
    model: string,
    systemId: string | null,
    order: number,
    description: string | null = null,
  ) => ({
    id,
    category,
    brand,
    model,
    systemId,
    description,
    coverUrl: null,
    lowResUrl: null,
    order,
    visible: true,
  });

  return {
    systems: [
      {
        id: 'fuji-x',
        name: 'Fujifilm X',
        label: 'APS-C',
        description:
          'A lightweight everyday system I reach for most — remarkable colour science, tactile dials and glass that punches far above its size.',
        coverUrl: null,
        lowResUrl: null,
        order: 0,
        visible: true,
        items: [
          item('g-xh2', 'CAMERA', 'Fujifilm', 'X-H2', 'fuji-x', 0, '40MP resolution body for detail-critical work.'),
          item('g-xs20', 'CAMERA', 'Fujifilm', 'X-S20', 'fuji-x', 1, 'Compact hybrid — my travel companion.'),
          item('g-1855', 'LENS', 'Fujinon', 'XF 18-55mm f/2.8-4', 'fuji-x', 2, null),
          item('g-70300', 'LENS', 'Fujinon', 'XF 70-300mm f/4-5.6', 'fuji-x', 3, null),
          item('g-viltrox', 'LENS', 'Viltrox', '13mm f/1.4', 'fuji-x', 4, null),
          item('g-7a', 'LENS', '7Artisans', '35mm f/1.4', 'fuji-x', 5, null),
        ],
      },
    ],
    ungrouped: [
      item('g-tripod', 'TRIPOD', 'Peak Design', 'Travel Tripod', null, 0),
      item('g-bag', 'BAG', 'Peak Design', 'Everyday Backpack 20L', null, 1),
    ],
  };
};
