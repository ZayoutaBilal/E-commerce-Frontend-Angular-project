import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductCart } from 'src/app/models/product-cart/product-cart.module';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: (ProductCart & { newQuantity: number })[] = [];
  //cartItems: (ProductCart)[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService,
    private notificationService : NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      // Map the response to ProductCart array with imageUrl (Base64 string)
      this.cartItems = items.map(item => ({
        ...item,
        newQuantity : item.quantity
       // imageUrl: 'data:image/jpeg;base64,' + this.arrayBufferToBase64(item.image)
      }));
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Helper method to convert Uint8Array to Base64 string
  private arrayBufferToBase64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer));
  }

  // updateQuantity(item: ProductCart, quantity: number): void {
    
  // }

  removeItem(itemId : number){
    this.confirmDialogComponent.openDialog({
      title: "Cart",
      content: "Are you sure that you want to delete this item ?"
    }).subscribe(result => {
      if (result) {
        this.cartService.removeItemFromCartItem(itemId).subscribe({
          next:(response) => {
            this.cartItems = this.cartItems.filter(item => item.itemId !== itemId);
            this.notificationService.showSuccess("Cart",response.body ?? undefined);
          },error:(error) => {
            this.notificationService.handleSaveError(error);
          }
        });
      }
    });
  }

  incrementQuantity(item: any): void {
    item.newQuantity += 1;
    this.updateItemQuantity(item);
  }
  
  decrementQuantity(item: any): void {
    if (item.newQuantity > 1) {
      item.newQuantity -= 1;
      this.updateItemQuantity(item);
    }
  }

  onQuantityChange(qt: number, item: any): void {
    if(this.validateQuantity(item)){
      item.newQuantity = qt;
      this.updateItemQuantity(item);
    }
    
  }
  
  

  updateItemQuantity(item: any) : void {
    if(item.newQuantity > 0){
      this.cartService.updateItemQuantity(item.itemId,item.newQuantity).subscribe({
        next : () => {},
        error : (error) => {
          item.newQuantity=item.quantity;
          this.notificationService.handleSaveError(error);
        }
      });
    }else{
      item.newQuantity=item.quantity;
    }
  }

  validateQuantity(item: any): boolean {
    
    if (item.newQuantity === '' || isNaN(item.newQuantity)) {
      item.newQuantity=item.quantity;
      return false;
    }
    return true;
  }


}
