const palette = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

const galleryPalette = {
  ink: '#0C0C0D',
  surface: '#111112',
  surface02: '#171719',
  surface03: '#202022',
  line: 'rgba(255,255,255,0.09)',
  lineStrong: 'rgba(255,255,255,0.18)',

  text: '#ECECEC',
  textMuted: '#A6A6A6',
  textFaint: '#6E6E6E',

  accent: '#D4D4D4',
  accentSoft: '#9C9C9C',

  gray01: '#333944',
  gray02: '#292d38',
  gray03: '#1f222a',
  gray04: '#14171c',
  gray05: '#0B0C0D',
  mainGreen: '#359E7A',
  lightGreen: '#8CCF77',
  yellow: '#F9F871',
  blue: '#009DF8',
  lightBlue: '#D1F5FF',
  lightBlue02: '#A9D6FF',
} as const;

export const colors = {
  background: galleryPalette.ink,
  ...galleryPalette,
  ...palette,
} as const;
