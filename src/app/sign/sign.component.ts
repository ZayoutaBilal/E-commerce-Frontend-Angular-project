import { Component, AfterViewInit ,inject} from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponentAnimations } from '../popup-dialog/popup-dialog.component'; // Adjust path as necessary

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

  constructor(private dialog: MatDialog) { }
  // Method to open the dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupDialogComponentAnimations, {
      data: {
        title: 'Forget password',
        placeholder: 'Email',
        content: 'What is your address email ?'
      },
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle result if needed
    });
  }
 
  // constructor(private dialog: MatDialog) {}

  // openDialog(): void {
  //   this.dialog.open(DialogContentComponent, {
  //     width: '300px',
  //     data: { message: 'Hello from the main component!' }  // Optional data to pass to the dialog
  //   });
  // }
  ngAfterViewInit(): void {
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;
    const forgetpassword = document.getElementById('forgetpassword') as HTMLElement;

    // Check if elements exist before adding event listeners
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
