import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountLogDto } from '../../../util-components/dto/dto-interfaces';
import { UserApiService } from '../../../services/user/user-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-account-log',
  templateUrl: './account-log.component.html',
  styleUrl: './account-log.component.css'
})
export class AccountLogComponent implements OnInit {
  @Input() userEmail!: string;
  userColumns: string[] = ['userEmail', 'logDate', 'clientId', 'accountId', 'accountName', 'accountType', 'action'];
  USER_DATA: AccountLogDto[] = [];
  dataSource: MatTableDataSource<AccountLogDto> = new MatTableDataSource(this.USER_DATA);
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
    const accountLog = await firstValueFrom(this._userApiService.getLogDataAccount(this.userEmail))
      .catch(error => console.error(error));

    this.USER_DATA = accountLog ?? [];
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
