import { Component, OnInit, OnChanges, Input, EventEmitter, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserInfosModule } from '../../models/user-infos/user-infos.module';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private userInfoOrigin!: UserInfosModule;
  userInfo = new UserInfosModule();
  initialized = false;
  selectedTab: string = 'account-general';
  newPassword = undefined;
  oldPassword = undefined;
  confirmPassword = undefined;
  
  

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private confirmDialogComponent: ConfirmDialogComponent,
              private authService: AuthService,
              ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.loadUserInfo();
      } else {
        this.clearUserInfo();
      }
    });
  }

 

  

  loadUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.userInfoOrigin = data;
        this.userInfo = data;
        this.initialized = true;
      },
      error: (error) => {
        console.error('Error fetching user info', error);
        this.clearUserInfo();
      }
    });
  }

  clearUserInfo(): void {
    this.userInfo = new UserInfosModule();
    this.initialized = false;
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  saveChanges() {
    switch (this.selectedTab) {
      case 'account-general': {
        if (this.userInfo.username.length < 5 || this.userInfo.username.length > 15) {
          this.notificationService.showWarning("Account", "Username must be between 5 and 15 chars");
          break;
        }
        if (this.userInfo.username) {
          this.userService.updateUsername(this.userInfo.username).subscribe({
            next: (response) => {
              this.notificationService.showSuccess("Account", response.body ?? undefined);
              this.userInfoOrigin.username = this.userInfo.username;
            },
            error: (error) =>  {
              this.userInfo.username=this.userInfoOrigin.username;
              this.notificationService.handleSaveError(error);
              
            }
          });
        } else {
          this.notificationService.showWarning("Account", "You must fill in the username field");
        }
        break;
      }

      case 'account-info': {
        this.userService.updateUserInfos(
          this.userInfo.firstName,
          this.userInfo.lastName,
          this.userInfo.birthday,
          this.userInfo.gender,
          this.userInfo.address,
          this.userInfo.phone,
          this.userInfo.city
        ).subscribe({
          next: (response) => {
            this.notificationService.showSuccess("Account", response.body ?? undefined);
            this.updateUserInfoOrigin();
          },
          error: (error) => {
            this.handleSaveError(error);
            this.updateUserInfo();
          }
        });
        break;
      }

      case 'account-change-password': {
        if (this.oldPassword && this.newPassword && this.confirmPassword) {
          if (this.newPassword === this.confirmPassword) {
            this.userService.updatePassword(this.oldPassword, this.newPassword).subscribe({
              next: (response) => {
                this.notificationService.showSuccess("Account", response.body ?? undefined);
              },
              error: (error) => this.handleSaveError(error)
            });
          } else {
            this.notificationService.showWarning("Account", "Passwords do not match");
          }
        } else {
          this.notificationService.showWarning("Account", "You must fill all inputs");
        }
        break;
      }
    }
  }

  deleteMyAccount() {
    this.confirmDialogComponent.openDialog({
      title: "Account",
      content: "Are you sure that you want to delete your account?"
    }).subscribe(result => {
      if (result) {
        this.userService.deleteMyAccount().subscribe({
          next: (response) => {
            this.notificationService.showSuccess("Account", response.body ?? undefined);
            this.authService.logOut();
          },
          error: (error) => this.handleSaveError(error)
        });
      } else {
        this.notificationService.showInfo("Account", "Thank you for not deleting your account");
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      
      if (file.size > 1024 * 1024) {
        this.notificationService.showWarning("Account", 'File size should not exceed 1 MB.');
        return;
      }

      if (!['image/jpeg', 'image/gif', 'image/png', 'image/jpg'].includes(file.type)) {
        this.notificationService.showWarning("Account", 'Only JPG, GIF, or PNG formats are allowed.');
        return;
      }

      this.userService.updatePictur(file).subscribe({
        next: (response) => {
          this.notificationService.showSuccess("Account", response.body ?? undefined);
          const reader = new FileReader();
          reader.onload = () => {
            this.userInfo.picture = reader.result?.toString().split(',')[1] || '';
          };
          reader.readAsDataURL(file);
        },
        error: (error) => this.handleSaveError(error)
      });
    }
  }

  private handleSaveError(error: any) {
    switch (error.status) {
      case 400:
      case 404:
        this.notificationService.showWarning("Account", error.error);
        break;
      case 0:
      case 503:
        this.notificationService.showError("Account", "Service Unavailable");
        break;
      case 500:
        this.notificationService.showError("Account", "An internal server error occurred. Please try again later.");
        break;
    }
  }

  private updateUserInfoOrigin() {
    this.userInfoOrigin = new UserInfosModule(
      this.userInfoOrigin.username,
      this.userInfoOrigin.email,
      this.userInfo.firstName,
      this.userInfo.lastName,
      this.userInfo.gender,
      this.userInfo.city,
      this.userInfo.address,
      this.userInfo.phone,
      this.userInfo.birthday,
      this.userInfoOrigin.picture
    );
  }

  private updateUserInfo() {
    this.userInfo = new UserInfosModule(
      this.userInfoOrigin.username,
      this.userInfoOrigin.email,
      this.userInfoOrigin.firstName,
      this.userInfoOrigin.lastName,
      this.userInfoOrigin.gender,
      this.userInfoOrigin.city,
      this.userInfoOrigin.address,
      this.userInfoOrigin.phone,
      this.userInfoOrigin.birthday,
      this.userInfoOrigin.picture
    );
  }
}
