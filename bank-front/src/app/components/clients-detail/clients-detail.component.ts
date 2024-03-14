import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, catchError, debounceTime, filter, map, of, startWith, switchMap, takeUntil } from 'rxjs';
import { checkIfValueIsGoodForEditClient, countryValidator, isValueDefined } from '../../util-components/util-methods/util-methods';
import { ClientServiceApi } from '../../services/client/client-api.service';
import { AccountDto, CityDto, CountryDto, OpenAccountDto, ResponseDto, SaveClientDataDto } from '../../util-components/dto/dto-interfaces';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SexList, sexList } from '../../util-components/enums/sexList';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { AccountApiService } from '../../services/account/account-api.service';
import { OpenNewAccountDialogComponent } from '../../dialogs/open-new-account-dialog/open-new-account-dialog.component';


@Component({
  selector: 'app-clients-detail',
  templateUrl: './clients-detail.component.html',
  styleUrl: './clients-detail.component.css'
})
export class ClientsDetailComponent implements OnInit {
  clientId!: string;
  private unsubscribe$ = new Subject<void>();
  clientFormGroup: FormGroup;
  clientDetails: SaveClientDataDto | undefined;
  mySexList: SexList[] = sexList;
  originalValues!: SaveClientDataDto | undefined;
  filteredCountryOptions!: Observable<CountryDto[]>;
  filteredCityOptions!: Observable<CityDto[]>;
  countryId: number | undefined;
  cityId: number | undefined;
  clientStatus: string | undefined;
  clientSex: string | undefined;
  ACCOUNT_DATA: any[] = [];
  displayedColumns: string[] = ['id', 'status', 'name', 'accountTypeName', 'accountDetailCurrencyName', 'accountDetailCurrencyAmount', 'actions'];
  dataSourceAccount: MatTableDataSource<any> = new MatTableDataSource(this.ACCOUNT_DATA);
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
  checkList: number[] = [];
  currentDate = new Date();

