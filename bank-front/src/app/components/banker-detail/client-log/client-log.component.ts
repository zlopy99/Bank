import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ClientLogDto } from '../../../util-components/dto/dto-interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UserApiService } from '../../../services/user/user-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-client-log',
  templateUrl: './client-log.component.html',
  styleUrl: './client-log.component.css'
})
export class ClientLogComponent implements OnInit {
  @Input() userEmail!: string;
  userColumns: string[] = ['userEmail', 'logDate', 'clientId', 'clientName', 'lastName', 'action'];
  USER_DATA: ClientLogDto[] = [];
  dataSource: MatTableDataSource<ClientLogDto> = new MatTableDataSource(this.USER_DATA);
  private paginator!: MatPaginator;
  private sort!: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setPaginatorAndSort();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setPaginatorAndSort();
  }

  constructor(private _userApiService: UserApiService) {

  }

  async ngOnInit() {
    const clientLog = await firstValueFrom(this._userApiService.getLogDataClient(this.userEmail))
      .catch(error => console.error(error));

    this.USER_DATA = clientLog ?? [];
    this.dataSource = new MatTableDataSource(this.USER_DATA);
    this.setPaginatorAndSort();
  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
