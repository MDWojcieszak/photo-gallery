import { motion } from 'framer-motion';
import { LuInstagram } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '~/hooks/useResponsive';
import { useSideBarSize } from '~/hooks/useSideBarSize';
import { mkUseStyles, useTheme } from '~/utils/theme';

const ICON_SIZE = 80;

export const SideBar = () => {
  const styles = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const size = useSideBarSize();
  const { isMobile } = useResponsive();
  if (size === null) return null;

  const handleClick = () => {
    navigate('about');
  };

  return (
    <motion.div
      style={{
        ...styles.container,
        flexDirection: isMobile ? 'row' : 'column',
        width: isMobile ? `calc(80% - ${theme.spacing.m * 2}px)` : `calc(100% - ${theme.spacing.m * 2}px)`,
        marginLeft: isMobile ? 0 : theme.spacing.m,
        height: isMobile ? undefined : `calc(100% - ${theme.spacing.m * 2}px)`,

        marginBottom: isMobile ? 0 : theme.spacing.m,
      }}
    >
      <motion.img
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        src='avatar.webp'
        style={{
          ...styles.logo,
          ...(isMobile ? styles.mobileLogo : {}),
        }}
      />

      <motion.div
        style={{ ...styles.row, ...styles.instagram, marginRight: isMobile ? theme.spacing.l : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => {
          // Navigate to Instagram
          window.location.href = 'https://www.instagram.com/mdwo.j';
        }}
      >
        <LuInstagram
          fontSize={16}
          stroke={theme.colors.lightBlue}
          style={{ cursor: 'pointer', marginRight: theme.spacing.s }}
        />
        <p>mdwo.j</p>
      </motion.div>
    </motion.div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    pointerEvents: 'auto',

    marginTop: t.spacing.m,
    marginRight: t.spacing.m,
    overflow: 'hidden',

    borderRadius: t.borderRadius.default,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: t.colors.gray03,
    position: 'relative',
    display: 'flex',
    zIndex: 3,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    position: 'relative',
    border: '4px',
    borderStyle: 'solid',
    overflow: 'hidden',
    borderColor: t.colors.gray02,
    cursor: 'pointer',
    userSelect: 'none',
    borderRadius: '50%',
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginTop: t.spacing.m,
  },
  mobileLogo: {
    marginTop: 0,
    marginLeft: t.spacing.s,
    width: ICON_SIZE / 2,
    height: ICON_SIZE / 2,
  },

  aboutContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  instagram: {
    cursor: 'pointer',
  },
}));
