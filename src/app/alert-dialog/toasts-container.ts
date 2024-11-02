import { Component, inject } from '@angular/core';

import { Toast } from './toast';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-toasts',
	standalone: true,
	imports: [NgbToastModule, NgTemplateOutlet,CommonModule],
	template:  `
	<ngb-toast
		*ngFor="let t of toast.toasts; trackBy: trackByFn"
		[class]="t.classname"
		[autohide]="true"
		[delay]="t.delay || 5000"
		(hidden)="toast.remove(t)"
	>
		<ng-template [ngTemplateOutlet]="t.template"></ng-template>
	</ngb-toast>
	`,
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainer {
	toast = inject(Toast);
	trackByFn(index: number, toast: any) {
		return index;
	}
}