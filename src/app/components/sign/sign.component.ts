import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';
import {ActivatedRoute} from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDetailsModule } from '../../models/user-details/user-details.module';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpResponse } from '@angular/common/http';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  isSignUp: boolean = false;
  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.isSignUp = (params.get('option') ?? 'in') === 'up';
    });
  }

  private emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/

  loginForm : FormGroup ;
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
    private notificationService : NotificationService,
    private activatedRoute : ActivatedRoute,
    private authService: AuthService, private formBuilder : FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password:['', Validators.required]
    });
  }

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
        this.userService.passwordHasBeenForgotten(email).subscribe({
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
                        this.notificationService.showSuccess(response.body ?? undefined);

                      },error:(error) => {
                        this.notificationService.showError(error.error ?? undefined);
                      }
                    })
                  }
                });
          },
          error:(error) => {
            this.notificationService.handleSaveError(error);
          }
        })
      }else{
        //console.log('email not valid', email);
      }
    }
    });
  }




  logIn() {
    if(this.loginForm.invalid){
      this.notificationService.showWarning('Both login and password are required');
      return
    }

    this.userService.login(this.loginForm.value).subscribe({
      next: (response : HttpResponse<UserDetailsModule>) => {
        if(response.body){
          this.authService.logIn(response.body.token,response.body.authorities);
        }
      },
      error: (error) => {
        this.notificationService.handleSaveError(error);
       }
    });
  }

  register () {
    if (!this.emailRegister || !this.emailRegister.match(this.emailRegex)) {
        this.notificationService.showWarning("Email is not valid");
        return ;
    }

    if (this.passwordRegister != this.passwordConfirmRegister) {
      this.notificationService.showWarning("Passwords do not match");
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
                title: 'Confirm email',
                content: 'Enter your verification code?',
                fields: [
                  { label: 'Code', value: '', placeholder: 'Enter code' },
                ],
              },

            });

            dialogRef.afterClosed().subscribe(result => {
              this.userService.confirmEmail(this.emailRegister,result[0].value).subscribe({
                next:(response) => {
                  this.notificationService.showSuccess(response.body ?? undefined);
                  this.userService.login({login:this.usernameRegister, password:this.passwordRegister}).subscribe({
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


  loginWithGoogle(){}
  loginWithLinkedIn(){}
  loginWithFacebook() {}




}
