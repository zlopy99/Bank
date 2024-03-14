import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { Observable, Subject, catchError, debounceTime, map, of, startWith, switchMap, takeUntil } from 'rxjs';
import { countryValidator, isValueDefined } from '../../util-components/util-methods/util-methods';
import { ClientServiceApi } from '../../services/client/client-api.service';
import { CityDto, CountryDto } from '../../util-components/dto/dto-interfaces';

@Component({
  selector: 'app-open-new-client-detail-dialog',
  templateUrl: './open-new-client-detail-dialog.component.html',
  styleUrl: './open-new-client-detail-dialog.component.css'
})
export class OpenNewClientDetailDialogComponent implements OnInit {
  clientFormGroup: FormGroup;
  filteredCountryOptions!: Observable<CountryDto[]>;
  filteredCityOptions!: Observable<CityDto[]>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<NavBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private _clientServiceApi: ClientServiceApi
  ) {
    this.clientFormGroup = this.fb.group({
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
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
      typeof this.clientFormGroup.get('country')?.getRawValue() == 'object' &&
      this.clientFormGroup.get('country')?.getRawValue()?.id === 22
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
    return option.name ?? '';
  }
  displayCities(option: CityDto): string {
    return option.name ?? '';
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

  openClient() {
    const clientDetailData = {
      parentName: this.clientFormGroup.get('parentName')?.getRawValue(),
      streetName: this.clientFormGroup.get('streetName')?.getRawValue(),
      streetNumber: this.clientFormGroup.get('streetNumber')?.getRawValue(),
      city: this.getCity(this.clientFormGroup.get('city')?.getRawValue()),
      cityId: this.getCityId(this.clientFormGroup.get('city')?.getRawValue()),
      countryId: this.getCountry(this.clientFormGroup.get('country')?.getRawValue()),
      pttNumber: this.clientFormGroup.get('pttNumber')?.getRawValue(),
      phoneNumber: this.clientFormGroup.get('phoneNumber')?.getRawValue(),
      mobileNumber: this.clientFormGroup.get('mobileNumber')?.getRawValue(),
      email: this.clientFormGroup.get('email')?.getRawValue(),
    }
    this.dialogRef.close(clientDetailData);
  }

  getCountry(value: any): any{
    if (typeof value == 'object') return value?.id;
    return null;
  }

  getCity(value: any): any{
    if (typeof value == 'object') return value?.name;
    return value;
  }

  getCityId(value: any): any{
    if (typeof value == 'object') return value?.id;
    return null;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
