import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserDataService} from "../../../shared/services/user-data.service";
import {SharedService} from "../../../shared/services/shared.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.pattern(/^([А-Я][а-я]+\s*)+$/), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.pattern(/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), Validators.required]],
    agree: [false, Validators.requiredTrue]
  });

  hide = true;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private sharedService: SharedService,
              private userDataService: UserDataService) {
  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка регистрации';
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

            this._snackBar.open('Вы успешно зарегистрировались');

            this.sharedService.routerFunc();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        });
    }
  }
}
