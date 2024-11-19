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
import { NotificationService } from '../../services/notification.service';
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

@Component({

  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
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