  setPaginatorAndSort() {
    this.dataSourceAccount.paginator = this.paginator;
    this.dataSourceAccount.sort = this.sort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private _clientServiceApi: ClientServiceApi,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private _accountApiService: AccountApiService
  ) {
    this.clientFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.pattern('^[0-9]*$')]],
      sex: ['', Validators.required],
      personalDocNumber: ['', [Validators.required, Validators.minLength(9)]],
      parentName: [''],
      streetName: ['', [Validators.required, Validators.minLength(3)]],
      streetNumber: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
      city: ['', Validators.required],
      country: ['', Validators.required, countryValidator],
      pttNumber: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.pipe(
      filter(params => params.has('clientId'))
    ).subscribe(params => {
      this.clientId = params.get('clientId') ?? '';
      if (isValueDefined(this.clientId))
        this.getClientDetaildData(this.clientId);
    }
    );
    this.filteredCountryOptions = this.clientFormGroup.get('country')!.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this._filterCountry(value || ''))
    );
    this.filteredCityOptions = this.clientFormGroup.get('city')!.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this._filterCity(value || ''))
    );
  }

  chechFormsForDisabeling() {
    if (this.clientStatus === 'CLOSED') {
      this.clientFormGroup.get('name')?.disable();
      this.clientFormGroup.get('lastName')?.disable();
      this.clientFormGroup.get('dateOfBirth')?.disable();
      this.clientFormGroup.get('jmbg')?.disable();
      this.clientFormGroup.get('sex')?.disable();
      this.clientFormGroup.get('personalDocNumber')?.disable();
      this.clientFormGroup.get('parentName')?.disable();
      this.clientFormGroup.get('streetName')?.disable();
      this.clientFormGroup.get('streetNumber')?.disable();
      this.clientFormGroup.get('city')?.disable();
      this.clientFormGroup.get('country')?.disable();
      this.clientFormGroup.get('pttNumber')?.disable();
      this.clientFormGroup.get('phoneNumber')?.disable();
      this.clientFormGroup.get('mobileNumber')?.disable();
      this.clientFormGroup.get('email')?.disable();
    } else {
      this.clientFormGroup.get('name')?.enable();
      this.clientFormGroup.get('lastName')?.enable();
      this.clientFormGroup.get('dateOfBirth')?.enable();
      this.clientFormGroup.get('jmbg')?.enable();
      this.clientFormGroup.get('sex')?.enable();
      this.clientFormGroup.get('personalDocNumber')?.enable();
      this.clientFormGroup.get('parentName')?.enable();
      this.clientFormGroup.get('streetName')?.enable();
      this.clientFormGroup.get('streetNumber')?.enable();
      this.clientFormGroup.get('city')?.enable();
      this.clientFormGroup.get('country')?.enable();
      this.clientFormGroup.get('pttNumber')?.enable();
      this.clientFormGroup.get('phoneNumber')?.enable();
      this.clientFormGroup.get('mobileNumber')?.enable();
      this.clientFormGroup.get('email')?.enable();
    }
    this.onContactChange();
  }

  getClientDetaildData(clientId: string) {
    this._clientServiceApi.getClientDetail(Number(clientId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          this.clientDetails = resp.object;
          this.clientStatus = this.clientDetails?.status === 'A' ? 'ACTIVE' : 'CLOSED';
          this.clientSex = this.clientDetails?.sex;
          this.ACCOUNT_DATA = resp.object.openAccountDtoList;
          this.dataSourceAccount = new MatTableDataSource(this.ACCOUNT_DATA);
          this.fillUpFields();
          this.chechFormsForDisabeling();
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  private _filterCountry(value: string): Observable<CountryDto[]> {
    if (value === '' || value.length < 3 || typeof value == 'object') return of([]);

    const filterValue = value.toLowerCase();

    return this._clientServiceApi.getCountriesFromRedis(filterValue).pipe(
      takeUntil(this.unsubscribe$),
      map(resp => resp.filter(option => option.name!.toLowerCase().includes(filterValue))),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }
  private _filterCity(value: string): Observable<CityDto[]> {
    if (value === '' || value.length < 3 || typeof value == 'object') return of([]);

    if (
      (typeof this.clientFormGroup.get('country')?.getRawValue() == 'object' &&
        this.clientFormGroup.get('country')?.getRawValue()?.id === 22) ||
      this.clientDetails?.countryId === 22
    ) {
      const filterValue = value.toLowerCase();

      return this._clientServiceApi.getCitiesFromRedis(filterValue).pipe(
        takeUntil(this.unsubscribe$),
        map(resp => resp.filter(option => option.name!.toLowerCase().includes(filterValue))),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      );
    }

    return of([]);
  }
  displayCounteries(option: CountryDto): string {
    if (typeof option === 'string')
      return option;
    this.countryId = option.id;
    return option.name ?? '';
  }
  displayCities(option: CityDto): string {
    if (typeof option === 'string')
      return option;
    this.cityId = option.id;
    return option.name ?? '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAccount.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAccount.paginator) {
      this.dataSourceAccount.paginator.firstPage();
    }
  }

  onDateChange(event: any) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    if (inputValue !== '') {
      const formatedDate = this.datePipe.transform(inputValue, 'yyyy-MM-dd');
      input.value = formatedDate !== null ? formatedDate : '';
      this.clientFormGroup.get('dateOfBirth')?.setValue(formatedDate);
    }
  }

  fillUpFields() {
    this.clientFormGroup.get('name')?.setValue(this.clientDetails?.name);
    this.clientFormGroup.get('lastName')?.setValue(this.clientDetails?.lastName);
    this.clientFormGroup.get('dateOfBirth')?.setValue(this.clientDetails?.dateOfBirth);
    this.clientFormGroup.get('jmbg')?.setValue(this.clientDetails?.jmbg);
    this.clientFormGroup.get('sex')?.setValue(this.clientDetails?.sex);
    this.clientFormGroup.get('personalDocNumber')?.setValue(this.clientDetails?.personalDocNumber);
    this.clientFormGroup.get('parentName')?.setValue(this.clientDetails?.parentName);
    this.clientFormGroup.get('streetName')?.setValue(this.clientDetails?.streetName);
    this.clientFormGroup.get('streetNumber')?.setValue(this.clientDetails?.streetNumber);
    this.clientFormGroup.get('city')?.setValue(this.clientDetails?.city);
    this.cityId = this.clientDetails?.cityId;
    this.setCountryFromRedis(this.clientFormGroup.get('country'));
    this.countryId = this.clientDetails?.countryId;
    this.clientFormGroup.get('pttNumber')?.setValue(this.clientDetails?.pttNumber);
    this.clientFormGroup.get('phoneNumber')?.setValue(this.clientDetails?.phoneNumber);
    this.clientFormGroup.get('mobileNumber')?.setValue(this.clientDetails?.mobileNumber);
    this.clientFormGroup.get('email')?.setValue(this.clientDetails?.email);

    this.onContactChange();
    this.fillOriginalValues();
  }

  setCountryFromRedis(countryFormControll: any) {
    this._filterCountry(this.clientDetails?.country ?? '')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          countryFormControll.setValue(resp[0]);
        }
      });
  }

  fillOriginalValues() {
    this.originalValues = {
      name: this.clientFormGroup.get('name')?.getRawValue(),
      lastName: this.clientFormGroup.get('lastName')?.getRawValue(),
      dateOfBirth: this.clientFormGroup.get('dateOfBirth')?.getRawValue(),
      jmbg: this.clientFormGroup.get('jmbg')?.getRawValue(),
      sex: this.clientFormGroup.get('sex')?.getRawValue(),
      personalDocNumber: this.clientFormGroup.get('personalDocNumber')?.getRawValue(),
      parentName: this.clientFormGroup.get('parentName')?.getRawValue(),
      streetName: this.clientFormGroup.get('streetName')?.getRawValue(),
      streetNumber: this.clientFormGroup.get('streetNumber')?.getRawValue(),
      city: this.clientFormGroup.get('city')?.getRawValue(),
      countryId: this.clientDetails?.countryId,
      pttNumber: this.clientFormGroup.get('pttNumber')?.getRawValue(),
      phoneNumber: this.clientFormGroup.get('phoneNumber')?.getRawValue(),
      mobileNumber: this.clientFormGroup.get('mobileNumber')?.getRawValue(),
      email: this.clientFormGroup.get('email')?.getRawValue(),
    }
  }

  editClient() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Edit client',
        body: 'Are you sure you want to edit this client?'
      },
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (resp) {
            if (checkIfValueIsGoodForEditClient(this.originalValues, this.clientFormGroup)) {
              this._clientServiceApi.editClient(this.mappedRequest(), Number(this.clientId))
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                  next: (resp) => {
                    this.getClientDetaildData(resp.clientId.toString())
                  }, error: (err) => {
                    console.error(err);
                  }
                });
            }
          }
        }
      });
  }

  getCountryName(country: CountryDto): string {
    if (typeof country == 'string') {
      return country
    }
    this.countryId = country.id;
    return country.name ?? '';
  }

  getCity(city: any): string {
    if (typeof city == 'string')
      this.cityId = undefined;
    else
      this.cityId = city.id;
    return city.name ?? city;
  }

  private mappedRequest(): SaveClientDataDto {
    let request = {
      name: this.clientFormGroup.get('name')?.getRawValue(),
      lastName: this.clientFormGroup.get('lastName')?.getRawValue(),
      dateOfBirth: this.clientFormGroup.get('dateOfBirth')?.getRawValue(),
      jmbg: this.clientFormGroup.get('jmbg')?.getRawValue(),
      sex: this.clientFormGroup.get('sex')?.getRawValue(),
      personalDocNumber: this.clientFormGroup.get('personalDocNumber')?.getRawValue(),
      parentName: this.clientFormGroup.get('parentName')?.getRawValue(),
      streetName: this.clientFormGroup.get('streetName')?.getRawValue(),
      streetNumber: this.clientFormGroup.get('streetNumber')?.getRawValue(),
      city: this.getCity(this.clientFormGroup.get('city')?.getRawValue()),
      cityId: this.cityId,
      country: this.getCountryName(this.clientFormGroup.get('country')?.getRawValue()),
      countryId: this.countryId,
      pttNumber: this.clientFormGroup.get('pttNumber')?.getRawValue(),
      phoneNumber: this.clientFormGroup.get('phoneNumber')?.getRawValue(),
      mobileNumber: this.clientFormGroup.get('mobileNumber')?.getRawValue(),
      email: this.clientFormGroup.get('email')?.getRawValue(),
    }
    return request;
  }

  reopenClientDialog() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Reopen client',
        body: 'Are you sure you want to reopen this client?'
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.reopenClient();
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  reopenClient() {
    const reopenClientDto = {
      id: this.clientId,
      status: 'A',
    }
    this._clientServiceApi.reopenClient(reopenClientDto)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp.clientId)) {
            this.getClientDetaildData(resp.clientId.toString());
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  closeClientDialog() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Close client',
        body: 'Are you sure you want to close this client?'
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.closeClient();
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  closeClient() {
    this._clientServiceApi.deleteClient(Number(this.clientId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          this.getClientDetaildData(resp.clientId.toString())
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  closeAccount(accountId: number) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Account close',
        body: 'Are you sure you want to close this account?'
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (resp) {
            this._accountApiService.closeAccount(accountId)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: () => {
                  this.getClientDetaildData(this.clientId);
                }, error: (err) => {
                  console.error(err);
                }
              });
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  reOpenAccount(accountId: number) {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Account reopen',
        body: 'Are you sure you want to reopen this account?'
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (resp) {
            this._accountApiService.reOpenAccount(accountId)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: () => {
                  this.getClientDetaildData(this.clientId);
                }, error: (err) => {
                  console.error(err);
                }
              });
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }

  onRowClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onCheck(event: any, type: number) {
    if (event.checked) {
      this.checkList.push(type);
    } else {
      this.checkList = this.checkList.filter(src => src !== type);
    }
  }

  onMenuClosed() {
    if (this.checkList.length > 0) {
      let accountData = this.ACCOUNT_DATA.filter(item => this.checkList.includes(item.accountTypeId));
      this.dataSourceAccount = new MatTableDataSource(accountData);
    } else {
      this.dataSourceAccount = new MatTableDataSource(this.ACCOUNT_DATA);
    }
  }

  onContactChange() {
    const phone = this.clientFormGroup.get('phoneNumber');
    const mobile = this.clientFormGroup.get('mobileNumber');
    const email = this.clientFormGroup.get('email');

    if (isValueDefined(phone?.getRawValue()) && phone?.valid) {
      this.clientFormGroup.get('mobileNumber')?.setValidators([Validators.minLength(9)]);
      this.clientFormGroup.get('email')?.setValidators([Validators.email]);
    } else if (isValueDefined(mobile?.getRawValue()) && mobile?.valid) {
      this.clientFormGroup.get('phoneNumber')?.setValidators([Validators.minLength(9)]);
      this.clientFormGroup.get('email')?.setValidators([Validators.email]);
    } else if (isValueDefined(email?.getRawValue()) && email?.valid) {
      this.clientFormGroup.get('phoneNumber')?.setValidators([Validators.minLength(9)]);
      this.clientFormGroup.get('mobileNumber')?.setValidators([Validators.minLength(9)]);
    } else {
      this.clientFormGroup.get('phoneNumber')?.setValidators([Validators.required, Validators.minLength(9)]);
      this.clientFormGroup.get('mobileNumber')?.setValidators([Validators.required, Validators.minLength(9)]);
      this.clientFormGroup.get('email')?.setValidators([Validators.required, Validators.email]);
    }
    this.updateValueAndValidityForControls();
  }

  updateValueAndValidityForControls() {
    this.clientFormGroup.get('phoneNumber')?.updateValueAndValidity();
    this.clientFormGroup.get('mobileNumber')?.updateValueAndValidity();
    this.clientFormGroup.get('email')?.updateValueAndValidity();
  }

  openNewAccount() {
    const dialogRef = this.dialog.open(OpenNewAccountDialogComponent, {
      data: { header: 'Opening new account', clientId: this.clientId },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp)) {
            let openAccountDto = resp;
            this._accountApiService.openNewAccount(openAccountDto)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (resp) => {
                  if (!isValueDefined(resp.errorMessage)) {
                    this.getClientDetaildData(this.clientId);
                  }
                }, error: (err) => {
                  console.error(err);
                }
              });
          }
        }, error: (err) => {
          console.error(err);
        }
      });
  }
}