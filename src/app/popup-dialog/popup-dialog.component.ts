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

export interface DialogData {
  value: string;
  title: string;
  placeholder: string;
  content: string;
}

@Component({
  selector: 'app-popup-dialog',
  template: '', // Main component's template
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupDialogComponent {
  
  readonly value = signal('');
  readonly name = signal('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupDialogComponentAnimations, {
      data: { name: this.name(), animal: this.value() },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.value.set(result);
      }
    });
  }
}

// Inner dialog component within the same file
@Component({
  selector: 'app-dialog-content-dialog',
  templateUrl: './popup-dialog.component.html', // Reference to external HTML template
  styleUrls:['./popup-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class PopupDialogComponentAnimations {
  readonly dialogRef = inject(MatDialogRef<PopupDialogComponentAnimations>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
