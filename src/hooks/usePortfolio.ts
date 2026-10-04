import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ContactConfig,
  contactLocale,
  fetchContact,
  fetchGalleries,
  fetchGalleryBySlug,
  fetchGear,
  fetchHero,
  fetchHome,
  fetchSettings,
  GalleryDetailResponse,
  GalleryListResponse,
  GearOverview,
  HeroResponse,
  HomeResponse,
  PortfolioImage,
  PortfolioSettings,
} from '~/lib/portfolio';

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: 'notfound' | 'error' | null;
};

const isNotFound = (e: unknown): boolean => axios.isAxiosError(e) && e.response?.status === 404;
const isCanceled = (e: unknown): boolean => axios.isCancel(e) || (e as { name?: string })?.name === 'CanceledError';

function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>, deps: unknown[], enabled = true): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: enabled, error: null });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    if (!enabled) {
      setState({ data: undefined, loading: false, error: null });
      return;
    }
    const controller = new AbortController();
    setState({ data: undefined, loading: true, error: null });
    loaderRef
      .current(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => {
        if (isCanceled(e)) return;
        setState({ data: undefined, loading: false, error: isNotFound(e) ? 'notfound' : 'error' });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export const useHero = (limit = 12): AsyncState<HeroResponse> =>
  useAsync((signal) => fetchHero(limit, signal), [limit]);

export const useGalleries = (): AsyncState<GalleryListResponse> => useAsync((signal) => fetchGalleries(signal), []);

export const useHome = (): AsyncState<HomeResponse> => useAsync((signal) => fetchHome(signal), []);

export const useSettings = (): AsyncState<PortfolioSettings> => useAsync((signal) => fetchSettings(signal), []);

export const useGear = (): AsyncState<GearOverview> => useAsync((signal) => fetchGear(signal), []);

export type ContactConfigState = { data: ContactConfig | undefined; loading: boolean };

/**
 * Contact form config for `locale` (default: the visitor's). Keeps the previous locale's data
 * while another loads, so switching the privacy modal's translation never blanks it.
 */
export const useContactConfig = (locale: string = contactLocale()): ContactConfigState => {
  const [state, setState] = useState<ContactConfigState>({ data: undefined, loading: true });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    fetchContact(locale)
      .then((data) => alive && setState({ data, loading: false }))
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
  }, [locale]);

  return state;
};

export type PagedGallery = {
  meta: GalleryDetailResponse | undefined;
  items: PortfolioImage[];
  loading: boolean;
  loadingMore: boolean;
  error: 'notfound' | 'error' | null;
  hasMore: boolean;
  loadMore: () => void;
};

export const useGalleryPaged = (slug: string | undefined, pageSize?: number): PagedGallery => {
  const [meta, setMeta] = useState<GalleryDetailResponse | undefined>();
  const [items, setItems] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<'notfound' | 'error' | null>(null);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    setMeta(undefined);
    setItems([]);
    setError(null);
    setLoading(true);
    fetchGalleryBySlug(slug, pageSize ? { take: pageSize, skip: 0 } : {}, controller.signal)
      .then((d) => {
        setMeta(d);
        setItems(d.items);
        setLoading(false);
      })
      .catch((e) => {
        if (isCanceled(e)) return;
        setError(isNotFound(e) ? 'notfound' : 'error');
        setLoading(false);
      });
    return () => controller.abort();
  }, [slug, pageSize]);

  const hasMore = !!(meta && items.length < meta.imageCount);

  const loadMore = useCallback(() => {
    if (!slug || !pageSize || loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchGalleryBySlug(slug, { take: pageSize, skip: items.length })
      .then((d) => {
        setItems((prev) => [...prev, ...d.items]);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }, [slug, pageSize, loadingMore, hasMore, items.length]);

  return { meta, items, loading, loadingMore, error, hasMore, loadMore };
};
