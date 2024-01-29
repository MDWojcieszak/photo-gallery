import { ImageType } from '~/types/image';

type Column = {
  images: { data: ImageType; index: number }[];
  totalHeight: number;
};

export const splitData = (images: ImageType[], columns: number) => {
  const columnsArray: Column[] = new Array(columns).fill(null).map(() => ({ images: [], totalHeight: 0 }));
  images.forEach((image, index) => {
    // Find the column with the minimum total height
    const minColumnIndex = columnsArray.reduce((minIndex, column, currentIndex) => {
      const currentTotalHeight = column.totalHeight;
      const minTotalHeight = columnsArray[minIndex].totalHeight;
      return currentTotalHeight < minTotalHeight ? currentIndex : minIndex;
    }, 0);

    // Add the image to the column with the minimum total height
    columnsArray[minColumnIndex].images.push({ data: image, index: index });

    // Update the current height of the selected column
    columnsArray[minColumnIndex].totalHeight += image.dimensions.height;
  });
  return columnsArray;
};
