// parent.component.ts
import { Component, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { TemplateService } from '../template.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
  @ViewChild('standardTpl', { static: true }) standardTpl!: TemplateRef<any>;
  @ViewChild('warningTpl', { static: true }) warningTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl', { static: true }) dangerTpl!: TemplateRef<any>;

  constructor(private templateService: TemplateService) {}

  ngAfterViewInit() {
    console.log('Templates:', {
      successTpl: this.successTpl,
      standardTpl: this.standardTpl,
      warningTpl: this.warningTpl,
      dangerTpl: this.dangerTpl
    });
    // Pass templates to the service
    this.templateService.setTemplates(
      this.successTpl,
      this.standardTpl,
      this.warningTpl,
      this.dangerTpl
    );
  }

  
}
