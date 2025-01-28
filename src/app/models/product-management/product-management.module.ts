export interface ProductManagement {
  productId: number;
  name: string;
  price: number;
  oldPrice: number;
  description: string;
  information: string;
  category: number;
  discount: number;
  variations: Variation[];
  images: Image[];
}

export interface Variation {
  size: string;
  color: string;
  quantity: number;
}

export interface Image {
  url: string;
  id:number;
}
