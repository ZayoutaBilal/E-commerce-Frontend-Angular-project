import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ProductOverview } from 'src/app/models/product-overview/product-overview.module';
import { Category } from 'src/app/models/category/category.module';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  products: { content: ProductOverview[]; totalPages: number; totalElements: number; } | null = null;
  currentPage: number = 0;
  path : string = '';
  categoryChosen : string ='';
  origin : string ='';
  visiblePages: number[] = [];
  expandedCategory: string | null = null;
  categories: Category[] = [];
  

  constructor(private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.loadProducts(this.currentPage);
  }

  toggleCategory(categoryName: string): void {
    this.expandedCategory = this.expandedCategory === categoryName ? null : categoryName;
  }

  loadProducts(page: number, categoryName? : string,origin? : string): void {
    if(categoryName && origin){
      this.productService.getProductByCategpry(categoryName,origin,page).subscribe({
        next: (data) => {
          this.products = data;
          this.currentPage = page;
          this.updateVisiblePages();
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
      });
    }else{
      this.productService.getAllForCustomer(page).subscribe({
        next: (data) => {
          this.products = data;
          this.currentPage = page;
          this.updateVisiblePages();
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
      });
    }
  }

  getProductsByCategory(categoryName : string,origin : string) : void {
    this.categoryChosen=categoryName;
    this.origin=origin;
    this.path=["/",origin,"/",categoryName].join(' ');
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
}
