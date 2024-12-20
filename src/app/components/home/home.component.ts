import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category/category.module';
import { ProductOverview } from 'src/app/models/product-overview/product-overview.module';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit{
  categories: Category[] = [];
  searchCategory = '';
  recentProducts : { content: ProductOverview[]; totalPages: number; totalElements: number; } | null = null;
  productGroups: ProductOverview[][] = [];

  constructor(private productService: ProductService,
      private categoryService: CategoryService,
      private notificationService : NotificationService,
      private authService : AuthService,
      private cartService : CartService,
      private storageService : StorageService,
      private sharedService : SharedService,
      private http: HttpClient,
      private router: Router
      
    ) {}


    ngOnInit(): void {
      this.categoryService.getCategories().subscribe((data) => {
        this.categories = data;
      });

      this.productService.getRecentProducts().subscribe((data) => {
        this.recentProducts = data;
        this.createProductGroups();
      });
      
    }

    onSearch(subcategory : string): void {
        if (this.router.url !== '/shop') {
          this.router.navigateByUrl('/shop');
        }
        this.sharedService.updateSearchQuery(subcategory);
    }

    createProductGroups(): void {
      const groupSize = 4;
      if (this.recentProducts?.content) {
        for (let i = 0; i < this.recentProducts.content.length; i += groupSize) {
          this.productGroups.push(this.recentProducts.content.slice(i, i + groupSize));
        }
      }
    }

    
}
