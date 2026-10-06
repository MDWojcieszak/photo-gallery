import { motion } from 'framer-motion';
import { ComponentType, useState } from 'react';
import { FaCameraRetro } from 'react-icons/fa';
import { GiBinoculars, GiDeliveryDrone } from 'react-icons/gi';
import {
  LuAperture,
  LuBackpack,
  LuBatteryCharging,
  LuBatteryFull,
  LuBox,
  LuCable,
  LuCamera,
  LuCircleDot,
  LuCloudRain,
  LuCornerDownRight,
  LuCrosshair,
  LuEye,
  LuFilm,
  LuHardDrive,
  LuLaptop,
  LuLightbulb,
  LuLink,
  LuMemoryStick,
  LuOrbit,
  LuPackage,
  LuPlug,
  LuPlugZap,
  LuSparkles,
  LuThermometer,
  LuUmbrella,
  LuUsb,
  LuVideo,
  LuZap,
} from 'react-icons/lu';
import { MdSettingsRemote } from 'react-icons/md';
import { RiCameraLensLine } from 'react-icons/ri';
import { TbTelescope } from 'react-icons/tb';
import { BlurImage } from '~/components/BlurImage';
import { useGear } from '~/hooks/usePortfolio';
import { useResponsive } from '~/hooks/useResponsive';
import { GearCategory, GearItem, GearSystem } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

const CATEGORY_LABEL: Record<GearCategory, string> = {
  CAMERA: 'Camera',
  FILM_CAMERA: 'Film camera',
  LENS: 'Lens',
  TELECONVERTER: 'Teleconverter',
  ADAPTER: 'Adapter',
  FILTER: 'Filter',
  TELESCOPE: 'Telescope',
  SMART_TELESCOPE: 'Smart telescope',
  ASTRO_CAMERA: 'Astro camera',
  GUIDE_SCOPE: 'Guide scope',
  MOUNT: 'Mount',
  EYEPIECE: 'Eyepiece',
  BINOCULARS: 'Binoculars',
  DIAGONAL: 'Diagonal',
  DEW_HEATER: 'Dew heater',
  TRIPOD: 'Tripod',
  HEAD: 'Tripod head',
  GIMBAL: 'Gimbal',
  FLASH: 'Flash',
  LIGHTING: 'Lighting',
  LIGHT_MODIFIER: 'Light modifier',
  BATTERY: 'Battery',
  CHARGER: 'Charger',
  POWER_BANK: 'Power bank',
  POWER_STATION: 'Power station',
  DRONE: 'Drone',
  ACTION_CAM: 'Action cam',
  REMOTE: 'Remote',
  MEMORY_CARD: 'Memory card',
  CARD_READER: 'Card reader',
  STORAGE: 'Storage',
  COMPUTER: 'Computer',
  BAG: 'Bag',
  STRAP: 'Strap',
  RAIN_COVER: 'Rain cover',
  CLEANING: 'Cleaning',
  CABLE: 'Cable',
  ACCESSORY: 'Accessory',
  OTHER: 'Gear',
};

type IconType = ComponentType<{ size?: number; style?: React.CSSProperties }>;

const TripodIcon = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.4}
    strokeLinecap='round'
    strokeLinejoin='round'
    style={style}
    aria-hidden
  >
    <path d='M6 5h12' />
    <path d='M12 5v4' />
    <path d='M12 9 5 20' />
    <path d='m12 9 7 11' />
    <path d='M12 9v11' />
    <path d='M8.6 15.5h6.8' />
  </svg>
);

const CATEGORY_ICON: Record<GearCategory, IconType> = {
  CAMERA: FaCameraRetro,
  FILM_CAMERA: LuFilm,
  LENS: RiCameraLensLine,
  TELECONVERTER: RiCameraLensLine,
  ADAPTER: LuPlug,
  FILTER: LuCircleDot,
  TELESCOPE: TbTelescope,
  SMART_TELESCOPE: TbTelescope,
  ASTRO_CAMERA: LuCamera,
  GUIDE_SCOPE: LuCrosshair,
  MOUNT: LuOrbit,
  EYEPIECE: LuEye,
  BINOCULARS: GiBinoculars,
  DIAGONAL: LuCornerDownRight,
  DEW_HEATER: LuThermometer,
  TRIPOD: TripodIcon,
  HEAD: TripodIcon,
  GIMBAL: LuAperture,
  FLASH: LuZap,
  LIGHTING: LuLightbulb,
  LIGHT_MODIFIER: LuUmbrella,
  BATTERY: LuBatteryFull,
  CHARGER: LuBatteryCharging,
  POWER_BANK: LuBatteryCharging,
  POWER_STATION: LuPlugZap,
  DRONE: GiDeliveryDrone,
  ACTION_CAM: LuVideo,
  REMOTE: MdSettingsRemote,
  MEMORY_CARD: LuMemoryStick,
  CARD_READER: LuUsb,
  STORAGE: LuHardDrive,
  COMPUTER: LuLaptop,
  BAG: LuBackpack,
  STRAP: LuLink,
  RAIN_COVER: LuCloudRain,
  CLEANING: LuSparkles,
  CABLE: LuCable,
  ACCESSORY: LuBox,
  OTHER: LuPackage,
};

