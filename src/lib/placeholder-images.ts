import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

// ⚡ Bolt Optimization: Precompute a Map to optimize image lookups from O(N) to O(1).
// This reduces main thread blocking during frequent renders.
export const PlaceHolderImageMap = new Map(
  PlaceHolderImages.map(img => [img.id, img])
);

export const getImg = (id: string) => PlaceHolderImageMap.get(id);
