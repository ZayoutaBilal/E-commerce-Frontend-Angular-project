import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CategoryService} from "../../services/category.service";
import {NotificationService} from "../../services/notification.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],

})
export class CategoriesComponent implements OnInit {

  editMode: boolean = false;
  categories: any[] = [];
  loading: boolean = false;
  imageUrl: string = '';
  nameCat: string = '';
  descriptionCat: string = '';
  parentCategoryId : number = 0;
  categoryId : number = 0;
  file : File | undefined;

  constructor(
    private router: Router,
    private categoryService : CategoryService,
    private notificationService : NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
  ) {}

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {

      if (!['image/jpeg', 'image/gif', 'image/png', 'image/jpg'].includes(file.type)) {
        this.notificationService.showWarning("Categories", 'Only JPG, GIF, or PNG formats are allowed.');
        return;
      }
      if (file.size > 1024 * 1024) {
        this.notificationService.showWarning("Categories", 'File size should not exceed 1 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.file=file;
    }
  }

  openImage() {
    const inputElement = document.getElementById('image');
    if (inputElement) {
      inputElement.click();
    }
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategoriesForCustomerService().subscribe({
      next : (data) => {
        if(data ==null || data.length === 0) {
          this.notificationService.showInfo("There is no content for this request");
          return;
        }
        this.categories=data;
    },error:(error) => {
        this.notificationService.handleSaveError(error);
    }
    });
  }

  update(cat : any) {
    this.clear();
    this.loading=true;
    this.categoryId=cat.categoryId;
    this.nameCat = cat.name;
    this.descriptionCat = cat.description;
    this.parentCategoryId = cat.parentCategoryId;
    this.imageUrl= cat.image ? 'data:image/jpeg;base64,'+cat.image : '';
    this.loading=false;
    this.editMode = true;
  }

  onSubmit() {
    if(this.loading) return;
    if(!this.nameCat || !this.descriptionCat){
      this.notificationService.showWarning("Both name and description are required");
      return;
    }
    if(this.editMode){
      this.updateCategory();
    }else {
      this.addCategory();
    }
  }

  addCategory(){
    this.categoryService.addCategory(this.nameCat, this.descriptionCat, this.parentCategoryId, this.file).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body['message']);
        let im: string | undefined;
        if (this.file) {
          const reader = new FileReader();
          reader.onload = () => {
            im = reader.result?.toString().split(',')[1];
            this.categories.unshift({
              categoryId: response.body['resource'],
              name: this.nameCat,
              description: this.descriptionCat,
              parentCategoryId: this.parentCategoryId,
              image: im,
              createdAt: new Date().getTime(),
            });
          };
          reader.readAsDataURL(this.file);

        } else {
          this.categories.unshift({
            categoryId: response.body['resource'],
            name: this.nameCat,
            description: this.descriptionCat,
            parentCategoryId: this.parentCategoryId,
            image: undefined,
            createdAt: new Date().getTime(),
          });
        }
      },
      error: (error) => {
        this.notificationService.handleSaveError(error);
      },
    });
  }

  updateCategory(){
    this.categoryService.updateCategory(this.categoryId,this.nameCat, this.descriptionCat, this.parentCategoryId, this.file).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body ?? undefined);
        let im: string | undefined;
        if (this.file) {
          const reader = new FileReader();
          reader.onload = () => {
            im = reader.result?.toString().split(',')[1];
            this.categories.map(c => {
              if(c.categoryId == this.categoryId){
                c.name = this.nameCat;
                c.description = this.descriptionCat;
                c.parentCategoryId = this.parentCategoryId;
                c.image=im;
              }
            });
          };
          reader.readAsDataURL(this.file);

        } else {
          this.categories.map(c => {
            if(c.categoryId == this.categoryId){
              c.name = this.nameCat;
              c.description = this.descriptionCat;
              c.parentCategoryId = this.parentCategoryId;
            }
          });
        }
      },
      error: (error) => {
        this.notificationService.handleSaveError(error);
      },
    });

  }

  delete(cat: any) {
    this.confirmDialogComponent.openDialog({
      title: "Categories",
      content: "Are you sure that you want to delete this category?"
    }).subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(cat.categoryId).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
            this.categories=this.categories.filter(c => c.categoryId !== cat.categoryId);
          },
          error: (error) => this.notificationService.handleSaveError(error)
        });
      }
    });
  }

  clear(){
    this.categoryId=0;
    this.nameCat = '';
    this.descriptionCat = '';
    this.parentCategoryId = 0;
    this.imageUrl='';
    this.file=undefined;
    this.editMode=false;
  }


  formatReadableDate(dateString: any) {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }
}
