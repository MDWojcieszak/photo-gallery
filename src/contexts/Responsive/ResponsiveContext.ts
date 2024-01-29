import { createContext } from 'react';

export type ResponsiveContextType = {
  device: 'mobile' | 'largeMobile' | 'tablet' | 'desktop' | 'largeScreen';
  orientation: 'portrait' | 'landscape';
};

export const ResponsiveContext = createContext<ResponsiveContextType | null>(null);
