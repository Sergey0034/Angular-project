import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserDataService} from "../../../shared/services/user-data.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {SharedService} from "../../../shared/services/shared.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  hide = true;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private userDataService: UserDataService,
              private sharedService: SharedService) {
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
       this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this.userDataService.getUserInfo()
              .subscribe({
                next: (data: DefaultResponseType | UserInfoType) => {
                  let error = null;
                  if ((data as DefaultResponseType).error !== undefined) {
                    error = (data as DefaultResponseType).message;
                  }

                  const UserInfoResponse = data as UserInfoType;
                  if (!UserInfoResponse.name && !UserInfoResponse.id && !UserInfoResponse.email) {
                    error = 'Ошибка авторизации';
                  }

                  if (error) {
                    this._snackBar.open(error);
                    throw new Error(error);
                  }

                  this.userDataService.setTokensUserInfo(UserInfoResponse.name);


                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка при получении информации о пользователе');
                  }
                }
              });
            this._snackBar.open('Вы успешно авторизовались');

            this.sharedService.routerFunc();

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        });
    }

  }
}
