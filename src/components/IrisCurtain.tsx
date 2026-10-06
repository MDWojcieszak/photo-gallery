import { useEffect, useRef, useState } from 'react';
import { useTheme } from '~/utils/theme';

type IrisCurtainProps = {
  /** True once the page underneath is ready to be shown. */
  ready: boolean;
  /** The iris starts opening — the page is now becoming visible. */
  onReveal: () => void;
  /** The opening finished; the curtain can be removed. */
  onDone: () => void;
};

/** Inner radius of the lens barrel at rest, in px — the blades live inside it. */
const RIM = 27;
const BLADES = 6;
/** Radius of each blade's curved leading edge (smaller = more curved, rounder aperture). */
const CURVE = 34;
/** Aperture apothem fully open / stopped down. */
const OPEN_H = 21;
const CLOSED_H = 1.6;
/** < 1: the aperture grows faster at the start of the blade travel, slower near fully open. */
const APERTURE_CURVE = 0.7;
/** Blades sweep round as they close, like a real diaphragm. */
const TWIST = (34 * Math.PI) / 180;
const BASE = -Math.PI / 2;

/** On-screen size relative to the drawing — present, but not a centrepiece. */
const REST_SCALE = 0.95;
/** The iris quietly fades in… */
const APPEAR_S = 0.3;
/** …already closing: it arrives open and stops down, then starts its first opening. */
const CLOSE_IN_S = 0.45;
/**
 * The final opening grows out of an ordinary opening stroke: the iris first opens normally, and
 * mid-stroke — where the blades move fastest and their speed matches the start of the final
 * opening — it carries straight on to full screen. Outside this window it waits for the next one.
 */
const TAKEOVER_FROM = 0.5;
const TAKEOVER_TO = 0.62;
/** A fast page: the closed iris rests this long after closing in, then opens straight away. */
const CLOSED_HOLD_S = 0;
/** While shown the blades open to this share of their travel and close again, over and over. */
const IDLE_OPEN = 0.75;
/** The first opening is brisk, so a fast page isn't kept waiting… */
const FIRST_STROKE_S = 0.6;
/** …while later open / close movements, if the page is slow, run at a calm pace. */
const IDLE_STROKE_S = 1;
/** Final opening: blades open fully while the iris dissolves and the dark screen fades away. */
const REVEAL_S = 0.7;
/** How much the iris swells as it dissolves — barely, just enough to feel like it opens up. */
const IRIS_GROW = 0.08;

type Frame = {
  t: number;
  appear: number;
  irisGrow: number;
  irisFade: number;
  curtainFade: number;
  opening: boolean;
};
const START: Frame = { t: 1, appear: 0, irisGrow: 0, irisFade: 0, curtainFade: 0, opening: false };

type Pt = [number, number];
type Circle = { c: Pt; r: number };

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const dot = (a: Pt, b: Pt) => a[0] * b[0] + a[1] * b[1];

/** Both intersection points of two circles (assumed to intersect). */
const meet = (p: Circle, q: Circle): [Pt, Pt] => {
  const d = sub(q.c, p.c);
  const dist = Math.hypot(d[0], d[1]) || 1e-6;
  const a = (p.r * p.r - q.r * q.r + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(p.r * p.r - a * a, 0));
  const m: Pt = [p.c[0] + (a * d[0]) / dist, p.c[1] + (a * d[1]) / dist];
  const o: Pt = [(-d[1] * h) / dist, (d[0] * h) / dist];
  return [
    [m[0] + o[0], m[1] + o[1]],
    [m[0] - o[0], m[1] - o[1]],
  ];
};

/** Points strictly between `from` and `to` along `circle`, the short way round. */
const arcPts = (circle: Circle, from: Pt, to: Pt, steps: number): Pt[] => {
  const a0 = Math.atan2(from[1] - circle.c[1], from[0] - circle.c[0]);
  let a1 = Math.atan2(to[1] - circle.c[1], to[0] - circle.c[0]);
  while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI;
  while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI;
  return Array.from({ length: steps }, (_, k) => {
    const ang = a0 + ((a1 - a0) * (k + 1)) / (steps + 1);
    return [circle.c[0] + circle.r * Math.cos(ang), circle.c[1] + circle.r * Math.sin(ang)];
  });
};

