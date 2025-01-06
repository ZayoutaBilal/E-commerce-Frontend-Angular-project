import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductDetailsModule } from 'src/app/models/product-details/product-details.module';
import { ProductToCartModule } from 'src/app/models/product-to-cart/product-to-cart.module';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';


declare var bootstrap: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})


export class ProductDetailsComponent implements OnInit{

  isLoggedIn: boolean = false;
  private CartLength:number=0;

  activeTab: string = 'description';
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  productDetails: ProductDetailsModule | null = null;
  productId: number | null = null;
  rating: number = 0;
  com : string = '';

  

  constructor(
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private productService : ProductService,
    private cartService : CartService,
    private notificationService : NotificationService,
    private authService : AuthService,
    private storageService : StorageService

  ) {}

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      const id=params.get('productId');
      if(id)  this.productId = Number.parseInt(id);
      console.log('Product ID:', this.productId);
    });

    if(this.productId){
      this.productService.getProductDetails(this.productId).subscribe( data =>{
        this.productDetails=data;
        console.log(this.productDetails);
      });
    }

    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
    
  }



  

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


  selectSize(size: string) {
    this.selectedSize = size;
  }

  getColorsForSelectedSize() {
    const combination = this.productDetails?.colorSizeQuantityCombinations.find(
      (comb) => comb.size === this.selectedSize
    );
    return combination ? combination.colorQuantityMap : {};
  }

  incrementQuantity(): void {
    const quantityInput = document.querySelector('.quantity input') as HTMLInputElement;
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10) || 0;
      quantityInput.value = (currentValue + 1).toString();
    }
  }
  
  decrementQuantity(): void {
    const quantityInput = document.querySelector('.quantity input') as HTMLInputElement;
    if (quantityInput) {
      const currentValue = parseInt(quantityInput.value, 10) || 0;
      if (currentValue > 1) {
        quantityInput.value = (currentValue - 1).toString();
      }
    }
  }
  

  addItemToCart(pid: number): void {

    if(!this.isLoggedIn){
      this.router.navigateByUrl('/signin');
      this.notificationService.showInfo(undefined,'You must log in first !');
      return;
    }
    
    const selectedSize = this.selectedSize;
    const selectedColor = this.selectedColor;
    const quantityInput = document.querySelector('.quantity input') as HTMLInputElement;
    const selectedQuantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
  
    if (!selectedSize || !selectedColor) {
      this.notificationService.showWarning(undefined,'Please select a size and color.');
      return;
    }

    const product = new ProductToCartModule(pid, selectedQuantity, selectedColor, selectedSize);
    this.cartService.addProductToCart(product).subscribe(
      {next:(response) => {
        this.CartLength=this.storageService.getCartLength();
        this.storageService.setCartLength(++this.CartLength);
        this.notificationService.showSuccess("Cart",response.body ?? undefined);
      },
      error:(error) => {
        this.notificationService.handleSaveError(error);
      }}
    );
  }

  setRating(star: number): void {
    this.rating = star;
  }

  giveFeedback(): void {
    if (this.rating === 0  && this.com==='') {
      this.notificationService.showWarning('Feedback','Please provide a rating or comment or both before submitting.')
      return;
    }

    const feedbackData = {
      productId: this.productId,
      ratingValue: this.rating === 0 ? null : this.rating,
      comment: this.com
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
    this.com = '';
  }
  



}
