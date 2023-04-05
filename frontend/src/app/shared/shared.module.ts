import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommentCardComponent} from './components/comment-card/comment-card.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    CommentCardComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  exports: [ArticleCardComponent, CommentCardComponent]
})
export class SharedModule {
}
