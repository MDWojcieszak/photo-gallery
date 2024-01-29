export type Dimentions = {
  height: number;
  width: number;
};

export type ImageType = {
  url: string;
  date: string;
  description: string;
  variant: 'horizontal' | 'vertical';
  dimensions: Dimentions;
};
