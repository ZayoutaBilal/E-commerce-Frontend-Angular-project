// about.component.ts
import { Component, TemplateRef,ViewChild, AfterViewInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../toast.service';
import { ConfirmDialogAnimations } from '../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
  
})
export class AboutComponent{
  // @ViewChild('standardTpl', { static: true }) standardTpl!: TemplateRef<any>;
  // @ViewChild('dangerTpl', { static: true }) dangerTpl!: TemplateRef<any>;
  // @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
  // @ViewChild('warningTpl', { static: true }) warningTpl!: TemplateRef<any>;

  // @ViewChild(AlertDialogComponent) alertDialog!: AlertDialogComponent;
  constructor(private dialog: MatDialog,
      private alertDialogComponent: AlertDialogComponent,
      private toastService : ToastService 
     ) {}
  

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogAnimations, {
      data: {
        title: 'Confirmation',
        content: 'Are you sure you want to proceed?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User clicked Yes');
      } else {
        console.log('User clicked No (or closed the dialog)');
      }
    });
  }

  openAlertWarning(): void {
    // this.toastService.show({
    //   template: this.warningTpl,
    //   classname: 'bg-warning text-dark', // Optional: style the toast
    //   delay: 5000, // Optional: set the delay in milliseconds
    // });

    this.toastService.showWarningAlert(this.alertDialogComponent.getWarningTemplate());

  }

  openAlertSuccess(): void {
    // this.toastService.show({
    //   template: this.successTpl,
    //   classname: 'bg-success text-white', // Optional: style the toast
    //   delay: 5000, // Optional: set the delay in milliseconds
    // });
    this.toastService.showSuccessAlert(this.alertDialogComponent.getSuccessTemplate());

  }

  openAlertError(): void {
    // this.toastService.show({
    //   template: this.dangerTpl,
    //   classname: 'bg-danger text-white', // Optional: style the toast
    //   delay: 5000, // Optional: set the delay in milliseconds
    // });
    this.toastService.showDangerAlert(this.alertDialogComponent.getDangerTemplate());

  }

  openAlertStandard(): void {
    // this.toastService.show({
    //   template: this.standardTpl,

    //   delay: 5000, // Optional: set the delay in milliseconds
    // });

    this.toastService.showStandardAlert(this.alertDialogComponent.getStandardTemplate());
  }
}
