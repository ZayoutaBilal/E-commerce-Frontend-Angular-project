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
  selectedRole: string = 'CUSTOMER';
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  users: UserInfosModule[] = [];
  newUser: UserInfosModule = new UserInfosModule();
  editingUser: UserInfosModule = new UserInfosModule();

  constructor(private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers(); 
  }

  loadUsers() {
    if (this.selectedRole === 'CUSTOMER') {
      this.userService.getCustomers(this.currentPage - 1, this.pageSize).subscribe((response) => {
        this.users = response.body?.content || [];
        this.totalItems = response.body?.totalElements || 0;
      });
    } else {
      this.userService.getCustomersServices(this.currentPage - 1, this.pageSize).subscribe((response) => {
        this.users = response.body?.content || [];
        this.totalItems = response.body?.totalElements || 0;
      });
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearch() {
    if (this.searchTerm.trim() !== '') {
    this.userService.searchUsers(this.searchTerm.trim(), this.currentPage - 1, this.pageSize).subscribe((response) => {
      this.users = response.body?.content || [];
        this.totalItems = response.body?.totalElements || 0;
      });
    }
  }

  resetSearch() {
    this.searchTerm = '';
    this.loadUsers();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.users = this.users.slice(0, this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  resetPassword(id: number) {
    this.userService.resetPassword(id).subscribe({
      next: (response) => {
        console.log(`Password reset successfully ==${response.body}==`);
        this.notificationService.showSuccess('Password reset successfully');
      },
      error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  openEditModal(user: any) {
    this.editingUser = { ...user };
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('User deleted successfully');
      },
      error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  addUser() {
    this.userService.addUser({...this.newUser, active: true}).subscribe({
      next: () => {
        this.notificationService.showSuccess('User added successfully');
      },
      error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  updateUser() {
    this.userService.updateUser(this.editingUser.userId, this.editingUser).subscribe({
      next: () => {
        this.notificationService.showSuccess('User updated successfully');
      },
      error: (error) => this.notificationService.handleSaveError(error)
    });
  }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
  //     this.newUser.picture = file;
  //   }
  // }

}
