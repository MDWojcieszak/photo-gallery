import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { FaCamera, FaFilm, FaGlobeAmericas, FaLaptopCode } from 'react-icons/fa';
import { LuMapPin } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { AboutMe } from '~/components/AboutMe';
import { CameraGear } from '~/components/CameraGear';
import { Scrollbar } from '~/components/Scrollbar';
import { useResponsive } from '~/hooks/useResponsive';
import { mkUseStyles, useTheme } from '~/utils/theme';

const ICON_SIZE = 20;

export const About = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { device, isMobile } = useResponsive();
  const navigate = useNavigate();
  const width = useMemo(() => {
    switch (device) {
      case 'largeScreen':
        return 1000;
      case 'desktop':
        return 900;
      case 'tablet':
        return 720;
      case 'largeMobile':
        return 500;
      case 'mobile':
        return 350;
    }
  }, [device]);
  const handleClick = () => {
    navigate('/');
  };

  const avatarSize = isMobile ? 150 : 250;
  return (
    <div style={styles.container}>
      <Scrollbar>
        <motion.div style={styles.innerContainer} animate={{ width }} initial={{ width }}>
          <div style={styles.headerContainer}>
            <motion.img
              src='avatar.webp'
              onClick={handleClick}
              initial={{
                width: avatarSize,
                height: avatarSize,
              }}
              animate={{
                width: avatarSize,
                height: avatarSize,
              }}
              style={styles.logo}
            />
            <motion.div style={styles.additionalInfo}>
              <h2 style={{ fontSize: 24 }}>Mateusz Wojcieszak</h2>
              <div style={styles.row}>
                <p style={styles.iconTextItem}>
                  <FaLaptopCode size={ICON_SIZE} style={styles.icon} /> Programmer
                </p>
                <p style={styles.iconTextItem}>
                  <FaCamera size={ICON_SIZE} style={{ ...styles.icon, ...{ marginLeft: theme.spacing.m } }} />{' '}
                  Photographer
                </p>
              </div>
              <div style={styles.row}>
                <p style={styles.iconTextItem}>
                  <FaGlobeAmericas size={ICON_SIZE} style={styles.icon} /> Traveler
                </p>
                <p style={styles.iconTextItem}>
                  <FaFilm size={ICON_SIZE} style={{ ...styles.icon, ...{ marginLeft: theme.spacing.m } }} /> Fujifilm
                  Enthusiast
                </p>
              </div>
              <div style={{ ...styles.row, ...{ marginTop: theme.spacing.m } }}>
                <LuMapPin stroke={theme.colors.lightBlue} style={{ marginRight: theme.spacing.xxs }} />
                <span style={{ color: theme.colors.lightBlue, fontSize: 14 }}>Cracow, Poland</span>
              </div>
            </motion.div>
          </div>

          <AboutMe />
          <CameraGear />
        </motion.div>
      </Scrollbar>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    height: '100svh',
    width: '100vw',
    backgroundColor: t.colors.gray05,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: t.spacing.xxl,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
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

    width: 250,
    height: 250,
    marginRight: t.spacing.m,
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    marginBottom: t.spacing.xxl,
  },
  additionalInfo: {},
  row: {
    display: 'flex',
  },
  iconTextItem: {
    fontSize: 14,
    color: t.colors.lightBlue02,
    marginBottom: t.spacing.xxs,
    marginTop: t.spacing.xxs,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: t.spacing.xs,
    color: t.colors.lightBlue02,
  },
}));