type Blade = { shape: Pt[]; edge: Pt[] };

/**
 * Blades at `t` (0 = open, 1 = stopped down). Each blade's leading edge is an arc of a large
 * circle; the aperture is where all six discs overlap — a softly rounded hexagon.
 */
const bladesAt = (t: number): Blade[] => {
  // The first bit of travel opens the hole visibly — a linear mapping looks stuck while it's tiny.
  const h = Math.max(CLOSED_H + (OPEN_H - CLOSED_H) * Math.max(1 - t, 0) ** APERTURE_CURVE, 0.6);
  const phi = BASE + TWIST * t;
  const rim: Circle = { c: [0, 0], r: RIM };

  const discs: Circle[] = Array.from({ length: BLADES }, (_, i) => {
    const a = phi + (i * 2 * Math.PI) / BLADES;
    const k = CURVE - h;
    return { c: [-k * Math.cos(a), -k * Math.sin(a)], r: CURVE };
  });

  // Aperture corner between edge i and edge i+1: the meeting point nearer the centre.
  const corner = discs.map((d, i) => {
    const [p, q] = meet(d, discs[(i + 1) % BLADES]);
    return dot(p, p) < dot(q, q) ? p : q;
  });
  // Where edge i runs out at the barrel, continuing past its corner with edge i+1.
  const rimEnd = discs.map((d, i) => {
    const [p, q] = meet(d, rim);
    const ahead = sub(corner[i], corner[(i - 1 + BLADES) % BLADES]);
    return dot(p, ahead) > dot(q, ahead) ? p : q;
  });

  return discs.map((d, i) => {
    const next = (i + 1) % BLADES;
    const from = corner[(i - 1 + BLADES) % BLADES];
    const edge = [from, ...arcPts(d, from, rimEnd[i], 14), rimEnd[i]];
    // Blade face: out along edge i, round the barrel, back in along edge i+1.
    const shape = [
      corner[i],
      ...arcPts(d, corner[i], rimEnd[i], 10),
      rimEnd[i],
      ...arcPts(rim, rimEnd[i], rimEnd[next], 8),
      rimEnd[next],
      ...arcPts(discs[next], rimEnd[next], corner[i], 12),
    ];
    return { shape, edge };
  });
};

const toPath = (pts: Pt[], close: boolean) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('') + (close ? 'Z' : '');

const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const easeOutQuad = (x: number) => 1 - (1 - x) ** 2;
/** Gentle at both ends but moving from the first frame (cubic would look stuck at the start). */
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

/** Drawing box of the iris (barrel + stroke) in px at REST_SCALE 1. */
const BOX = 64;

/**
 * Opening curtain: a dark screen with a small lens diaphragm whose blades quietly open and close
 * while the page loads. When it's ready the blades open all the way as the iris dissolves, and
 * the whole curtain fades away to the page underneath.
 */
