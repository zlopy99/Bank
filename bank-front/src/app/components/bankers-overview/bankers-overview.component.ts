import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserApiService } from '../../services/user/user-api.service';
import { UserService } from '../../services/user/user.service';
import { UserDto } from '../../util-components/dto/dto-interfaces';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { isValueDefined } from '../../util-components/util-methods/util-methods';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bankers-overview',
  templateUrl: './bankers-overview.component.html',
  styleUrl: './bankers-overview.component.css'
})
export class BankersOverviewComponent implements OnDestroy {
  userColumns: string[] = ['id', 'name', 'email', 'image'];
  USER_DATA: UserDto[] = [];
  dataSource: MatTableDataSource<UserDto> = new MatTableDataSource(this.USER_DATA);
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
  private unsubscribe$ = new Subject<void>();
  imageUrl!: SafeUrl;
  inputValue!: string;

  constructor(
    private _userApiService: UserApiService,
    private _userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  getAllUsers() {
    this._userApiService.getAllUsers(this.inputValue ?? null)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: async (resp) => {
        this.USER_DATA = await this.setUpImagesForUsers(resp);
        this.dataSource = new MatTableDataSource(this.USER_DATA);

      }, error: (err) => {
        console.error(err);
      }
    });
  }

  async setUpImagesForUsers(users: UserDto[]) {
    users.forEach(user => {
      if (isValueDefined(user.image)) {
        const objectURL = `data:image/jpeg;base64,${user.image}`;
        user.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
      return user;
    });

    return users;
  }

  goToBankerDetails(userId: any) {
    console.log(userId);
    this.router.navigate(['/bankers/detail'], { queryParams: { userId: userId } });
  }
}
