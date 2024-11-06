import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  showSuccess(title?:string, message:string = "") {
    this.toastr.success(message,title);
  }

  showInfo(title?:string, message:string = "") {
    this.toastr.info(message,title);
  }

  showWarning(title?:string, message:string = "") {
    this.toastr.warning(message,title);
  }

  showError(title?:string, message:string = "") {
    this.toastr.error(message,title);
  }

  show(title?:string, message:string = "") {
    this.toastr.show(message,title);
  }
  
  constructor(private toastr: ToastrService) { }
}