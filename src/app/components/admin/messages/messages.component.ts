import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  target: any;
  currentPage: number = 1;
  pageSize: number = 10;
  messages: any[] = [];
  replyText: string = '';
  totalPages: number = 0;
  totalItems: number = 0;
  idsToDelete: number[] = [];
  idsToMarkAsRead: number[] = [];
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
    this.messageService.sendReply({name: this.target.name,
      email: this.target.email, message: this.replyText
    }, this.target.messageId).subscribe({
      next: (response) => {
        const msg = this.messages.find(message => message.messageId === this.target.messageId);
        if (msg) {
          msg.isRead = true;
        }
        this.notificationService.showSuccess(response.body);
      },
      error: (error) => {
        this.notificationService.showError(error.error.message);
      }
    });
  }

  markAsRead(id: number) {
    this.idsToMarkAsRead.push(id);
    this.messages = this.messages.filter(message => message.messageId !== id);
    this.notificationService.showSuccess("Message marked as read successfully");
  }

  openReplyModal(message: any) {
    this.target = message;
  }

  deleteMessage(id: number) {
    this.idsToDelete.push(id);
    this.messages = this.messages.filter(message => message.messageId !== id);
    this.notificationService.showSuccess("Message deleted successfully");
  }

  ngOnDestroy(): void {
    this.messageService.markAsReadAndDelete(this.idsToDelete, this.idsToMarkAsRead).subscribe({});
  }
  
}
