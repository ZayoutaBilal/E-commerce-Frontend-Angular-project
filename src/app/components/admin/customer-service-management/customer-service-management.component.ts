import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserInfosModule } from 'src/app/models/user-infos/user-infos.module';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-customer-service-management',
  templateUrl: './customer-service-management.component.html',
  styleUrls: ['./customer-service-management.component.css'],
})
export class CustomerServiceManagementComponent implements OnInit {
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  CustomerServiceList: UserInfosModule[] = [];
  newCustomerService: any = {};
  editingCustomerService: any = {};

  constructor(private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCustomerServices(); 
  }

  loadCustomerServices() {
    this.userService.getCustomersServices(this.currentPage - 1, this.pageSize).subscribe((response) => {
      this.CustomerServiceList = response.body?.content || [];
      this.totalItems = response.body?.totalElements || 0;
    });
  }

  onSearch() {
    // TODO: Implement search logic
  }

  resetSearch() {
    this.searchTerm = '';
    this.loadCustomerServices();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.CustomerServiceList = this.CustomerServiceList.slice(0, this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCustomerServices();
  }

  resetPassword(id: number) {
    // TODO: Implement password reset logicn
  }

  openEditModal(CustomerService: any) {
    this.editingCustomerService = { ...CustomerService };
  }

  deleteCustomerService(id: number) {
    this.notificationService.showInfo('Customer service deleted successfully with id: ' + id);
  }

  addCustomerService() {
    // TODO: Implement add CustomerService logic
  }

  updateCustomerService() {
    // TODO: Implement update CustomerService logic
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newCustomerService.profilePicture = file;
    }
  }

}
