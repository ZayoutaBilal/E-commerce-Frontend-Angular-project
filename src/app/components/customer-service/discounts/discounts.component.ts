import { Component, OnInit } from '@angular/core';
import { DiscountOverviewModule } from '../../../models/discount-overview/discount-overview.module';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {

  discounts: DiscountOverviewModule[] = [];
  discountFilter : string = 'active';
  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  discountForm: FormGroup;
  discountIdEdited : number = 0;

  constructor(
    private discountService: DiscountService,
    private formBuilder: FormBuilder,
    private notificationService : NotificationService,
    private confirmDialogComponent: ConfirmDialogComponent,
  ) {
    this.discountForm = this.formBuilder.group({
      name: ['', Validators.required],
      percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      endDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadDiscounts(false,false);
  }

  loadDiscounts(isEnded: boolean , all : boolean): void {
    this.discountService.getAllDiscounts(isEnded,all).subscribe({
      next : (response) => {
        this.discounts = response.body ?? [];
      },error : (error) => this.notificationService.handleSaveError(error)
    });
  }


  openAddModal() {
    this.modalMode = 'add';
    this.showModal = true;
  }

  openEditModal(discount: DiscountOverviewModule) {
    this.modalMode = 'edit';
    this.discountForm.patchValue(discount);
    this.discountIdEdited = discount.discountId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.discountForm.reset();
    this.discountIdEdited = 0;
  }


  saveDiscount() {
    if (this.discountForm.invalid) {
      this.notificationService.showWarning('Please fill in all fields.');
      return ;
    }
    if (this.modalMode === 'add') {
      this.discountService.addDiscount(this.discountForm.value).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.body['message'] ?? undefined);
          this.discounts.unshift(response.body['resource']);
        },error : (error) => this.notificationService.handleSaveError(error)
      });
    } else if (this.modalMode === 'edit') {
        this.discountService.updateDiscount({discountId:this.discountIdEdited,...this.discountForm.value}).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
          },error : (error) => this.notificationService.handleSaveError(error)
        });
      this.updateDiscount();
    }
    this.closeModal();
  }

  updateDiscount() {
    const discountToUpdate = this.discounts.find(d => d.discountId === this.discountIdEdited);
    if (discountToUpdate) {
      discountToUpdate.endDate = this.discountForm.get('endDate')?.value;
      discountToUpdate.startDate = this.discountForm.get('startDate')?.value;
      discountToUpdate.description = this.discountForm.get('description')?.value;
      discountToUpdate.name = this.discountForm.get('name')?.value;
      discountToUpdate.percent = this.discountForm.get('percent')?.value;
    }
  }

  deleteDiscount(id: number) {
    this.confirmDialogComponent.openDialog({
      title: "Discounts",
      content: "All products related to this discount will lose this discount, are you sure that you want to delete it ?"
    }).subscribe(result => {
      if (result) {
        this.discountService.deleteDiscount(id).subscribe({
          next: (response) => {
            this.notificationService.showSuccess(response.body ?? undefined);
            this.discounts = this.discounts.filter(discount => discount.discountId !== id);
          },error : (error) => this.notificationService.handleSaveError(error)
        })
      }
    });
  }

  onFilterChange() {
    switch (this.discountFilter){
      case "all" : {
        this.loadDiscounts(false,true);
        break;
      }
      case "ended" : {
        this.loadDiscounts(true,false);
        break;
      }
      default :
        this.loadDiscounts(false,false);

    }
  }

  protected readonly Date = Date;
}


import { Pipe, PipeTransform } from '@angular/core';
import {DiscountService} from "../../../services/discount.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {ConfirmDialogComponent} from "../../confirm-dialog/confirm-dialog.component";

@Pipe({
  standalone: true,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    if (!value) {
      return '';
    }
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
