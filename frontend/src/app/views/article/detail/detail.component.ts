import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment.development";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentParamsType} from "../../../../types/comment-params.type";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentUserType} from "../../../../types/comment-user.type";
import {CommentResponseType} from "../../../../types/comment-response.type";
import {FormBuilder} from "@angular/forms";
import {CommentResponseApplyType} from "../../../../types/comment-response-apply.type";
import {CommentParamsApplyType} from "../../../../types/comment-params-apply.type";
import {Subscription, tap} from "rxjs";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;
  urlApiShare = environment.api;
  loggedIn = false;
  commentParams: CommentParamsType = {
    article: ''
  };
  comments: CommentUserType[] = [];
  loadCommentsArticle: CommentUserType[] = [];
  getCommentsArticle: CommentParamsApplyType = {
    articleId: ''
  };
  getCommentsArticleArray: CommentResponseApplyType[] = [];
  loading = false;
  commentServiceGetCommentsSubscription: Subscription | null;
  allCount: number;
  currentOffset: number;


  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private authService: AuthService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private fb: FormBuilder) {
    this.commentServiceGetCommentsSubscription = null;
    this.allCount = 0;
    this.currentOffset = 0;
  }

  currentUrl: string | null = encodeURI(window.location.href);


  ngOnInit(): void {

    this.loggedIn = this.authService.getIsLoggedIn();

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.comments = data.comments;
          this.getCommentsArticle.articleId = data.id;
          if (this.article.commentsCount && this.article.commentsCount > 3) {
            this.currentOffset = 3;
          } else {
            this.currentOffset = 0;
          }

          if (this.loggedIn) {
            this.commentService.getCommentsArticle(this.getCommentsArticle)
              .subscribe({
                next: (data: DefaultResponseType | CommentResponseApplyType[]) => {
                  let error = null;
                  if ((data as DefaultResponseType).error !== undefined) {
                    error = (data as DefaultResponseType).message;
                  }

                  const commentsArticleResponse = data as CommentResponseApplyType[];
                  if (!commentsArticleResponse) {
                    error = 'Ошибка получения комментариев';
                  }

                  if (error) {
                    this._snackBar.open(error);
                    throw new Error(error);
                  }

                  this.getCommentsArticleArray = commentsArticleResponse;

                  this.applyActionCheck(this.comments, this.getCommentsArticleArray);

                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка при получении комментариев');
                  }
                }
              });
          }


        });

      this.articleService.getRelatedArticle(params['url'])
        .subscribe((data: ArticleType[]) => {
          this.relatedArticles = data;
        });
    });


  }

  commentForm = this.fb.group({
    text: [''],
    article: ['']
  });

  arrayCommentCheck = false;


  commentAdd(id: string, url: string) {

    if (!this.commentForm.value.text) {
      this._snackBar.open('Заполните поле "Комментарий"');
    }

    this.commentForm.patchValue({
      article: id
    });

    if (this.commentForm.value.text && this.commentForm.value.article) {

      this.commentService.addComment(this.commentForm.value.text, this.commentForm.value.article)
        .subscribe({
          next: data => {
            if (data.error && data.message) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }


            this._snackBar.open(data.message);

            this.articleService.getArticle(url)
              .subscribe((data: ArticleType) => {
                this.article = data;
                this.comments = data.comments;
                this.commentForm.patchValue({
                  text: '',
                  article: ''
                });
              });

            if (this.article.commentsCount! <=3) {
              this.currentOffset = this.article.commentsCount!;
            }

            if (this.article.commentsCount! > 3) {
              this.arrayCommentCheck = false;
              this.currentOffset = 3;
            }


          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки комментария');
            }
          }
        });
    }
  }

  loadComments(offset: number): void {
    if (this.article) {
      this.loading = true;
      this.commentServiceGetCommentsSubscription = this.commentService.getComments(offset, this.article.id)
        .subscribe({
          next: (data: DefaultResponseType | CommentResponseType) => {
            if ((data as DefaultResponseType).error) {
              this._snackBar.open('Не удалось загрузить комментарии, попробуйте позже');
              this.loading = false;
              throw new Error((data as DefaultResponseType).message);
            }
            const commentsData = data as CommentResponseType;
            this.allCount = commentsData.allCount;

            this.comments = this.comments.concat(commentsData.comments);
            if (this.comments.length > 3) {
              this.currentOffset = this.comments.length;
            }

            this.loading = false;
            if (this.comments.length === this.article.commentsCount ) {
              this.arrayCommentCheck = true;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.error) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              throw new Error(errorResponse.message);
            }
          }
        });
    }
  }

  applyActionCheck(comments: CommentUserType[], getCommentsArticleArray: CommentResponseApplyType[]) {

    comments.forEach(item => {
      const foundId = getCommentsArticleArray.find(itemId => itemId.comment === item.id);

      if (foundId) {
        item.action = foundId.action;
      }
    });

  }
}
