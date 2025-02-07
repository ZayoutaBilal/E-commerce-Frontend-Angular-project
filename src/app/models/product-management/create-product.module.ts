

export interface CreateProductModule {

  name: string;
  price: number;
  oldPrice: number;
  description: string;
  information: string;
  category: number;
  discount: number;
  variations: Variation[];
}

export interface Variation {
  size: string;
  color: string;
  quantity: number;
}