const twoDigit = (n: number): string => String(n).padStart(2, '0');

const GearCard = ({ item, index }: { item: GearItem; index: number }) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [hovered, setHovered] = useState(false);

  const Icon = CATEGORY_ICON[item.category];
  const brand = item.brand?.trim() ?? '';
  const model = item.model?.trim() ?? '';
  const heroName = model || brand || CATEGORY_LABEL[item.category];
  const hasPhoto = !!item.coverUrl;
  const active = hovered && !isMobile;

  return (
    <motion.article
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      animate={{ backgroundColor: active ? theme.colors.surface02 : theme.colors.surface }}
    >
      <motion.span
        style={styles.watermark}
        aria-hidden
        animate={{
          opacity: active ? 0.1 : 0.055,
          scale: active ? 1.05 : 1,
          rotate: active ? -5 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Icon size={isMobile ? 190 : 260} style={{ color: theme.colors.text }} />
      </motion.span>

      <span style={styles.index}>{twoDigit(index)}</span>

      {hasPhoto && (
        <motion.div
          style={styles.plate}
          animate={{ scale: active ? 1.02 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <BlurImage
            cover={item.coverUrl as string}
            lowRes={item.lowResUrl}
            alt={[brand, model].filter(Boolean).join(' ') || heroName}
            ratio={16 / 10}
            objectFit='contain'
            transparent
            radius={theme.borderRadius.medium}
          />
        </motion.div>
      )}

      <div style={styles.body}>
        <div style={styles.meta}>
          <span style={styles.category}>{CATEGORY_LABEL[item.category]}</span>
          {brand && model && <span style={styles.brand}>{brand}</span>}
        </div>

        <h4 style={styles.model}>{heroName}</h4>

        {item.description && <p style={styles.desc}>{item.description}</p>}
      </div>
    </motion.article>
  );
};

const GearGroup = ({
  eyebrow,
  name,
  label,
  description,
  items,
  muted,
}: {
  eyebrow?: string;
  name: string;
  label?: string | null;
  description?: string | null;
  items: GearItem[];
  muted?: boolean;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  if (!items.length) return null;

  return (
    <motion.section
      style={styles.group}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={styles.masthead}>
        {eyebrow && <span style={styles.eyebrow}>{eyebrow}</span>}
        <div style={styles.mastheadTitle}>
          <h3 style={{ ...styles.systemName, ...(muted ? { color: theme.colors.textMuted } : null) }}>{name}</h3>
          {label && <span style={styles.labelPill}>{label}</span>}
          <span style={styles.countTag}>{twoDigit(items.length)}</span>
        </div>
        {description && <p style={styles.systemDesc}>{description}</p>}
      </div>

      <div style={styles.grid}>
        {items.map((it, i) => (
          <GearCard key={it.id} item={it} index={i + 1} />
        ))}
      </div>
    </motion.section>
  );
};

const GearSkeleton = () => {
  const styles = useStyles();
  const { isMobile } = useResponsive();
  return (
    <div style={styles.group}>
      <div style={{ ...styles.skelLine, width: '34%', height: 40, marginBottom: 'clamp(20px, 3vh, 36px)' }} />
      <div style={styles.grid}>
        {Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
          <div key={i} style={styles.skelCard} />
        ))}
      </div>
    </div>
  );
};

export const GearSection = () => {
  const styles = useStyles();
  const { data, loading } = useGear();

  const shown = (i: GearItem) => i.visible !== false && i.ownership === 'OWNED';
  const systems = (data?.systems ?? [])
    .filter((s) => s.visible !== false)
    .map((s) => ({ ...s, items: s.items.filter(shown) }))
    .filter((s) => s.items.length > 0);
  const ungrouped = (data?.ungrouped ?? []).filter(shown);

  if (!loading && systems.length === 0 && ungrouped.length === 0) return null;

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.heading}>My gear</h2>
      </div>

      {loading ? (
        <GearSkeleton />
      ) : (
        <div style={styles.groups}>
          {systems.map((s: GearSystem, i) => (
            <GearGroup
              key={s.id}
              eyebrow={`System — ${twoDigit(i + 1)}`}
              name={s.name}
              label={s.label}
              description={s.description}
              items={s.items}
            />
          ))}

          <GearGroup name='Accessories' items={ungrouped} muted />
        </div>
      )}
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  section: {
    marginTop: 'clamp(56px, 9vh, 96px)',
    maxWidth: t.layout.maxWidth,
  },

  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.sm,
    marginBottom: 'clamp(36px, 5vh, 64px)',
  },
  heading: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(34px, 5.5vw, 60px)',
    lineHeight: 1,
    letterSpacing: '-0.01em',
    color: t.colors.text,
    margin: 0,
  },

  groups: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(48px, 7vh, 88px)',
  },

  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  masthead: {
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.s,
    marginBottom: 'clamp(20px, 3vh, 36px)',
  },
  eyebrow: {
    fontFamily: t.fonts.sans,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  mastheadTitle: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: t.spacing.sm,
  },
  systemName: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(26px, 3.6vw, 40px)',
    lineHeight: 1.05,
    letterSpacing: '-0.005em',
    color: t.colors.text,
    margin: 0,
  },
  labelPill: {
    fontFamily: t.fonts.sans,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.ink,
    backgroundColor: t.colors.accent,
    borderRadius: 999,
    padding: '5px 12px',
    transform: 'translateY(-3px)',
  },
  countTag: {
    fontFamily: t.fonts.sans,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.12em',
    color: t.colors.textFaint,
    marginLeft: 'auto',
    alignSelf: 'flex-end',
    transform: 'translateY(-3px)',
  },
  systemDesc: {
    maxWidth: 640,
    marginTop: t.spacing.xxs,
    fontFamily: t.fonts.sans,
    fontSize: 'clamp(15px, 1.4vw, 17px)',
    fontWeight: 400,
    lineHeight: 1.65,
    color: t.colors.textMuted,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: 'clamp(14px, 1.6vw, 22px)',
  },

  card: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 220,
    padding: 'clamp(20px, 2.4vw, 30px)',
    backgroundColor: t.colors.surface,
    borderRadius: t.borderRadius.large,
  },
  watermark: {
    position: 'absolute',
    right: -44,
    bottom: -56,
    lineHeight: 0,
    pointerEvents: 'none',
  },
  index: {
    position: 'absolute',
    top: 'clamp(18px, 2.2vw, 26px)',
    right: 'clamp(20px, 2.4vw, 30px)',
    zIndex: 1,
    fontFamily: t.fonts.serif,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: t.colors.textFaint,
  },
  plate: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    marginBottom: t.spacing.m,
    borderRadius: t.borderRadius.medium,
    overflow: 'hidden',
  },

  body: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.s,
    marginTop: 'auto',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: t.spacing.s,
  },
  category: {
    fontFamily: t.fonts.sans,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.ink,
    backgroundColor: t.colors.accentSoft,
    borderRadius: 999,
    padding: '4px 10px',
  },
  brand: {
    fontFamily: t.fonts.sans,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.textMuted,
  },
  model: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(24px, 2.8vw, 34px)',
    lineHeight: 1.08,
    letterSpacing: '-0.01em',
    color: t.colors.text,
    margin: 0,
    overflowWrap: 'anywhere',
  },
  desc: {
    maxWidth: '46ch',
    fontFamily: t.fonts.sans,
    fontSize: 'clamp(14px, 1.1vw, 15px)',
    fontWeight: 400,
    lineHeight: 1.6,
    color: t.colors.textMuted,
    margin: 0,
  },

  skelCard: {
    minHeight: 220,
    borderRadius: t.borderRadius.large,
    background: `linear-gradient(100deg, ${t.colors.surface} 30%, ${t.colors.surface02} 50%, ${t.colors.surface} 70%)`,
    backgroundSize: '200% 100%',
    animation: 'skeleton-in 0.4s ease-out 0.3s both, shimmer 1.4s 0.3s infinite linear',
  },
  skelLine: {
    borderRadius: t.borderRadius.default,
    background: `linear-gradient(100deg, ${t.colors.surface} 30%, ${t.colors.surface02} 50%, ${t.colors.surface} 70%)`,
    backgroundSize: '200% 100%',
    animation: 'skeleton-in 0.4s ease-out 0.3s both, shimmer 1.4s 0.3s infinite linear',
  },
}));
