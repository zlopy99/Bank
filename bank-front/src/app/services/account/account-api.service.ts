import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroment';
import { AccountClientTypeDetailDto, AccountDto, AccountTypeDto, OpenAccountDto, ResponseDto } from '../../util-components/dto/dto-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  getAccounts(value: string): Observable<AccountClientTypeDetailDto[]> {
    return this.http.get<AccountClientTypeDetailDto[]>(`${enviroment.accountUrl}/${value}`);
  }

  openNewAccount(value: OpenAccountDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${enviroment.accountUrl}`, value);
  }

  closeAccount(value: number): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(`${enviroment.accountUrl}/close/${value}`);
  }
  
  reOpenAccount(value: number): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(`${enviroment.accountUrl}/reOpen/${value}`);
  }

  getAllAccountsOpenedLastMonth(): Observable<AccountTypeDto[]> {
    return this.http.get<AccountTypeDto[]>(`${enviroment.accountUrl}/lastMonthAccounts`);
  }
}
