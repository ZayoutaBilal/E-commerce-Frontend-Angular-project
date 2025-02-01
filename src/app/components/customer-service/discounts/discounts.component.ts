import { Component, OnInit } from '@angular/core';
import { DiscountOverviewModule } from '../../../models/discount-overview/discount-overview.module';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {

  discounts: DiscountOverviewModule[] = [];
  discountFilter : string = '';
  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  newDiscount: DiscountOverviewModule = {
    discountId: 0,
    name: '',
    percent: 0,
    description: '',
    startDate: Date.prototype,
    endDate: Date.prototype,
    createdAt : Date.prototype
  };
  editDiscount: DiscountOverviewModule | null = null;
  nextId: number = 1;

  constructor(
    private discountService: DiscountService,
  ) {
  }


  ngOnInit(): void {
    this.loadDiscounts(false,false);
  }

  loadDiscounts(isEnded: boolean , all : boolean): void {
    this.discountService.getAllDiscounts(isEnded,all).subscribe({
      next : (response) => {
        this.discounts = response.body ?? [];
      },error : (error) => console.log(error)
    });
  }


  openAddModal() {
    this.modalMode = 'add';
    this.newDiscount = {
      discountId: 0,
      name: '',
      percent: 0,
      description: '',
      startDate: Date.prototype,
      endDate: Date.prototype,
      createdAt : Date.prototype
    };
    this.showModal = true;
  }

  openEditModal(discount: DiscountOverviewModule) {
    this.modalMode = 'edit';
    this.editDiscount = { ...discount };
    this.showModal = true;

  }

  closeModal() {
    this.showModal = false;
    this.editDiscount = null;
  }


  saveDiscount() {
    if (this.modalMode === 'add') {
      // Create new discount object
      const newDiscountToAdd = {...this.newDiscount}

      this.discounts.push(newDiscountToAdd);
      this.nextId++;
      this.saveToLocalStorage();
    } else if (this.modalMode === 'edit' && this.editDiscount) {

      // Find the index of the discount to be updated
      const index = this.discounts.findIndex(d => d.discountId === this.editDiscount!.discountId);

      if (index !== -1) {
        // Update the discount at the found index
        this.discounts[index] = {
          ...this.editDiscount
        };
        this.saveToLocalStorage();
      }

    }
    this.closeModal();
  }

  deleteDiscount(id: number) {
    this.discounts = this.discounts.filter(discount => discount.discountId !== id);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {

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

}


import { Pipe, PipeTransform } from '@angular/core';
import {DiscountService} from "../../../services/discount.service";

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
