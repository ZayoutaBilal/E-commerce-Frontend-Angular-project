import { Component } from '@angular/core';
import { Page } from 'src/app/models/page/page.module';
import { ProductOverview } from 'src/app/models/product-overview/product-overview.module';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  items = Array.from({ length: 20 }); 

  products: { content: ProductOverview[]; totalPages: number; totalElements: number; } | null = null;
  currentPage: number = 0;
  

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

  loadProducts(page: number): void {
    this.productService.getAllForCustomer(page).subscribe({
      next: (data) => {
        this.products = data;
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  hasNextPage(): boolean {
    return this.products ? this.currentPage < this.products.totalPages - 1 : false;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

}
