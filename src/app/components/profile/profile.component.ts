import {Component, OnInit, OnChanges, Input, EventEmitter, OnDestroy, SimpleChanges} from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserInfosModule } from '../../models/user-infos/user-infos.module';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

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
      loggedIn ? this.loadUserInfo() : this.clearUserInfo();
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
        this.notificationService.handleSaveError(error);
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
          this.notificationService.showWarning("Username must be between 5 and 15 chars");
          break;
        }
        if (this.userInfo.username) {
          this.userService.updateUsername(this.userInfo.username).subscribe({
            next: (response) => {
              this.notificationService.showSuccess(response.body ?? undefined);
              this.userInfoOrigin.username = this.userInfo.username;
            },
            error: (error) =>  {
              this.userInfo.username=this.userInfoOrigin.username;
              this.notificationService.handleSaveError(error);

            }
          });
        } else {
          this.notificationService.showWarning("You must fill in the username field");
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
            this.notificationService.showSuccess(response.body ?? undefined);
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
                this.notificationService.showSuccess(response.body ?? undefined);
              },
              error: (error) => this.handleSaveError(error)
            });
          } else {
            this.notificationService.showWarning("Passwords do not match");
          }
        } else {
          this.notificationService.showWarning("You must fill all inputs");
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
            this.notificationService.showSuccess(response.body ?? undefined);
            this.authService.logOut();
          },
          error: (error) => this.handleSaveError(error)
        });
      } else {
        this.notificationService.showInfo("Thank you for not deleting your account");
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      if (!['image/jpeg', 'image/gif', 'image/png', 'image/jpg'].includes(file.type)) {
        this.notificationService.showWarning('Only JPG, GIF, JPEG, or PNG formats are allowed.');
        return;
      }
      if (file.size > 1024 * 1024) {
        this.notificationService.showWarning('File size should not exceed 1 MB.');
        return;
      }

      this.userService.updatePicture(file).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.body ?? undefined);
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
    this.notificationService.handleSaveError(error);
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
