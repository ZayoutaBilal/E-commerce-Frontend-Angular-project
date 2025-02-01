import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from "../../../services/product.service";
import {SharedService} from "../../../services/shared.service";
import {DiscountService} from "../../../services/discount.service";
import {NotificationService} from "../../../services/notification.service";
import {Image, Variation} from "../../../models/product-management/product-management.module";




@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit ,OnDestroy{

  productForm: FormGroup;
  productId: number | undefined;
  imageUrls: string[] = [];
  files: File[] = [];
  categories: any[] = [];
  discounts: any[] = [];
  isAdding: boolean = true;


  existingImages: Image[] = [];
  deletedImageIds: number[] = [];
  showImageModal: boolean = false;
  modalImageUrls: Image[] = [];

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private sharedService : SharedService,
    private notificationService : NotificationService

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
    this.sharedService.productIdEditing$.subscribe({
      next: (param) => {
        if(param !== 0){
          this.isAdding=false;
          this.productId=param;
          this.productService.getProductForManagement(param).subscribe({
            next: (data) => {
              this.productForm.patchValue({
                name: data.name,
                price: data.price,
                description: data.description,
                information : data.information,
                category: data.category,
                discount: data.discount,
              });
              if (data.images && data.images.length > 0) {
                this.existingImages = data.images.map((img:any) => ({
                  url: 'data:image/jpeg;base64,'+img.url,
                  id: img.id
                }));
              }
              this.addVariation(data.variations);
            },error: (error) => this.notificationService.handleSaveError(error)
          })
        }
      },error:(error) => this.notificationService.handleSaveError(error)
    })

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


  addVariation(variations?: Variation[]) {
    if (!variations || variations.length === 0) {
      this.variations.push(this.createVariationGroup());
    } else {
      variations.forEach((variation) => {
        this.variations.push(this.createVariationGroup(variation));
      });
    }
  }

  createVariationGroup(variation?: Variation): FormGroup {
    return this.fb.group({
      size: [variation?.size || '', Validators.required],
      color: [variation?.color || '', Validators.required],
      quantity: [variation?.quantity || 1, [Validators.required, Validators.min(1)]],
    });
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

    if(this.isAdding)
      this.productService.addProduct(productData, this.files).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.body ?? undefined);
          this.clearForm();
        },
        error: (error) =>   this.notificationService.handleSaveError(error)
      });
    else
      if(this.productId)
        this.productService.updateProduct(this.productId,productData, this.files,this.deletedImageIds).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
            this.clearForm();
            this.sharedService.updateProductIdEditing(0);
            this.switchToProductsComponent();
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

  clearForm(){
    this.productForm.reset();
    this.files = [];
    this.imageUrls = [];
    this.deletedImageIds = [];
  }

  openImageModal() {
    this.modalImageUrls = [...this.existingImages];
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.deletedImageIds = [];
  }

  removeImageFromModal(index: number) {
    const removedImage = this.modalImageUrls[index];
    this.modalImageUrls.splice(index, 1);

    if (removedImage.id) {
      this.deletedImageIds.push(removedImage.id);
      this.notificationService.show(removedImage.id+'');
    }
  }
  removeAllImagesFromModal() {
    this.deletedImageIds.push(...this.modalImageUrls.filter(image => image.id).map(image => image.id as number));
    this.modalImageUrls = [];
  }

  saveModalImages() {
    this.existingImages = [...this.modalImageUrls];
    this.closeImageModal();
  }

  ngOnDestroy(): void {
    this.sharedService.updateProductIdEditing(0);
  }



}
