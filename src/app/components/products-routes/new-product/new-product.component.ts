import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from "../../../services/product.service";
import { CategoryService } from '../../../services/category.service'
import {SharedService} from "../../../services/shared.service";
import {DiscountService} from "../../../services/discount.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  public productForm: FormGroup;
  public imageUrls: string[] = [];
  public categories: any[] = [];
  public discounts: any[] = [];
  discountId : number | undefined;
  categoryId: number | undefined;


  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private sharedService : SharedService,

  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      images: ['',Validators.required],
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
    console.log(this.productForm);
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
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
  }




}
