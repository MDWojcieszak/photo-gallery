export const splitIntoColumns = <T>(items: T[], columns: number, ratioOf: (item: T) => number): T[][] => {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);

  for (const item of items) {
    let min = 0;
    for (let i = 1; i < columns; i++) if (heights[i] < heights[min]) min = i;
    cols[min].push(item);
    const ratio = ratioOf(item) || 1.5;
    heights[min] += 1 / ratio;
  }
  return cols;
};
