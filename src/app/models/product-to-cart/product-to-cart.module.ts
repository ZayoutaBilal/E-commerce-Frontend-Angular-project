
export class ProductToCartModule {
  private productId: number;
  private quantity : number;
  private color : string;
  private size : string;




  constructor(productId: number,quantity : number,color : string,size : string) {
      this.productId=productId;
      this.color=color;
      this.quantity=quantity;
      this.size=size;
    }


}
