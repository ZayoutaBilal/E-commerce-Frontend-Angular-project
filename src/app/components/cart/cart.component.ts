import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductCart } from 'src/app/models/product-cart/product-cart.module';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  //cartItems: (ProductCart & { imageUrl: string })[] = [];
  cartItems: (ProductCart)[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      // Map the response to ProductCart array with imageUrl (Base64 string)
      this.cartItems = items.map(item => ({
        ...item,
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

  updateQuantity(item: ProductCart, quantity: number): void {
    item.quantity = Math.max(0, item.quantity + quantity);
  }
}
