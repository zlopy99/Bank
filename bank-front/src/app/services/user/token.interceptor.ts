import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from "rxjs";
import { UserApiService } from "./user-api.service";
import { UserService } from "./user.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isTokenRefreshing = false;
    public refreshTokenBehaviorSubject = new BehaviorSubject<any>(null);

    constructor(
        private _userApiService: UserApiService,
        private _userService: UserService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = request.url.includes('auth/refreshToken') ? localStorage.getItem('refresh_token') : localStorage.getItem('access_token');

        if (accessToken) {
            request = this.addToken(request, accessToken);
        }

        return next.handle(request).pipe(catchError(error => {
            if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                !request.url.includes('auth/login')
            ) {
                return this.refreshToken(request, next);
            }

            this.router.navigate(['/login']);
            return throwError(() => error);
        }))
    }

    refreshToken(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenBehaviorSubject.next(null);

            return this._userApiService.refreshToken().pipe(
                switchMap((resp) => {
                    const accessToken = resp.headers.get('access_token');
                    const refreshToken = resp.headers.get('refresh_token');

                    this.isTokenRefreshing = false;
                    this.refreshTokenBehaviorSubject.next(accessToken);

                    this._userService.setTokens(accessToken, refreshToken);
                    return next.handle(this.addToken(request, accessToken))
                }),
                catchError(error => {
                    this.isTokenRefreshing = false;

                    if (error.status === 403) {
                        this._userService.removeTokens();
                        this.router.navigate(['/login']);
                    }
        
                    return throwError(() => error);
                })
            );

        } else {
            return this.refreshTokenBehaviorSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }

    addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}