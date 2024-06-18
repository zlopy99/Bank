import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountApiService } from '../../services/account/account-api.service';
import { Subject, filter, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { isValueDefined } from '../../util-components/util-methods/util-methods';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-accounts-overview',
  templateUrl: './accounts-overview.component.html',
  styleUrl: './accounts-overview.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AccountsOverviewComponent {
  inputValue = '';
  private unsubscribe$ = new Subject<void>();
  showTable = false;
  private paginator!: MatPaginator;
  private sort!: MatSort;
  ACCOUNT_DATA: any[] = [];
  displayedColumns: string[] = ['id', 'status', 'name', 'accountTypeName', 'accountDetailCurrencyName', 'accountDetailCurrencyAmount',
    'clientId', 'clientName', 'openingDate', 'closingDate'];
  dataSourceAccount: MatTableDataSource<any> = new MatTableDataSource(this.ACCOUNT_DATA);
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setPaginatorAndSort();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setPaginatorAndSort();
  }
  loader = false;

  constructor(
    private _accountApiService: AccountApiService, 
    private activatedRoute: ActivatedRoute, 
    private toastr: ToastrService
  ) {
    this.activatedRoute.queryParamMap.pipe(
      filter(params => params.has('clientId') || params.has('accountId'))
    ).subscribe(params => {
      this.inputValue = params.get('clientId') ?? '';
      if (!isValueDefined(this.inputValue))
        this.inputValue = params.get('accountId') ?? '';
      if (isValueDefined(this.inputValue)) {
        this.getAccounts();
      }
    }
    );
  }

  setPaginatorAndSort() {
    this.dataSourceAccount.paginator = this.paginator;
    this.dataSourceAccount.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAccount.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAccount.paginator) {
      this.dataSourceAccount.paginator.firstPage();
    }
  }

  getAccounts() {
    this.loader = true;
    if (this.inputValue.length >= 3) {
      this._accountApiService.getAccounts(this.inputValue)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (resp) => {
            this.showTable = true;
            this.ACCOUNT_DATA = resp;
            this.dataSourceAccount = new MatTableDataSource(this.ACCOUNT_DATA);
            this.setPaginatorAndSort();
            this.loader = false;
            
          }, error: (err) => {
            this.toastr.error(err?.error?.message, 'Error');
            this.showTable = false;
            this.loader = false;
          }
        });

    } else {
      this.toastr.info('Minimum 3 characters need to be entered.', 'Info');
      this.showTable = false;
      this.loader = false;
    }
  }
}
