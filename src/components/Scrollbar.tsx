import { CSSProperties, ReactNode } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { mkUseStyles } from '~/utils/theme';

type ScrollbarProps = {
  children: ReactNode;
  style?: CSSProperties;
};
export const Scrollbar = ({ children, style }: ScrollbarProps) => {
  const styles = useStyles();
  return (
    <Scrollbars
      hideTracksWhenNotNeeded
      style={style}
      renderTrackVertical={({ style, ...props }) => <div {...props} style={{ ...style, ...styles.scrollContainer }} />}
      renderThumbVertical={({ style, ...props }) => <div {...props} style={{ ...style, ...styles.scroll }} />}
    >
      {children}
    </Scrollbars>
  );
};

const useStyles = mkUseStyles((t) => ({
  scrollContainer: {
    right: 0,
    top: t.spacing.m,
    bottom: t.spacing.m,
    width: 10,
    cursor: 'pointer',
    backgroundColor: t.colors.gray04,
    borderRadius: t.borderRadius.default,
    zIndex: 2,
  },
  scroll: {
    backgroundColor: t.colors.gray02,
    borderRadius: t.borderRadius.default,
  },
}));
