import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {SharedService} from "../../../shared/services/shared.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  open = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];
  blogEmpty = false;
  path: string = 'blog';

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private sharedService: SharedService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {


    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;

        this.activatedRoute.queryParams.subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);


          this.appliedFilters = [];
          this.activeParams.categories.forEach(url => {

            const foundCategory = this.categories.find(category => category.url === url);
            if (foundCategory) {
              this.appliedFilters.push({
                name: foundCategory.name,
                urlParam: foundCategory.url
              });
            }
          });
          this.articleService.getArticles(this.activeParams)
            .subscribe(data => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
              this.articles = data.items;

              this.blogEmpty = this.articles.length === 0;
            });
        });
      });
  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string): void {

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === url);
      if (existingCategoryInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategoryInParams) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;

    this.sharedService.routerFunc(this.path, null, this.activeParams);

  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);

    this.activeParams.page = 1;

    this.sharedService.routerFunc(this.path, null, this.activeParams);

  }

  openPage(page: number) {
    this.activeParams.page = page;

    this.sharedService.routerFunc(this.path, null, this.activeParams);

  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;

      this.sharedService.routerFunc(this.path, null, this.activeParams);

    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;

      this.sharedService.routerFunc(this.path, null, this.activeParams);

    }
  }
}