export const IrisCurtain = ({ ready, onReveal, onDone }: IrisCurtainProps) => {
  const theme = useTheme();
  const [frame, setFrame] = useState<Frame>(START);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const cbRef = useRef({ onReveal, onDone });
  cbRef.current = { onReveal, onDone };

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const t0 = performance.now();
    // One frame loop drives everything, so blades, iris and curtain never drift apart.
    const live = { opening: false, revealStart: 0, revealed: false, fromT: 1, bladesOpenAt: 1 };

    const tick = (now: number) => {
      if (cancelled) return;
      const s = (now - t0) / 1000;
      const appear = easeOutCubic(clamp01(s / APPEAR_S));

      // Idle strokes only start if the page isn't ready by the end of the closed rest.
      // Even strokes open, odd strokes close; `frac` is progress within one.
      const idleS = s - (CLOSE_IN_S + CLOSED_HOLD_S);
      const later = Math.max(idleS - FIRST_STROKE_S, 0) / IDLE_STROKE_S;
      const inFirst = idleS < FIRST_STROKE_S;
      const strokeIndex = inFirst ? 0 : 1 + Math.floor(later);
      const frac = inFirst ? Math.max(idleS, 0) / FIRST_STROKE_S : later % 1;
      const strokeS = inFirst ? FIRST_STROKE_S : IDLE_STROKE_S;
      const openingStroke = strokeIndex % 2 === 0;
      const stroke = idleS > 0 ? easeInOutSine(frac) : 0;
      // Before the strokes begin it is still closing in from open.
      const closingIn = s < CLOSE_IN_S ? 1 - easeInOutSine(s / CLOSE_IN_S) : 0;
      const idleT = idleS > 0 ? 1 - IDLE_OPEN * (openingStroke ? stroke : 1 - stroke) : 1 - IDLE_OPEN * closingIn;

      // Open for good only as one continuous movement, carried on from the middle of an ordinary
      // opening stroke — never from blades that are slowing down or closing.
      if (
        !live.opening &&
        readyRef.current &&
        idleS >= 0 &&
        openingStroke &&
        frac >= TAKEOVER_FROM &&
        frac < TAKEOVER_TO
      ) {
        live.opening = true;
        live.revealStart = now;
        live.fromT = idleT;
        // Match the blades' current speed so the takeover is seamless at either stroke pace.
        const strokeSpeed = (IDLE_OPEN * Math.PI * Math.sin(Math.PI * frac)) / 2 / strokeS;
        // May exceed 1 (blades still opening at the end): the iris has dissolved by then anyway.
        live.bladesOpenAt = Math.max((2 * idleT) / (strokeSpeed * REVEAL_S), 0.1);
      }

      let t = idleT;
      let p = 0;
      if (live.opening) {
        p = clamp01((now - live.revealStart) / 1000 / REVEAL_S);
        t = live.fromT * (1 - easeOutQuad(clamp01(p / live.bladesOpenAt)));
      }

      setFrame({
        t,
        appear,
        // The iris breathes out a touch and dissolves while its blades finish opening…
        irisGrow: easeOutCubic(clamp01(p / 0.7)),
        irisFade: easeInOutSine(clamp01((p - 0.05) / 0.5)),
        // …and the dark screen starts fading the moment it opens.
        curtainFade: easeOutQuad(clamp01(p / 0.95)),
        opening: live.opening,
      });

      // The page starts its entrance as the curtain begins to lift.
      if (live.opening && !live.revealed && p >= 0.05) {
        live.revealed = true;
        cbRef.current.onReveal();
      }
      if (p >= 1) {
        cbRef.current.onDone();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  const blades = bladesAt(frame.t);
  const scale = REST_SCALE * (0.94 + 0.06 * frame.appear) * (1 + IRIS_GROW * frame.irisGrow);
  const size = BOX * scale;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        opacity: 1 - frame.curtainFade,
        pointerEvents: frame.opening ? 'none' : 'auto',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`${-BOX / 2} ${-BOX / 2} ${BOX} ${BOX}`}
        style={{ display: 'block', opacity: frame.appear * (1 - frame.irisFade) }}
      >
        <defs>
          {/* Brushed metal: lighter at the barrel, darker towards the aperture. */}
          <radialGradient id='iris-a' cx={0} cy={0} r={RIM} gradientUnits='userSpaceOnUse'>
            <stop offset='0.2' stopColor='#19191c' />
            <stop offset='1' stopColor='#2a2a2e' />
          </radialGradient>
          <radialGradient id='iris-b' cx={0} cy={0} r={RIM} gradientUnits='userSpaceOnUse'>
            <stop offset='0.2' stopColor='#151518' />
            <stop offset='1' stopColor='#242428' />
          </radialGradient>
        </defs>
        {blades.map(({ shape }, i) => (
          <path key={i} d={toPath(shape, true)} fill={`url(#iris-${i % 2 ? 'b' : 'a'})`} />
        ))}
        <g fill='none' strokeLinecap='round'>
          {blades.map(({ edge }, i) => (
            <path key={`s${i}`} d={toPath(edge, false)} stroke='#000' strokeOpacity={0.4} strokeWidth={1.4} />
          ))}
          {blades.map(({ edge }, i) => (
            <path
              key={`h${i}`}
              d={toPath(edge, false)}
              stroke={theme.colors.text}
              strokeOpacity={0.32}
              strokeWidth={0.5}
            />
          ))}
        </g>
        <circle r={RIM + 0.9} fill='none' stroke={theme.colors.textMuted} strokeWidth={1} />
      </svg>
    </div>
  );
};
