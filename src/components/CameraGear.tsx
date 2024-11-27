import { FaCameraRetro } from 'react-icons/fa'; // Camera and lens icons
import { RiCameraLensLine } from 'react-icons/ri';
import { mkUseStyles } from '~/utils/theme';

export const CameraGear = () => {
  const styles = useStyles();

  const gear = [
    {
      name: 'Viltrox 13mm',
      type: 'Lens',
      icon: <RiCameraLensLine style={styles.icon} />,
    },
    {
      name: 'Fuji 70-300mm',
      type: 'Lens',
      icon: <RiCameraLensLine style={styles.icon} />,
    },
    {
      name: 'Fuji 18-55mm',
      type: 'Lens',
      icon: <RiCameraLensLine style={styles.icon} />,
    },
    {
      name: '7Artisans 35mm',
      type: 'Lens',
      icon: <RiCameraLensLine style={styles.icon} />,
    },
    {
      name: 'Fuji X-S20',
      type: 'Camera',
      icon: <FaCameraRetro style={styles.icon} />,
    },
    {
      name: 'Fuji X-H2',
      type: 'Camera',
      icon: <FaCameraRetro style={styles.icon} />,
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Camera Gear</h2>
      <div style={styles.gearContainer}>
        {gear.map((item, index) => (
          <div key={index} style={styles.gearItem}>
            <div style={styles.iconContainer}>{item.icon}</div>
            <div>
              <strong>{item.type}</strong>
              <p style={styles.gearText}>{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: t.borderRadius.default,
    marginTop: t.spacing.m,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: t.colors.white,
    marginBottom: t.spacing.m,
  },
  gearContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gearItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: t.spacing.s,
    minWidth: 150,
  },
  iconContainer: {
    marginRight: t.spacing.s,
    marginBottom: -5,
  },
  icon: {
    fontSize: 24,

    color: t.colors.lightBlue02,
  },
  gearText: {
    fontSize: 14,
    color: t.colors.lightBlue,
    padding: 0,
    margin: 0,
    fontWeight: 'normal',
  },
}));
