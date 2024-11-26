import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ProductOverview } from 'src/app/models/product-overview/product-overview.module';
import { Category } from 'src/app/models/category/category.module';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router }  from '@angular/router';
import { Modal } from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductToCartModule } from 'src/app/models/product-to-cart/product-to-cart.module';
import { ColorSizeQuantityCombination } from 'src/app/models/product-details/product-details.module';
import { StorageService } from 'src/app/services/storage.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  
  isLoggedIn: boolean = false;
  private CartLength:number=0;
  
  products: { content: ProductOverview[]; totalPages: number; totalElements: number; } | null = null;
  currentPage: number = 0;
  path : string = '';
  categoryChosen : string ='';
  origin : string ='';
  visiblePages: number[] = [];
  expandedCategory: string | null = null;
  categories: Category[] = [];

  rating: number = 0;
  comment : string = '';
  productIdRating : number = 0;
  
  selectedProduct: any = null;
  colorSizeQuantityCombinations: ColorSizeQuantityCombination[] = [];
  selectedSize: string | null = null;
  selectedColor: string | null = null;


  

  setRating(star: number): void {
    this.rating = star;
  }

  setProductIdRating(id : number):void{
    this.productIdRating=id;
  }

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService : NotificationService,
    private router : Router,
    private authService : AuthService,
    private cartService : CartService,
    private storageService : StorageService,
    private sharedService : SharedService
    
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.loadProducts(this.currentPage);

    this.sharedService.searchCategory$.subscribe((cat) => {
      if(cat) {
        this.getProductsByCategory(cat);
      }
    });
    

    
  }

  toggleCategory(categoryName: string): void {
    this.expandedCategory = this.expandedCategory === categoryName ? null : categoryName;
  }

  


  loadProducts(page: number, categoryName? : string,origin : string =''): void {
    if(categoryName){
      this.productService.getProductByCategpry(categoryName,origin,page).subscribe({
        next: (data) => {
          this.products = data;
          this.currentPage = page;
          this.updateVisiblePages();
        },
        error: (error) => {
          this.notificationService.handleSaveError(error);
        }
      });
    }else{
      if(this.isLoggedIn)
      {this.productService.getAllForCustomer(page).subscribe({
        next: (data) => {
          this.products = data;
          this.currentPage = page;
          this.updateVisiblePages();
        },
        error: (error) => {
         this.notificationService.handleSaveError(error);
        }
      });
    }else{
      
    }
    }
  }

  getProductsByCategory(categoryName : string,origin : string = '') : void {
    this.categoryChosen=categoryName;
    this.origin=origin;
    this.path=[origin ? '/' : '',origin,"/",categoryName].join(' ');
    this.loadProducts(0,categoryName,origin);

  }

  returnToShop() : void {
    this.categoryChosen='';
    this.origin='';
    this.path=''
    this.loadProducts(0);
  }

  updateVisiblePages(): void {
    const maxVisiblePages = 6;
    const totalPages = this.products?.totalPages ?? 0;
    const currentPage = Math.max(0, Math.min(this.currentPage, totalPages - 1));
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 0);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }
  

  nextPage(): void {
    if (this.hasNextPage()) {
      this.loadProducts(this.currentPage + 1,this.categoryChosen,this.origin);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.loadProducts(this.currentPage - 1,this.categoryChosen,this.origin);
    }
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      this.loadProducts(page,this.categoryChosen,this.origin);
    }
  }

  hasNextPage(): boolean {
    return this.products ? this.currentPage < this.products.totalPages - 1 : false;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
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


    

  prepareQuickAdd(product: any): void {
    this.selectedProduct=product;
    this.colorSizeQuantityCombinations = [];
    this.selectedSize = null;
    this.selectedColor = null;

    this.productService.getProductColorSizeQuantityCombination(this.selectedProduct.id).subscribe({
        next:(combinations: ColorSizeQuantityCombination[]) => {
        this.colorSizeQuantityCombinations = combinations;
      },
      error:(error) => {
        this.notificationService.showError('Failed to fetch color-size-quantity combinations:', error);
      }
    }
    );
  }

  addToCart(): void {

    if (!this.selectedSize || !this.selectedColor) {
      this.notificationService.showWarning(undefined,'Please select a size and color.');
      return;
    }

    

    const prod = new ProductToCartModule(this.selectedProduct.id, 1, this.selectedColor, this.selectedSize);
    this.cartService.addProductToCart(prod).subscribe(
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

  selectSize(size: string): void {
    this.selectedSize = size;
    this.selectedColor = null;
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
  }
  

  getColorsForSelectedSize(): { [color: string]: number } {
    if (!this.selectedSize) return {};
  
    const selectedCombination = this.colorSizeQuantityCombinations
      .find((combination: ColorSizeQuantityCombination) => combination.size === this.selectedSize);
  
    return selectedCombination ? selectedCombination.colorQuantityMap : {};
  }
  




}
