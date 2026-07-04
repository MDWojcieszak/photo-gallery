export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const apiUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const SITE = {
  name: 'Mateusz Wojcieszak',
  role: 'Photography',
  description:
    'Landscape, cityscape and travel photography by Mateusz Wojcieszak — a curated selection of moments captured around the world.',
  url: (import.meta.env.VITE_SITE_URL ?? 'https://photo.wojcieszak.dev').replace(/\/$/, ''),
} as const;

export const CONTACT = {
  phone: '+48 602 127 672',
  email: 'mateusz@wojcieszak.dev',
  instagram: 'https://www.instagram.com/mdwo.j',
  instagramHandle: 'mdwo.j',
  location: 'Cracow, Poland',
} as const;
