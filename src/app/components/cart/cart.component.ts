import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductCart } from 'src/app/models/product-cart/product-cart.module';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: (ProductCart & { newQuantity: number })[] = [];
  totalAmount: number = 0;
  rating: number = 0;
  comment : string = '';
  productIdRating : number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private notificationService : NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
    private storage : StorageService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        newQuantity : item.quantity
       // imageUrl: 'data:image/jpeg;base64,' + this.arrayBufferToBase64(item.image)
      }));
      this.storage.setCartLength(this.cartItems.length);
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


  setRating(star: number): void {
    this.rating = star;
  }

  setProductIdRating(id : number):void{
    this.productIdRating=id;
  }


  giveFeedback(): void {
    if (this.rating === 0  && this.comment==='') {
      this.notificationService.showWarning('Feedback','Please provide a rating or comment or both before submitting.')
      return;
    }

    const feedbackData = {
      productId: this.productIdRating,
      ratingValue: this.rating === 0 ? null : this.rating,
      comment: this.comment
    };

    console.log(feedbackData);

    this.productService.submitFeedback(feedbackData).subscribe({
      next : (response) => {
        this.notificationService.showSuccess('Feedback',response.body ?? undefined);
      },error : (error) => {
        this.notificationService.handleSaveError(error);
      }
    });
    this.clearFeedback();
  }

  clearFeedback(): void {
    this.rating = 0;
    this.comment = '';
  }


}
