import { ReactNode } from 'react';
import { GalleryProvider } from '~/contexts/Gallery/GalleryProvider';
import { ResponsiveProvider } from '~/contexts/Responsive/ResponsiveProvider';
import { ThemeProvider } from './contexts/Theme/ThemeProvider';
import { Theme } from './utils/theme';
type AppProviderProps = {
  theme: Theme;
  children: ReactNode;
};

export const AppProvider = (p: AppProviderProps) => {
  return (
    <ResponsiveProvider>
      <GalleryProvider>
        <ThemeProvider theme={p.theme}>{p.children}</ThemeProvider>
      </GalleryProvider>
    </ResponsiveProvider>
  );
};
