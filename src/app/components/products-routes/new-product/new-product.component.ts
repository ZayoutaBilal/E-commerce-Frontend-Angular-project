import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from "../../../services/product.service";
import {SharedService} from "../../../services/shared.service";
import {DiscountService} from "../../../services/discount.service";
import {NotificationService} from "../../../services/notification.service";
import {Image, Variation} from "../../../models/product-management/get-product.module";
import {UpdatedVariation} from "../../../models/product-management/update-product.module";


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
  deletedVariationIds: number[] = [];
  showImageModal: boolean = false;
  modalImageUrls: Image[] = [];
  updatedVariations: UpdatedVariation[] = [];

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
      },error : (error) => this.notificationService.handleSaveError(error)
    })
  }

  get variations() {
    return this.productForm.get('variations') as FormArray;
  }


  addVariation(variations?: Variation[], isNew: boolean = false) {
    if (!variations || variations.length === 0) {
      this.variations.push(this.createVariationGroup(undefined, true)); // true = new variation
    } else {
      variations.forEach((variation) => {
        this.variations.push(this.createVariationGroup(variation, isNew)); // isNew = false for existing variations
      });
    }
  }

  createVariationGroup(variation?: Variation, isNew: boolean = false): FormGroup {
    const group = this.fb.group({
      productVariationId: [variation?.productVariationId || null],
      size: [
        { value: variation?.size || '', disabled: !isNew },
        Validators.required
      ],
      color: [
        { value: variation?.color || '', disabled: !isNew },
        Validators.required
      ],
      quantity: [
        variation?.quantity || 1,
        [Validators.required, Validators.min(1)]
      ],
    });
    if (!isNew && variation?.productVariationId) {
      group.get('quantity')?.valueChanges.subscribe((newQuantity) => {
        this.updateVariationQuantity(variation.productVariationId, newQuantity || 1);
      });
    }

    return group;
  }

  updateVariationQuantity(variationId: number, newQuantity: number): void {
    const existingVariation = this.updatedVariations.find(
      (v) => v.productVariationId === variationId
    );
    if (existingVariation) {
      existingVariation.quantity = newQuantity;
     } else {
      this.updatedVariations.push({ productVariationId:variationId, quantity: newQuantity });
    }
  }



  removeVariation(index: number) {
    if(!this.isAdding){
      const productVariationId = this.variations.at(index).get("productVariationId")?.value;
      if (productVariationId) {
        this.deletedVariationIds.push(productVariationId);
      }
    }
    this.variations.removeAt(index);
  }


  onSubmit() {
    if (!this.productForm.valid ) {
      this.notificationService.showWarning('Please fill in all required fields.');
      return;
    }
    if (this.files.length === 0 && this.isAdding) {
      this.notificationService.showWarning('Please upload at least one image.');
      return;
    }
    if (!this.variations.valid || this.variations.length == 0) {
      this.notificationService.showWarning('Please fill the variations modal.');
      return;
    }

    if(this.isAdding)
      this.productService.addProduct(this.productForm.value, this.files).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.body ?? undefined);
          this.clearForm();
        },
        error: (error) =>   this.notificationService.handleSaveError(error)
      });
    else
      if(this.productId){
        const newVariations = this.productForm.get('variations')?.value.filter((variation: Variation) => variation.productVariationId == null);
        this.productService.updateProduct({productId:this.productId,deletedVariations:this.deletedVariationIds,deletedImages:this.deletedImageIds,
          updatedVariations:this.updatedVariations,...({ ...this.productForm.value, variations: newVariations })},this.files).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
            this.clearForm();
            this.sharedService.updateProductIdEditing(0);
            this.switchToProductsComponent();
          },
          error: (error) =>   this.notificationService.handleSaveError(error)
        });
      }
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
    this.deletedVariationIds = [];
  }

  openImageModal() {
    this.modalImageUrls = [...this.existingImages];
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
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
    if(this.productId !== 0)
      this.sharedService.updateProductIdEditing(0);
  }



}
