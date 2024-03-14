import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../enviroment';
import { AccountTypeDto, CityDto, ClientAccountDto, ClientDto, ClientsAccountsCountDto, ClientsInLastWeekDto, CountryDto, ResponseDto, SaveClientDataDto } from '../../util-components/dto/dto-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceApi {

  constructor(private http: HttpClient) { }

  getFirstFiveClientsAndAccounts(): Observable<ClientAccountDto> {
    return this.http.get<ClientAccountDto>(`${enviroment.clientUrl}/firstFive`);
  }

  getClients(value: string): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${enviroment.clientUrl}/${value}`);
  }

  getCountriesFromRedis(value: string): Observable<CountryDto[]> {
    return this.http.get<CountryDto[]>(`${enviroment.clientUrl}/countries/${value}`);
  }

  getCitiesFromRedis(value: string): Observable<CityDto[]> {
    return this.http.get<CityDto[]>(`${enviroment.clientUrl}/cities/${value}`);
  }

  saveClient(value: any): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${enviroment.clientUrl}`, value);
  }

  getClientDetail(value: number): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(`${enviroment.clientUrl}/details/${value}`);
  }

  editClient(value: SaveClientDataDto, clientId: number): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`${enviroment.clientUrl}/edit/${clientId}`, value);
  }

  deleteClient(clientId: number): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(`${enviroment.clientUrl}/delete/${clientId}`);
  }

  reopenClient(clientReopen: any): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`${enviroment.clientUrl}/reopen`, clientReopen);
  }

  getAllClientsOpenedAndClosedLastWeek(): Observable<ClientsInLastWeekDto[]> {
    return this.http.get<ClientsInLastWeekDto[]>(`${enviroment.clientUrl}/lastWeekClients`);
  }

  getAllOpenedAndClosedClientsYearly(): Observable<ClientsAccountsCountDto[]> {
    return this.http.get<ClientsAccountsCountDto[]>(`${enviroment.clientUrl}/yearlyClients`);
  }
}
