export interface ProductDetailsModule {
  productId: number;
  productName: string;
  productCategory: string;
  productDiscount: number;
  productDescription?: string;
  productInformation?: string;
  productPrice: number;
  productStars:number;
  productTotalRatings:number;
  productOldPrice: number;
  productImages: string[];
  colorSizeQuantityCombinations: ColorSizeQuantityCombination[];
}

export interface ColorSizeQuantityCombination {
  size: string;
  colorQuantityMap: { [color: string]: number };
}
