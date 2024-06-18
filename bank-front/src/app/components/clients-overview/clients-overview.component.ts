import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ClientDto } from '../../util-components/dto/dto-interfaces';
import { ClientService } from '../../services/client/client.service';
import { ClientServiceApi } from '../../services/client/client-api.service';
import { Subject, filter, takeUntil } from 'rxjs';
import { isValueDefined } from '../../util-components/util-methods/util-methods';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients-overview',
  templateUrl: './clients-overview.component.html',
  styleUrl: './clients-overview.component.css',
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
export class ClientsOverviewComponent implements OnDestroy {
  CLIENT_DATA: ClientDto[] = [];
  displayedColumnsClient: string[] = [
    'id', 'name', 'lastName', 'jmbg', 'personalDocId', 'dateOfBirth',
    'sex', 'openingDate', 'closingDate',
  ];
  dataSourceClient: MatTableDataSource<ClientDto> = new MatTableDataSource(this.CLIENT_DATA);
  inputValue = '';
  private unsubscribe$ = new Subject<void>();
  showTable = false;
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
  loader = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _clientServiceApi: ClientServiceApi,
    private toastr: ToastrService
  ) { 
    this.activatedRoute.queryParamMap.pipe(
      filter(params => params.has('inputValue') || params.has('clientId'))
    ).subscribe(params => {
      this.inputValue = params.get('inputValue') ?? '';
      if (!isValueDefined(this.inputValue))
        this.inputValue = params.get('clientId') ?? '';
      if (isValueDefined(this.inputValue)) {
        this.getClients();
      } 
    }
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setPaginatorAndSort() {
    this.dataSourceClient.paginator = this.paginator;
    this.dataSourceClient.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClient.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceClient.paginator) {
      this.dataSourceClient.paginator.firstPage();
    }
  }

  getClients() {
    this.loader = true;
    if (this.inputValue.length >= 3) {
      this._clientServiceApi.getClients(this.inputValue)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (resp) => {
            this.showTable = true;
            this.CLIENT_DATA = resp;
            this.dataSourceClient = new MatTableDataSource(this.CLIENT_DATA);
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
