import { useContext } from 'react';
import { ResponsiveContext } from '~/contexts/Responsive/ResponsiveContext';

export const useResponsive = () => {
  const ctx = useContext(ResponsiveContext);

  if (!ctx) throw new Error('Use this hook only in ResponsiveContextProvider!');

  return {
    ...ctx,
    isMobile: ctx.device === 'mobile' || ctx.device === 'largeMobile',
  };
};
