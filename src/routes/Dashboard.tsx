import { motion } from 'framer-motion';
import { useState } from 'react';
import { Gallery } from '~/components/Gallery';
import { SideBar } from '~/components/SideBar';
import { useSideBarSize } from '~/hooks/useSideBarSize';
import { mkUseStyles, useTheme } from '~/utils/theme';
export const Dashboard = () => {
  const styles = useStyles();
  const theme = useTheme();
  const [imageActive, setImageActive] = useState<string | false>(false);
  const sidebarSize = useSideBarSize();
  const sidebarWidth = (sidebarSize.desktopSize || 0) + 2 * theme.spacing.m;
  const mobileNavigation = sidebarSize.mobileSize || 0;
  const handleSetImgaeActive = (id: string, active: boolean) => {
    console.log(id, active);
    setImageActive((prev) => (prev === id && active === false ? false : id));
  };
  return (
    <div style={{ ...styles.container }}>
      <motion.div
        style={{ ...styles.galleryContainer, zIndex: imageActive !== false ? 4 : 2 }}
        transition={{ type: 'spring', damping: 30, stiffness: 160 }}
      >
        <Gallery disableResizing={false} setImageActive={handleSetImgaeActive} />
      </motion.div>
      {sidebarSize.desktopSize !== null && (
        <motion.div
          style={styles.sideBar}
          animate={{ width: sidebarWidth }}
          initial={{ width: sidebarWidth }}
          transition={{ type: 'spring', damping: 30, stiffness: 160 }}
        >
          <SideBar />
        </motion.div>
      )}
      {sidebarSize.mobileSize !== null && (
        <motion.div
          style={styles.sideBarMobile}
          animate={{ height: mobileNavigation, opacity: imageActive !== false ? 0 : 1, zIndex: imageActive ? 1 : 10 }}
          initial={{ height: mobileNavigation }}
          transition={{ type: 'spring', damping: 30, stiffness: 160 }}
        >
          <SideBar />
        </motion.div>
      )}
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    width: '100vw',
    maxWidth: '100vw',
    height: '100svh',
    maxHeight: '100svh',
    background: t.colors.background,
    display: 'flex',
    flexDirecition: 'row',
    overflow: 'hidden',
  },
  sideBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  sideBarMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alighItems: 'center',
    justifyContent: 'center',
  },
  galleryContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    display: 'flex',
    zIndex: 2,
  },
}));
