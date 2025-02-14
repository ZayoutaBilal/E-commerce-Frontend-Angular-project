import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {SharedService} from "../../../services/shared.service";
import {NotificationService} from "../../../services/notification.service";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

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
  sortedBy:string = '';
  order:string='';
  totalPages: number = 1;
  totalProducts: number = 0;
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private sharedService : SharedService,
    private notificationService : NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
  ) {

  }


  navigateToProduct(productId: string) {

  }

  FilterChanged(event: Event) {

    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

  }

  public  formatReadableDate(dateString:any) {
    const options:any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

  public formatPrice(price:any) {
    if (typeof price === 'string') {

      if (price.includes('$')) {

        return price.replace('$', '') + '$';
      } else {

        return price + '$';
      }
    } else if (typeof price === 'number') {

      return price.toString() + '$';
    } else {

      return 'N/A';
    }
  }


  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(){
    this.productService.getProducts(this.currentPage,this.pageSize,this.sortedBy,this.order).subscribe({
      next:(page) => {
        this.products = page.content;
        this.totalPages= page.totalPages;
        this.totalProducts=page.totalElements;
        this.dataSource = new MatTableDataSource(this.products);
      },error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  goToNewProductComponent(){
    this.sharedService.updateSelectedItem('new-product');
  }


  previousPage() {
    if (this.currentPage > 0){
      this.currentPage--;
      this.getProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages-1){
      this.currentPage++;
      this.getProducts();
    }
  }

  deleteProduct(productId:number){
    this.confirmDialogComponent.openDialog({
      title: "Products",
      content: "Are you sure that you want to delete this product ?"
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
    }
  }

  editProduct(id:number){
    this.sharedService.updateProductIdEditing(id);
    this.goToNewProductComponent();
  }

}
