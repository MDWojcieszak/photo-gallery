import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ResponsiveContext } from '~/contexts/Responsive/ResponsiveContext';

type ResponsiveProviderProps = {
  children: ReactNode;
};

export const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
  const small = useMediaQuery({ minWidth: 576 });
  const medium = useMediaQuery({ minWidth: 786 });
  const large = useMediaQuery({ minWidth: 1080 });
  const extraLarge = useMediaQuery({ minWidth: 2000 });
  const isLandscape = useMediaQuery({ orientation: 'landscape' });

  return (
    <ResponsiveContext.Provider
      value={{
        device: extraLarge ? 'largeScreen' : large ? 'desktop' : medium ? 'tablet' : small ? 'largeMobile' : 'mobile',
        orientation: isLandscape ? 'landscape' : 'portrait',
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};
