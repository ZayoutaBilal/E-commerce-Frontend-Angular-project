import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from "../../../services/product.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from "../../../services/shared.service";
import { NotificationService } from "../../../services/notification.service";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'ID',
    'Image',
    'Name',
    'Price',
    'Old price',
    'Quantity',
    'Discount',
    'Category',
    'Created at',
    'Updated at',
    'Edit',
    'Delete',
  ];

  products: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  sortedBy: string = '';
  order: string = '';
  totalPages: number = 1;
  totalProducts: number = 0;
  dataSource = new MatTableDataSource<any>([]);

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private notificationService: NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  getProducts() {
    this.productService.getProducts(this.currentPage, this.pageSize, this.sortedBy, this.order).subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalPages = page.totalPages;
        this.totalProducts = page.totalElements;
        this.dataSource.data = this.products; // Update dataSource.data instead of reassigning
      },
      error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  navigateToProduct(productId: string) {
    // Implement navigation logic
  }

  FilterChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  public formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  public formatPrice(price: any) {
    if (typeof price === 'string') {
      if (price.includes('$')) {
        return price.replace('$', '') + '$';
      } else {
        return price + '$';
      }
    } else if (typeof price === 'number') {
      if (price == 0) return '-';
      return price.toString() + '$';
    } else {
      return 'N/A';
    }
  }

  goToNewProductComponent() {
    this.sharedService.updateSelectedItem('new-product');
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getProducts();
    }
  }

  deleteProduct(productId: number) {
    this.confirmDialogComponent.openDialog({
      title: "Products",
      content: "Are you sure that you want to delete this product?"
    }).subscribe(result => {
      if (result) {
        this.productService.deleteProduct(productId).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
            this.removeProductFromList(productId);
          },
          error: (error) => this.notificationService.handleSaveError(error)
        });
      }
    });
  }

  removeProductFromList(productId: number) {
    const index = this.products.findIndex(product => product.productId === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.dataSource.data = this.products;
    }
  }

  editProduct(id: number) {
    this.sharedService.updateProductIdEditing(id);
    this.goToNewProductComponent();
  }
}
