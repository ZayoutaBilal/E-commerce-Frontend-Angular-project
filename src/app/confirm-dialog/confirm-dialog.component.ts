
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule,MAT_DIALOG_DATA,MatDialog,MatDialogRef,MatDialogContent,MatDialogTitle,MatDialogClose,MatDialogActions} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-confirm-dialog-content',
  template: '',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly dialog = inject(MatDialog);

  openDialog(data: DialogData): void {
    this.dialog.open(ConfirmDialogAnimations, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data,
    });
  }
  
  
  
}
@Component({
  selector: 'app-confirm-dialog-content',
  templateUrl: './confirm-dialog.component.html',
  styleUrls:['./confirm-dialog.component.css'],
  standalone: true,
  imports: [MatButtonModule,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogAnimations {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogAnimations>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
