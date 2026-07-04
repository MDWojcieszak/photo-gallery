import { mkUseStyles } from '~/utils/theme';

export const GridSkeleton = ({ columns = 3, count = 9 }: { columns?: number; count?: number }) => {
  const styles = useStyles();
  const ratios = [0.7, 1.3, 1, 1.5, 0.8, 1.2, 1, 0.9, 1.4];
  const cols = Array.from({ length: columns }, () => [] as number[]);
  for (let i = 0; i < count; i++) cols[i % columns].push(ratios[i % ratios.length]);

  return (
    <div style={styles.grid}>
      {cols.map((col, ci) => (
        <div style={styles.col} key={ci}>
          {col.map((r, i) => (
            <div key={i} style={{ ...styles.block, aspectRatio: `${1 / r}` }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => {
  const styles = useStyles();
  return (
    <div style={styles.center}>
      <p style={styles.emptyTitle}>{title}</p>
      {hint && <p style={styles.emptyHint}>{hint}</p>}
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  grid: {
    display: 'flex',
    gap: 'clamp(8px, 1vw, 16px)',
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(8px, 1vw, 16px)',
  },
  block: {
    width: '100%',
    borderRadius: t.borderRadius.small,
    background: `linear-gradient(100deg, ${t.colors.surface} 30%, ${t.colors.surface02} 50%, ${t.colors.surface} 70%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite linear',
  },
  center: {
    textAlign: 'center',
    padding: `${t.spacing.xxxl}px ${t.spacing.m}px`,
  },
  emptyTitle: {
    fontFamily: t.fonts.serif,
    fontSize: 24,
    color: t.colors.textMuted,
  },
  emptyHint: {
    fontSize: 13,
    color: t.colors.textFaint,
    marginTop: t.spacing.s,
  },
}));
