import { Injectable, TemplateRef } from '@angular/core';

export interface ToastInterface {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class Toast {
	toasts: ToastInterface[] = [];

	show(toast: ToastInterface) {
		this.toasts.push(toast);
	}

	remove(toast: ToastInterface) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}