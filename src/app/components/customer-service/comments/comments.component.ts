import {Component, OnInit} from '@angular/core';
import {CommentService} from "../../../services/comment.service";
import {ProductComment} from "../../../models/comment/comment.module";
import {NotificationService} from "../../../services/notification.service";
import {UserService} from "../../../services/user.service";


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit{

  productId: number | undefined;
  comments: ProductComment[] = [];
  isApproved: boolean = false;

  constructor(private commentService: CommentService,
              private notificationService : NotificationService,
              private userService : UserService) {}

  ngOnInit(): void {
    this.loadComments();
    console.log(this.comments);
  }

  loadComments(): void {
    if (!this.productId) return;

    this.commentService.getComments(this.productId,this.isApproved).subscribe((data) => {
      if(data.body) this.comments = data.body;
    });
  }

  approveComment(commentId: number): void {
    this.commentService.approveComment(commentId).subscribe({
      next:(response) => {
        const comment = this.comments.find(c => c.userRatingId === commentId);
        if (comment) {
          comment.isApproved = true;
          this.comments = this.comments.filter(c => c.userRatingId !== commentId);
        }
        this.notificationService.showSuccess(response.body ?? undefined);
      },error : (error) => this.notificationService.handleSaveError(error)
    });
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next:(response) => {
        this.comments = this.comments.filter(c => c.userRatingId !== commentId);
        this.notificationService.showSuccess(response.body ?? undefined);
      },error : (error) => this.notificationService.handleSaveError(error)
    });
  }


  reportUser(userId: number) {
    this.userService.reportUser(userId).subscribe({
      next:(response) => {
        this.notificationService.showSuccess(response.body ?? undefined);
      },error : (error) => this.notificationService.handleSaveError(error)
    });
  }

  UnReportUser(userId: number) {
    this.userService.UnReportUser(userId).subscribe({
      next:(response) => {
        const comment = this.comments.find(c => c.userId === userId);
        if (comment) {
          comment.isReported = false;
        }
        this.notificationService.showSuccess(response.body ?? undefined);
      },error : (error) => this.notificationService.handleSaveError(error)
    });
  }
}
