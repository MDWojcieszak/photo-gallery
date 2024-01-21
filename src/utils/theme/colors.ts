const palette = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  background: palette.black,
  ...palette,
} as const;
