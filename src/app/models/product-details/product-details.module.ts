export interface ProductDetailsModule {
  productId: number;
  productName: string;
  productCategory: string;
  productDiscount: number;
  productDescription?: string;
  productInformation: string;
  productPrice: number;
  productStars:number;
  productTotalRatings:number;
  productOldPrice: number;
  productImages: string[];
  colorSizeQuantityCombinations: ColorSizeQuantityCombination[];
  productReviews : ProductReview[];
}

export interface ColorSizeQuantityCombination {
  size: string;
  colorQuantityMap: { [color: string]: number };
}

export interface ProductReview {
  comment : string;
  username : string;
  stars : number;
  image : string;
  creationDate : Date;
}
