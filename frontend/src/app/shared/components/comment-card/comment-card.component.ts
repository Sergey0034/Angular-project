import {Component, Input, OnInit} from '@angular/core';
import {CommentUserType} from "../../../../types/comment-user.type";
import {CommentService} from "../../services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentResponseApplyType} from "../../../../types/comment-response-apply.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  conditionLike = false;
  userId: string | null = null;

  action = {
    like: 'like',
    dislike: 'dislike',
    violate: 'violate'
  };

  commentInfo: CommentResponseApplyType | null = null;


  @Input() comment!: CommentUserType;

  constructor(private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {

  }

  ngOnInit() {
    this.userId = this.authService.userId;
  }

  applyAction(id: string, action: string) {
    this.commentService.applyAction(id, action)
      .subscribe({
        next: data => {
          if (data.error && data.message) {
            this._snackBar.open(data.message);
          }

          if (this.comment.action === this.action.like && action === this.action.like) {
            this.comment.likesCount--;
            this.comment.action = '';
          } else if (this.comment.action !== this.action.like && this.comment.action !== this.action.dislike && action === this.action.like) {
            this.comment.likesCount++;
            this.comment.action = action;
          } else if (this.comment.action === this.action.dislike && action === this.action.like) {
            this.comment.dislikesCount--;
            this.comment.action = action;
            this.comment.likesCount++;
          }

          if (this.comment.action === this.action.dislike && action === this.action.dislike) {
            this.comment.dislikesCount--;
            this.comment.action = '';
          } else if (this.comment.action !== this.action.dislike && this.comment.action !== this.action.like && action === this.action.dislike) {
            this.comment.dislikesCount++;
            this.comment.action = action;
          } else if (this.comment.action === this.action.like && action === this.action.dislike) {
            this.comment.likesCount--;
            this.comment.action = action;
            this.comment.dislikesCount++;
          }

          if (action === this.action.like || action === this.action.dislike) {
            this._snackBar.open('Ваш голос учтен');
          }

          if (action === this.action.violate) {
            this._snackBar.open('Жалоба отправлена');
          }

        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open('Жалоба уже отправлена');
          } else {
            this._snackBar.open('Произошла ошибка');
          }
        }
      });
  }

}
