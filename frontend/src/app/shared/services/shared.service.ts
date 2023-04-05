import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private router: Router) {
  }

  routerFunc(path: string | null = null, id: string | null = null , params: ActiveParamsType | null = null): void {
    if (id) {
      this.router.navigate(['/' + path]);
    } else if (params) {
      this.router.navigate(['/' + path], {
        queryParams: params
      });
    } else if (!id && !params && !path) {
      this.router.navigate(['/']);
    }

  }
}
