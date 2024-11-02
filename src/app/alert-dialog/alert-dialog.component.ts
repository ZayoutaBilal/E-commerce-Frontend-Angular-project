import { Component, TemplateRef, ViewChild ,Injectable} from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css'],
  standalone: true
})
export class AlertDialogComponent {
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
  @ViewChild('standardTpl', { static: true }) standardTpl!: TemplateRef<any>;
  @ViewChild('warningTpl', { static: true }) warningTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl', { static: true }) dangerTpl!: TemplateRef<any>;

  constructor() {}

  getSuccessTemplate(): TemplateRef<any> {
    return this.successTpl;
  }

  getStandardTemplate(): TemplateRef<any> {
    return this.standardTpl;
  }

  getWarningTemplate(): TemplateRef<any> {
    return this.warningTpl;
  }

  getDangerTemplate(): TemplateRef<any> {
    return this.dangerTpl;
  }
}
