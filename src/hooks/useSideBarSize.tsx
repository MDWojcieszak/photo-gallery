import { useEffect, useState } from 'react';
import { useResponsive } from '~/hooks/useResponsive';

export const useSideBarSize = () => {
  const { device } = useResponsive();
  const [desktopSize, setDesktopSize] = useState<number | null>(null);
  const [mobileSize, setMobileSize] = useState<number | null>(null);

  const calculateSize = (d: typeof device) => {
    switch (d) {
      case 'largeScreen':
        setDesktopSize(160);
        setMobileSize(null);
        return;
      case 'desktop':
      case 'tablet':
        setDesktopSize(112);
        setMobileSize(null);
        return;
      case 'largeMobile':
      case 'mobile':
        setDesktopSize(null);
        setMobileSize(70);
        return;
    }
  };

  useEffect(() => {
    calculateSize(device);
  }, [device]);

  return {
    desktopSize,
    mobileSize,
  };
};
