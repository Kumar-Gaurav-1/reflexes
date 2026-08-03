import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const PlaceHolderImagesMap: Record<string, ImagePlaceholder> = Object.fromEntries(
  PlaceHolderImages.map(img => [img.id, img])
);
