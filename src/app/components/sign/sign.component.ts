import { Component, AfterViewInit, OnInit ,Inject,PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDetailsModule } from '../../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

  isSignUp: boolean = false; // Tracks whether to show sign-up or sign-in
  title: string = 'Welcome Back!';
  option : string = 'in';
  toggleView() {
    this.isSignUp = !this.isSignUp;
    this.option='up';
    this.title = this.isSignUp ? 'Create Your Account' : 'Welcome Back!';
  }
  private emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/

  loginLogin: string = '';
  passwordLogin: string = '';

  usernameRegister : string = '';
  passwordRegister : string = '';
  passwordConfirmRegister : string = '';
  emailRegister : string = '';
  cityRegister : string = '';
  phoneRegister : string = '';
  firstNameRegister : string = '';
  lastNameRegister : string = '';


  constructor(private dialog: MatDialog,
    private userService : UserService,
    private router : Router,
    private cookieService: CookieService,
    private notificationService : NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,


  ) { }

  forgetPassword(): void {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      data: {
        title: 'Forget password',
        content: 'What is your address email ?',
        fields: [
          { label: 'Email', value: '', placeholder: 'Enter email' },
        ],
      },

    });
    dialogRef.afterClosed().subscribe(result => {
      let email=result[0].value;
      if(email){
      if(email.match(this.emailRegex)){
        this.userService.forgetpassword(email).subscribe({
          next:(response) => {
            this.notificationService.showInfo("Forget password",response.body ?? undefined);
                const dialogRef = this.dialog.open(PopupDialogComponent, {
                  data: {
                    title: 'Forgot Password',
                    content: 'Enter your verification code and new password',
                    fields: [
                      { label: 'Verification Code', value: '', placeholder: 'Enter code' },
                      { label: 'New Password', value: '', placeholder: 'Enter new password' },
                    ],
                  },
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.userService.verifyCode(email,result[1].value,result[0].value)
                    .subscribe({
                      next:(response) => {
                        this.notificationService.showSuccess("Forget password",response.body ?? undefined);

                      },error:(error) => {
                        this.notificationService.showError("Forget password",error.error ?? undefined);
                      }
                    })
                  }
                });
          },
          error:(error) => {
            if(error.status === 404){
              this.notificationService.showError("Forget password",error.error ?? undefined);
            }
              console.log(error.error);
          }
        })
      }else{
        console.log('email not valide', email);
      }
    }
    });
  }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;

    if (signUpButton && signInButton && container) {
        signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

        signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    } else {
      console.error('Sign up, sign in, or container element not found.');
    }
    }
  }



  logIn() {
    this.userService.login(this.loginLogin, this.passwordLogin).subscribe({
      next: (response : HttpResponse<UserDetailsModule>) => {
        if(response.body){
          console.log("authorities",response.body.authorities);
          this.authService.logIn(response.body.token,response.body.authorities);
        }
      },
      error: (error) => {
        console.error(error);
        this.notificationService.handleSaveError(error);
       }
    });
  }

  register () {
    if (!this.emailRegister || !this.emailRegister.match(this.emailRegex)) {
        this.notificationService.showWarning("Sign up","Email is not valid");
        return ;
    }

    if (this.passwordRegister != this.passwordConfirmRegister) {
      this.notificationService.showWarning("Sign up","Passwords do not match");
      return ;
    }

    this.userService.register(
        this.usernameRegister, this.emailRegister, this.passwordRegister,
         this.firstNameRegister, this.lastNameRegister, this.phoneRegister, this.cityRegister)
         .subscribe({
          next: (response) => {
            this.notificationService.showSuccess("Login",response.body ?? undefined);
            const dialogRef = this.dialog.open(PopupDialogComponent, {
              data: {
                title: 'Confirme email',
                content: 'Enter your confiramtion code?',
                fields: [
                  { label: 'Code', value: '', placeholder: 'Enter code' },
                ],
              },

            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed', result[0].value);
              this.userService.confirmEmail(this.emailRegister,result[0].value).subscribe({
                next:(response) => {
                  this.notificationService.showSuccess("Sign up",response.body ?? undefined);
                  this.userService.login(this.usernameRegister, this.passwordRegister).subscribe({
                    next:(response) => {
                      if(response.body)
                        this.authService.logIn(response.body.token,response.body.authorities);
                    }
                  });
                },error:(error) => {
                  this.notificationService.handleSaveError(error);
                }
              });

            });

          },
          error: (error) => {
            this.notificationService.handleSaveError(error);
          }
        });
  }



}
