import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private nameUserKey = 'name';
  private idUserKey = 'userId';
  public nameUser: string | null = null;

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users');
  }

  public setTokensUserInfo(name: string): void {
    localStorage.setItem(this.nameUserKey, name);
  }

  public removeTokensUser(): void {
    localStorage.removeItem(this.nameUserKey);
  }

  public getTokensUserName(): string | null {
    return localStorage.getItem(this.nameUserKey);
  }
}
