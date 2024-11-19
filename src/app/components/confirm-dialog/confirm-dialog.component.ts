
import {ChangeDetectionStrategy, Component, inject ,Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule,MAT_DIALOG_DATA,MatDialog,MatDialogRef,MatDialogContent,MatDialogTitle,MatDialogClose,MatDialogActions} from '@angular/material/dialog';
import { Observable } from 'rxjs';
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

  openDialog(data: DialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogAnimations, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '100ms',
      data,
    });
    return dialogRef.afterClosed();
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
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogAnimations>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}