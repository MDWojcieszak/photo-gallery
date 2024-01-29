import { Gallery } from '~/components/Gallery';
import { SideBar } from '~/components/SideBar';
import { mkUseStyles } from '~/utils/theme';

export const Dashboard = () => {
  const styles = useStyles();
  return (
    <div style={styles.container}>
      <SideBar />
      <div style={styles.galleryContainer}>
        <Gallery />
      </div>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    width: '100vw',
    background: t.colors.background,
    display: 'flex',
    flexDirecition: 'row',
  },
  galleryContainer: {
    marginLeft: '225px',
    marginTop: t.spacing.m,
    marginRight: t.spacing.m * 2,
  },
}));
