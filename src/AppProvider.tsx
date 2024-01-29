import { ReactNode } from 'react';
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
      <ThemeProvider theme={p.theme}>{p.children}</ThemeProvider>
    </ResponsiveProvider>
  );
};
