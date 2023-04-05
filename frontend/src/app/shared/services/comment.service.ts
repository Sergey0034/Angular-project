import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentResponseType} from "../../../types/comment-response.type";
import {CommentParamsApplyType} from "../../../types/comment-params-apply.type";
import {CommentResponseApplyType} from "../../../types/comment-response-apply.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(offset: number, id: string): Observable<DefaultResponseType | CommentResponseType> {
    return this.http.get<DefaultResponseType | CommentResponseType>
    (environment.api + 'comments?offset=' + offset + '&article=' + id);
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    });
  }

  getCommentsArticle(params: CommentParamsApplyType): Observable<DefaultResponseType | CommentResponseApplyType[]> {
    return this.http.get<DefaultResponseType | CommentResponseApplyType[]>(environment.api + 'comments/article-comment-actions', {
      params: params
    });
  }

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {
      action: action
    });
  }

  getAction(id: string): Observable<CommentResponseApplyType> {
    return this.http.get<CommentResponseApplyType>(environment.api + 'comments/' + id + '/actions');
  }
}
