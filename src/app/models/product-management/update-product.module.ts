import {CreateProductModule} from "./create-product.module";

export interface UpdateProductModule extends CreateProductModule {
  productId: number;
  updatedVariations: UpdatedVariation[];
  deletedVariations: number[];
  deletedImages: number[];
}

export interface UpdatedVariation {
  productVariationId: number;
  quantity: number;
}
