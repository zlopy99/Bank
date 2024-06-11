import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountLogDto, ClientLogDto, LoginRequestDto, UserDto } from '../../util-components/dto/dto-interfaces';
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

    createUser(newUserDto: UserDto): Observable<UserDto> {
        return this.http.post<UserDto>(`${enviroment.userUrl}`, newUserDto);
    }

    getAllUsers(inputValue: string | null): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${enviroment.userUrl}/allUsers/${inputValue || 'null'}`);
    }

    getUser(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(`${enviroment.userUrl}/user/${userId}`);
    }

    editUser(newUserDto: any): Observable<UserDto> {
        return this.http.put<UserDto>(`${enviroment.userUrl}`, newUserDto);
    }

    getLogDataClient(userEmail: string): Observable<ClientLogDto[]> {
        return this.http.get<ClientLogDto[]>(`${enviroment.userUrl}/user/logData/client/${userEmail}`);
    }

    getLogDataAccount(userEmail: string): Observable<AccountLogDto[]> {
        return this.http.get<AccountLogDto[]>(`${enviroment.userUrl}/user/logData/account/${userEmail}`);
    }
}
