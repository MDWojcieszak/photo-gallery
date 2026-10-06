import { CSSProperties, SyntheticEvent, useLayoutEffect, useRef, useState } from 'react';
import { apiUrl } from '~/config';
import { mkUseStyles } from '~/utils/theme';

type BlurImageProps = {
  cover: string;
  lowRes?: string | null;
  alt?: string;
  ratio?: number;
  objectFit?: 'cover' | 'contain';
  radius?: number;
  priority?: boolean;
  transparent?: boolean;
  style?: CSSProperties;
};

const FADE_MS = 600;

/**
 * Blurred low-res placeholder underneath, sharp cover on top. The cover fades in only once
 * it is decoded, over a placeholder that stays fully visible — no gap, no flash. Images
 * already in the browser cache appear at once.
 */
export const BlurImage = ({
  cover,
  lowRes,
  alt = '',
  ratio,
  objectFit = 'cover',
  radius = 0,
  priority = false,
  transparent = false,
  style,
}: BlurImageProps) => {
  const styles = useStyles();
  const coverSrc = apiUrl(cover) ?? '';
  const lowSrc = apiUrl(lowRes);
  const imgRef = useRef<HTMLImageElement>(null);

  // Keyed by src, so a new src starts over without reset effects.
  const [lowReady, setLowReady] = useState<string | null>(null);
  const [ready, setReady] = useState<string | null>(null);
  const [settled, setSettled] = useState<string | null>(null);
  const [instant, setInstant] = useState<string | null>(null);

  const loaded = ready === coverSrc;
  const isInstant = instant === coverSrc;
  const showLow = !!lowSrc && !isInstant && settled !== coverSrc;

  // Cached image: already complete before the first paint → skip the fade.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setInstant(coverSrc);
      setReady(coverSrc);
      setSettled(coverSrc);
    }
  }, [coverSrc]);

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const src = coverSrc;
    // Fade only once the pixels are decoded, otherwise the fade can start on an empty frame.
    const decoded = img.decode ? img.decode().catch(() => undefined) : Promise.resolve();
    decoded.then(() => setReady((cur) => (img.getAttribute('src') === src ? src : cur)));
  };

  return (
    <div
      style={{
        ...styles.container,
        borderRadius: radius,
        aspectRatio: ratio ? `${ratio}` : undefined,
        ...(transparent ? { backgroundColor: 'transparent' } : null),
        ...style,
      }}
    >
      {showLow && (
        <img
          src={lowSrc}
          alt=''
          aria-hidden
          decoding='async'
          onLoad={() => setLowReady(lowSrc)}
          style={{
            ...styles.layer,
            ...styles.low,
            objectFit,
            // Opaque photos keep the placeholder under the fading cover; transparent ones
            // cross-fade, or the blur would show through the empty areas.
            opacity: lowReady === lowSrc && !(transparent && loaded) ? 1 : 0,
            transition: `opacity ${loaded ? FADE_MS : FADE_MS / 2}ms ease-out`,
          }}
        />
      )}
      <img
        ref={imgRef}
        src={coverSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding='async'
        onLoad={onLoad}
        onTransitionEnd={(e) => e.propertyName === 'opacity' && loaded && setSettled(coverSrc)}
        style={{
          ...styles.layer,
          objectFit,
          opacity: loaded ? 1 : 0,
          transition: isInstant ? 'none' : `opacity ${FADE_MS}ms ease-out`,
        }}
      />
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: t.colors.surface03,
  },
  layer: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  low: {
    filter: 'blur(18px)',
    transform: 'scale(1.1)',
  },
}));
