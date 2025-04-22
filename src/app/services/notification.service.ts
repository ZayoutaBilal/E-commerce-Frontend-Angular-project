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


  public handleSaveError(error: any) {
    switch (error.status) {
      case 404:
      case 401:
      case 404:
      case 403:
        this.showWarning(error.error);
        break;
      case 0:
      case 503:
        this.showError("Service Unavailable");
        break;
      case 500:
        this.showError("An internal server error occurred. Please try again later.");
        break;
    }
  }

  constructor(private toastr: ToastrService) { }
}
