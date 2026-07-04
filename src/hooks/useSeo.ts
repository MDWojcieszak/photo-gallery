import { useEffect } from 'react';
import { SITE } from '~/config';

type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
};

const setTag = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const useSeo = ({ title, description = SITE.description, path = '/', image }: SeoInput) => {
  useEffect(() => {
    const fullTitle = title;
    const url = `${SITE.url}${path}`;
    document.title = fullTitle;
    setTag('meta[name="description"]', 'name', 'description', description);
    setCanonical(url);

    setTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setTag('meta[property="og:description"]', 'property', 'og:description', description);
    setTag('meta[property="og:url"]', 'property', 'og:url', url);
    setTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE.name);
    if (image) setTag('meta[property="og:image"]', 'property', 'og:image', image);

    setTag('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (image) setTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, path, image]);
};
