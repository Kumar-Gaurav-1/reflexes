import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const PlaceHolderImagesMap = new Map<string, ImagePlaceholder>(
  PlaceHolderImages.map(img => [img.id, img])
);
