import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OpenNewClientDialogComponent } from '../../dialogs/open-new-client-dialog/open-new-client-dialog.component';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { isValueDefined } from '../../util-components/util-methods/util-methods';
import { OpenNewClientDetailDialogComponent } from '../../dialogs/open-new-client-detail-dialog/open-new-client-detail-dialog.component';
import { ClientServiceApi } from '../../services/client/client-api.service';
import { OpenNewAccountDialogComponent } from '../../dialogs/open-new-account-dialog/open-new-account-dialog.component';
import { OpenAccountDto } from '../../util-components/dto/dto-interfaces';
import { AccountApiService } from '../../services/account/account-api.service';
import { UserApiService } from '../../services/user/user-api.service';
import { UserService } from '../../services/user/user.service';
import { OpenNewBankerDialogComponent } from '../../dialogs/open-new-banker-dialog/open-new-banker-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnDestroy {
  @ViewChild('inputElement') inputElement!: ElementRef;
  inputValue!: string;
  private unsubscribe$ = new Subject<void>();
  firstPartOfInfo: any = null;
  secondPartOfInfo: any = null;
  openAccountDto!: OpenAccountDto;
  userPathVisibilityAccount!: boolean;
  userPathVisibilityClient!: boolean;
  userPathVisibilityAdmin!: boolean;
  roleName!: string[];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _clientServiceApi: ClientServiceApi,
    private _accountServiceApi: AccountApiService,
    private _userApiService: UserApiService,
    private _userService: UserService,
    private toastr: ToastrService
  ) {
    this.setUserPathVisibility();
   }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToHome() {
    this.router.navigateByUrl('home');
  }

  searchClient() {
    this.inputElement.nativeElement.focus();
    if (this.checkInput()) {
      this.router.navigate(['/clients'], { queryParams: { inputValue: this.inputValue } });
      this.resetButtonSearch();
    }
  }

  resetButtonSearch() {
    this.inputValue = '';
    this.inputElement.nativeElement.blur();
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.checkInput()) {
      const clickedElement = event.target as HTMLElement;

      if (!clickedElement.closest('.input-wrapper')) {
        this.resetButtonSearch()
      }
    }
  }

  checkInput() {
    return this.inputValue !== '' && this.inputValue !== undefined;
  }

  openDialogForNewClient() {
    const dialogRef = this.dialog.open(OpenNewClientDialogComponent, {
      data: { header: 'Opening new client - Personal Information' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp)) {
            this.firstPartOfInfo = resp;
            this.goToSecondPartOfOpening();
          }
        }, error: (err) => {
          this.toastr.error(err?.error?.message, 'Error');
        }
      });
  }

  goToSecondPartOfOpening() {
    const dialogRef = this.dialog.open(OpenNewClientDetailDialogComponent, {
      data: { header: 'Opening new client - Client Detail' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp)) {
            this.secondPartOfInfo = resp;
            this._clientServiceApi.saveClient(this.mapToSaveDto())
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (resp) => {
                  if (!isValueDefined(resp.errorMessage)) {
                    this.toastr.success('Client was opened successfully.', 'Success');
                    this.router.navigate(['clients'], { queryParams: { clientId: resp.clientId } })
                    .then( () => this.router.navigate(['clients/detail'], { queryParams: { clientId: resp.clientId } }));

                  } else
                    this.toastr.error(resp.errorMessage, 'Error');
                },

                error: (err) => {
                  this.toastr.error(err?.error?.message, 'Error');
                }
              });
          }
        }, error: (err) => {
          this.toastr.error(err?.error?.message, 'Error');
        }
      });
  }

  mapToSaveDto(): any {
    return {
      dateOfBirth: this.firstPartOfInfo.dateOfBirth,
      jmbg: this.firstPartOfInfo.jmbg,
      lastName: this.firstPartOfInfo.lastName,
      name: this.firstPartOfInfo.name,
      sex: this.firstPartOfInfo.sex,
      personalDocNumber: this.firstPartOfInfo.personalDocNumber,
      city: this.secondPartOfInfo.city,
      cityId: this.secondPartOfInfo.cityId,
      countryId: this.secondPartOfInfo.countryId,
      email: this.secondPartOfInfo.email,
      mobileNumber: this.secondPartOfInfo.mobileNumber,
      parentName: this.secondPartOfInfo.parentName,
      phoneNumber: this.secondPartOfInfo.phoneNumber,
      pttNumber: this.secondPartOfInfo.pttNumber,
      streetName: this.secondPartOfInfo.streetName,
      streetNumber: this.secondPartOfInfo.streetNumber
    }
  }

  openDialogForNewBanker() {
    const dialogRef = this.dialog.open(OpenNewBankerDialogComponent, {
      data: { header: 'Opening new banker' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp)) {
            const newUserDto = resp;
            this._userApiService.createUser(newUserDto)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: () => {
                  this.toastr.success('User created successfully.', 'Success');

                }, error: (err) => {
                  this.toastr.error(err?.error?.message, 'Error');
                }
              });
          }

        }, error: (err) => {
          this.toastr.error(err?.error?.message, 'Error');
        }
      });
  }

  openDialogForNewAccount() {
    const dialogRef = this.dialog.open(OpenNewAccountDialogComponent, {
      data: { header: 'Opening new account' },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (resp) => {
          if (isValueDefined(resp)) {
            this.openAccountDto = resp;
            this._accountServiceApi.openNewAccount(this.openAccountDto)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (resp) => {
                  if (!isValueDefined(resp.errorMessage)) {
                    this.toastr.success('Account opened successfully.', 'Success');
                    this.router.navigate(['clients'], { queryParams: { clientId: resp.clientId } })
                    .then( () => this.router.navigate(['clients/detail'], { queryParams: { clientId: resp.clientId } }));

                  } else
                    this.toastr.error(resp.errorMessage, 'Error');
                    
                }, error: (err) => {
                  this.toastr.error(err, 'Error');
                }
              });
          }
        }, error: (err) => {
          this.toastr.error(err, 'Error');
        }
      });
  }

  logout() {
    this._userService.logout();
  }

  setUserPathVisibility() {
    this.userPathVisibilityAccount = this._userService.checkRoleForAccount();
    this.userPathVisibilityClient = this._userService.checkRoleForClient();
    this.userPathVisibilityAdmin = this._userService.checkRoleForBanker();
    this.roleName = this._userService.getRoleName();
  }
}
