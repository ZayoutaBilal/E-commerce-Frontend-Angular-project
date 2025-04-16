import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  target: any;
  currentPage: number = 1;
  pageSize: number = 10;
  messages: any[] = [];
  replyText: string = '';
  totalPages: number = 0;
  totalItems: number = 0;

  constructor(private messageService: MessageService,
    private notificationService: NotificationService
  ) {
  }
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.currentPage-1, this.pageSize).subscribe({
      next: (response) => {
        this.messages = response.body?.content || [];
        this.totalPages = response.body?.totalPages || 0;
        this.totalItems = response.body?.totalElements || 0;
      },
      error: (error) => {
        this.notificationService.showError(error.error.message);
      }
    });
  }

  sendReply() {
    this.messageService.sendReply({
      name: this.target.name,
      email: this.target.email,
      message: this.replyText
    }).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body);
      },
      error: (error) => {
        this.notificationService.showError(error.error.message);
      }
    });
  }

  markAsRead(id: number) {
    this.messageService.markAsRead(id).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body);
      },
      error: (error) => {
        this.notificationService.showError(error.error.message);
      }
    });
  }
  openReplyModal(message: any) {
    this.target = message;
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(response.body);
      },
      error: (error) => {
        this.notificationService.showError(error.error.message);
      }
    });
  }
  
}
