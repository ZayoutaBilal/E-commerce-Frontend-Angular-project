import { Injectable, TemplateRef } from '@angular/core';
import { Toast } from './alert-dialog/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toast: Toast) {}

  showSuccessAlert(template: TemplateRef<any>): void {
    this.toast.show({ template, classname: 'bg-success text-light', delay: 10000 });
  }

  showStandardAlert(template: TemplateRef<any>): void {
    this.toast.show({ template });
  }

  showWarningAlert(template: TemplateRef<any>): void {
    this.toast.show({ template, classname: 'bg-warning text-dark', delay: 10000 });
  }

  showDangerAlert(template: TemplateRef<any>): void {
    this.toast.show({ template, classname: 'bg-danger text-light', delay: 10000 });
  }
}
