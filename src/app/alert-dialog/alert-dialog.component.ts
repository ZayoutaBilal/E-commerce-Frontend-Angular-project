// import { Component, TemplateRef, ViewChild, Injectable, afterRender, AfterContentInit } from '@angular/core';
// import { Toast } from './toast';
// import { TemplateService } from '../template.service';
// @Component({
//   selector: 'app-alert-dialog',
//   templateUrl: './alert-dialog.component.html',
//   styleUrls: ['./alert-dialog.component.css'],
  
// })
// export class AlertDialogComponent {
//   constructor(private templateService: TemplateService) {}
  

//   @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
//   @ViewChild('standardTpl', { static: true }) standardTpl!: TemplateRef<any>;
//   @ViewChild('warningTpl', { static: true }) warningTpl!: TemplateRef<any>;
//   @ViewChild('dangerTpl', { static: true }) dangerTpl!: TemplateRef<any>;

  

//   getSuccessTemplate(): TemplateRef<any> {
//     return this.successTpl;
//   }

//   getStandardTemplate(): TemplateRef<any> {
//     return this.standardTpl;
//   }

//   getWarningTemplate(): TemplateRef<any> {
//     return this.warningTpl;
//   }

//   getDangerTemplate(): TemplateRef<any> {
//     return this.dangerTpl;
//   }

//   showSuccessAlert(): void {
//     console.log("template success");
//     console.log(this.successTpl);
//     this.toast.show({ 
//       template: this.successTpl, 
//       classname: 'bg-success text-light', 
//       delay: 10000 
//     });
//   }

//   showStandardAlert(): void {
//     this.toast.show({ 
//       template: this.standardTpl 
//     });
//   }

//   showWarningAlert(): void {
//     this.toast.show({ 
//       template: this.warningTpl, 
//       classname: 'bg-warning text-dark', 
//       delay: 10000 
//     });
//   }

//   showDangerAlert(): void {
//     this.toast.show({ 
//       template: this.dangerTpl, 
//       classname: 'bg-danger text-light', 
//       delay: 10000 
//     });
//   }
// }
