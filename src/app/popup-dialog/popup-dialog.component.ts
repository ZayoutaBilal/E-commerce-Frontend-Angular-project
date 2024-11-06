import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../services/notification.service';
export interface DialogInputField {
  label: string;
  value: string;
  placeholder: string;
}

export interface DialogData {
  title: string;
  content: string;
  fields: DialogInputField[];
}


// @Component({
//   selector: 'app-popup-dialog',
//   template: '', // Main component's template
//   standalone: true,
//   imports: [MatFormFieldModule, MatInputModule, FormsModule, 
//     MatButtonModule, MatDialogModule,CommonModule,
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class PopupDialogComponent {
  
//   readonly value = signal('');
//   readonly name = signal('');
//   readonly dialog = inject(MatDialog);

//   openDialog(): void {
//     const dialogRef = this.dialog.open(PopupDialogComponentAnimations, {
//       data: { 
//         title: 'Forgot Password', 
//         content: 'Enter your verification code and new password', 
//         fields: [
//           { label: 'Verification Code', value: '', placeholder: 'Enter code' },
//           { label: 'New Password', value: '', placeholder: 'Enter new password' },
//         ],
//       },
//     });
  
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         console.log('Dialog result:', result);  // result will contain updated field values
//       }
//     });
//   }
  
// }

// Inner dialog component within the same file
@Component({
  //selector: 'app-dialog-content-dialog',
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html', // Reference to external HTML template
  styleUrls:['./popup-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    
    
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupDialogComponent {
  constructor(){

  }
  readonly dialogRef = inject(MatDialogRef<PopupDialogComponent>);
  readonly notificationService = inject(NotificationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
