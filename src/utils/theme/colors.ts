const palette = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

const fallSeasonPalette = {
  gray01: '333944',
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
};

export const colors = {
  background: fallSeasonPalette.gray05,
  ...fallSeasonPalette,
  ...palette,
} as const;
