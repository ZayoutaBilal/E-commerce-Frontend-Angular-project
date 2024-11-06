import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  successTpl?: TemplateRef<any>;
  standardTpl?: TemplateRef<any>;
  warningTpl?: TemplateRef<any>;
  dangerTpl?: TemplateRef<any>;

  setTemplates(
    successTpl: TemplateRef<any>,
    standardTpl: TemplateRef<any>,
    warningTpl: TemplateRef<any>,
    dangerTpl: TemplateRef<any>
  ) {
    this.successTpl = successTpl;
    this.standardTpl = standardTpl;
    this.warningTpl = warningTpl;
    this.dangerTpl = dangerTpl;
  }
}
