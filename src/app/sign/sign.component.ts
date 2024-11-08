import { Component, AfterViewInit, OnInit ,Inject,PLATFORM_ID} from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component'; // Adjust path as necessary
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { response } from 'express';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

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
    private authService: AuthService
    
  ) { }
  
  openDialog(): void {
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

                      },error(error){
                        //this.notificationService.showError("Forget password",error.error ?? undefined);
                      }
                    })
                  }
                });
          },
          error(error){
            if(error.status === 404){
              //this.notificationService.showError("Forget password",error.error ?? undefined);
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
        const userDetails = response.body;
        if(userDetails){
          console.log("Valid login :",userDetails);
          console.log("Token :",userDetails.token);
          this.authService.logIn(userDetails.token);
          this.notificationService.showSuccess("Login","Login was successfully");
        }
      },
      error: (error) => {
        console.error(error);
        switch(error.status){
          case 400 :
          case 404 : {
            this.notificationService.showWarning("Login",error.error);
            break;
          }
          case 0 :
          case 503 : {
            this.notificationService.showError("Login","Service Unavailable");
            break;
          }
          case 500 : {
            this.notificationService.showError("Login","An internal server error occurred. Please try again later.");
            break;
          }
        }
       }
    });
  }

  register () {
    if (!this.emailRegister || !this.emailRegister.match(this.emailRegex)) {
        this.notificationService.showWarning("Sign up","Email is not valid");
    }

    if (this.passwordRegister != this.passwordConfirmRegister) {
      this.notificationService.showWarning("Sign up","Passwords do not match");
    }

    this.userService.register(
        this.usernameRegister, this.emailRegister, this.passwordRegister,
         this.firstNameRegister, this.lastNameRegister, this.phoneRegister, this.cityRegister)
         .subscribe({
          next: (response) => {
            console.log("response :",response);
            const statusCode = response.status;
            if (statusCode === 200){
            console.log("response ok:",true);
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
              
            });
          }
          },
          error: (error: ErrorEvent) => {
            console.error(error);
            console.log("Message Error :",error);
          }
        });
  }
  


}
