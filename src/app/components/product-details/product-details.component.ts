import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductDetailsModule } from 'src/app/models/product-details/product-details.module';
import { ProductToCartModule } from 'src/app/models/product-to-cart/product-to-cart.module';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';


declare var bootstrap: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})


export class ProductDetailsComponent implements OnInit,AfterViewInit{

  isLoggedIn: boolean = false;
  activeTab: string = 'description';
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  productDetails: ProductDetailsModule | null = null;
  productId: number | null = null;

  

  constructor(
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private productService : ProductService,
    private cartService : CartService,
    private notificationService : NotificationService,
    private authService : AuthService

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

  ngAfterViewInit(): void {
    // Initialize carousel after the view is loaded
    const carouselElement = document.querySelector('#product-carousel')!;
    const carousel = new bootstrap.Carousel(carouselElement, {
      interval: 3000, // Auto sliding every 3 seconds
      ride: 'carousel', // Auto-start the carousel on page load
    });
    carousel.cycle();
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
  

  addItemToCart(productId: number): void {

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

    const product = new ProductToCartModule(productId, selectedQuantity, selectedColor, selectedSize);
    this.cartService.addProductToCart(product).subscribe(
      {next:(response) => {
        this.notificationService.showSuccess("Cart",response.body ?? undefined);
      },
      error:(error) => {
        this.notificationService.handleSaveError(error);
      }}
    );
  }
  



}
