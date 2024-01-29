import { motion } from 'framer-motion';
import { LuInstagram } from 'react-icons/lu';
import { mkUseStyles, useTheme } from '~/utils/theme';

export const SideBar = () => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <div style={styles.container}>
      <motion.div style={styles.centerContainer}>
        <motion.img
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          src='logo.png'
          style={styles.logo}
        />
      </motion.div>
      <div
        style={styles.centerContainer}
        // transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        // whileHover={{ scale: 1.1 }}
        // href='goole.com'
      >
        <LuInstagram
          fontSize={25}
          stroke={theme.colors.lightBlue}
          style={{ cursor: 'pointer', marginRight: theme.spacing.s }}
        />
        <p>mdwo.j</p>
      </div>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    display: 'flex',
    position: 'fixed',
    left: t.spacing.m,
    top: t.spacing.m,
    bottom: t.spacing.m,
    borderRadius: t.borderRadius.default,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '10vw',
    backgroundColor: t.colors.gray04,
    zIndex: 2,
  },
  centerContainer: {
    width: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100px',
    height: '100px',
    borderRadius: 100,
    border: '4px',
    borderStyle: 'solid',
    borderColor: t.colors.gray02,
    cursor: 'pointer',
    userSelect: 'none',
  },
}));
