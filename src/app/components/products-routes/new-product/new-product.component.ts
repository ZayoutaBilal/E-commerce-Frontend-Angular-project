import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from "../../../services/product.service";
import {SharedService} from "../../../services/shared.service";
import {DiscountService} from "../../../services/discount.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  productForm: FormGroup;
  imageUrls: string[] = [];
  files: File[] = [];
  categories: any[] = [];
  discounts: any[] = [];



  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private sharedService : SharedService,
    private notificationService : NotificationService,

  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      information: ['', Validators.required],
      category: ['', Validators.required],
      discount: ['', Validators.required],
      variations: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getAllCategoriesAndAllDiscounts();
  }

  switchToProductsComponent(){
    this.sharedService.updateSelectedItem('products');
  }

  getAllCategoriesAndAllDiscounts() {
    this.discountService.getAllCategoriesAndAllDiscounts().subscribe({
      next : (response) => {
        this.discounts = response.body.discounts;
        this.categories = response.body.categories;
      },error : (error) => console.log(error)
    })
  }

  get variations() {
    return this.productForm.get('variations') as FormArray;
  }


  addVariation() {
    const variationGroup = this.fb.group({
      size: ['', Validators.required],
      color: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
    this.variations.push(variationGroup);
  }

  removeVariation(index: number) {
    this.variations.removeAt(index);
  }

  onSubmit() {
    if (!this.productForm.valid) {
      this.notificationService.showWarning('Please fill in all required fields.');
      return;
    }
    if (this.files.length === 0) {
      this.notificationService.showWarning('Please upload at least one image.');
      return;
    }
    if (!this.variations.valid) {
      this.notificationService.showWarning('Please fill the variations modal.');
      return;
    }

    const productData = {
      price: this.productForm.get('price')?.value as number,
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      information: this.productForm.get('information')?.value,
      category: this.productForm.get('category')?.value as number,
      discount: this.productForm.get('discount')?.value as number,
      variations: this.productForm.get('variations')?.value,
    };

    this.productService.addProduct(productData, this.files).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body ?? undefined);
        this.productForm.reset();
        this.files = [];
        this.imageUrls = [];
      },
      error: (error) =>   this.notificationService.handleSaveError(error)

    });
  }


  onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.imageUrls.push(e.target.result.toString());
            this.files.push(file);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
    this.files.splice(index, 1);

  }




}
