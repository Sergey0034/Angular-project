import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserDataService} from "../../services/user-data.service";
import {Subscription} from "rxjs";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MainComponent} from "../../../views/main/main.component";
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged = false;

  userInfo: string | null = 'друг';

  getUserInfoSubscription: Subscription | null;

  servicesElement: HTMLElement | null = null;
  aboutElement: HTMLElement | null = null;
  reviewsElement: HTMLElement | null = null;
  contactsElement: HTMLElement | null = null;
  linkToScroll = {
    services: 'services',
    about: 'about',
    reviews: 'reviews',
    contacts: 'contacts'
  };

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private sharedService: SharedService,
              private userDataService: UserDataService) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.getUserInfoSubscription = null;
  }

 linkScrollToElement(target: HTMLElement | null, anchor: string):void {

    this.sharedService.routerFunc();

   const element = document.getElementById(anchor);
   if (element) {
     MainComponent.scrollToElement(element);
   } else {
     MainComponent.anchor = anchor;
   }
  }

  ngOnInit() {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getUserInfo();
    });

    this.getUserInfo();

  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.userDataService.removeTokensUser();
    localStorage.clear();
    this._snackBar.open('Вы вышли из системы');

    this.sharedService.routerFunc();

  }

  getUserInfo(): void {
    if (this.isLogged) {
      this.getUserInfoSubscription = this.userDataService.getUserInfo()
        .subscribe({
          next: (data: DefaultResponseType | UserInfoType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error('Не удалось получить имя пользователя');
            }
            this.userInfo = (data as UserInfoType).name;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при получении имени пользователя');
            }
          }
        });
    }
  }

}
