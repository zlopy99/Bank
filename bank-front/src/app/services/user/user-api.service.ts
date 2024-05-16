import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '../../util-components/dto/dto-interfaces';
import { enviroment } from '../../enviroment';

@Injectable({
    providedIn: 'root'
})
export class UserApiService {

    constructor(private http: HttpClient) { }

    logIn(loginRequestDto: LoginRequestDto): Observable<any> {
        return this.http.post<any>(`${enviroment.authUrl}/login`, loginRequestDto, { observe: 'response' });
    }

    logOut(refreshToken: string): Observable<any> {
        return this.http.post<any>(`${enviroment.authUrl}/logout`, refreshToken);
    }

    refreshToken(): Observable<any> {
        return this.http.get<any>(`${enviroment.authUrl}/refreshToken`, { observe: 'response' });
    }
}
