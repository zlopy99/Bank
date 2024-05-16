import { Injectable } from '@angular/core';
import { UserApiService } from './user-api.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { isValueDefined } from '../../util-components/util-methods/util-methods';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private unsubscribe$ = new Subject<void>();
  public isUserLogedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.setValueForLogedInUser());

  constructor(
    private router: Router,
    private _userApiService: UserApiService
  ) { }

  private setValueForLogedInUser(): boolean {
    return isValueDefined(localStorage.getItem('access_token'))
  }

  logout() {
    const refreshToken = localStorage.getItem('refresh_token');

    this._userApiService.logOut(refreshToken ?? '')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.removeTokens();
          this.updateUserLogIn(false);
          this.router.navigate(['/login']);

        }, error: (err) => {
          console.error(err);
        }
      });
  }

  removeTokens() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('access_token', accessToken);
  }

  getUserRolesRoles() {
    let payload = null;
    const jwt = localStorage.getItem('access_token');

    if (isValueDefined(jwt) && jwt !== null) {
      payload = jwtDecode(jwt);
      const roles: any[] = (payload as any).authorities;

      return roles;
    }

    return null;
  }

  updateUserLogIn(value: boolean) {
    this.isUserLogedIn.next(value);
  }

  checkForUserRole(url: string, isUserLogedIn: boolean): boolean {
    switch (true) {
      case url.startsWith('/clients/detail'):
        return this.checkRoleForAccount() || this.checkRoleForClient();
      case url.startsWith('/clients'):
        return this.checkRoleForClient();
      case url.startsWith('/accounts'):
        return this.checkRoleForAccount();
      case url.startsWith('/bankers'):
        return this.checkRoleForBanker();
      default:
        return isUserLogedIn;
    }
  }

  checkRoleForClient() {
    const roles = this.getUserRolesRoles();

    return roles === null
      ? false
      : roles?.some((item) => item.authority === 'BANKER_CLIENT'
        || item.authority === 'ADMIN'
        || item.authority === 'BANKER_OBSERVE');
  }

  checkRoleForAccount() {
    const roles = this.getUserRolesRoles();

    return roles === null
      ? false
      : roles?.some((item) => item.authority === 'BANKER_ACCOUNT'
        || item.authority === 'ADMIN'
        || item.authority === 'BANKER_OBSERVE');
  }

  checkRoleForBanker() {
    const roles = this.getUserRolesRoles();

    return roles === null
      ? false
      : roles?.some((item) => item.authority === 'ADMIN');
  }

  checkIfUserHasRole(role: string) {
    const roles = this.getUserRolesRoles();

    return roles === null
      ? false
      : roles?.some((item) => item.authority === role
        || item.authority === 'ADMIN');
  }
}
