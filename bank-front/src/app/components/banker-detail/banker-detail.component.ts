import { Component } from '@angular/core';
import { UserApiService } from '../../services/user/user-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { isValueDefined } from '../../util-components/util-methods/util-methods';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleList, roleList } from '../../util-components/enums/roleList';
import { UserDto } from '../../util-components/dto/dto-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';


@Component({
  selector: 'app-banker-detail',
  templateUrl: './banker-detail.component.html',
  styleUrl: './banker-detail.component.css'
})
export class BankerDetailComponent {
  userId!: string;
  userImage: any;
  formGroup!: FormGroup;
  roleList: RoleList[] = roleList;
  userOriginalData!: UserDto;
  selectedFile!: File;
  isClicked = false;
  clientOrAccountLogs = true;

  constructor(
    private _userApiService: UserApiService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.setupFormGroup();
    this.setQueryParams();
  }

  setupFormGroup() {
    this.formGroup = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      passwordChange: [null, Validators.minLength(6)],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', [Validators.required]],
      image: null,
      imageName: null
    });
  }

  changeLog() {
    this.clientOrAccountLogs = !this.clientOrAccountLogs;
  }

  async setQueryParams() {
    this.activatedRoute.queryParamMap.pipe(
      filter(params => params.has('userId'))
    ).subscribe(params => {
      this.userId = params.get('userId') ?? '';
      if (isValueDefined(this.userId))
        this.getUserDetails(this.userId);
    });
  }

  async getUserDetails(userId: string) {
    const user = await firstValueFrom(this._userApiService.getUser(Number(userId)))
      .catch(error => console.error(error));

    if (user !== undefined) {
      this.userOriginalData = user;
      this.setImage(user);
      this.populateUserData(user);
    }
  }

  setImage(user: UserDto) {
    const objectURL = `data:image/jpeg;base64,${user?.image}`;
    this.userImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  populateUserData(user: UserDto) {
    this.formGroup.get('userName')?.setValue(user.name);
    this.formGroup.get('email')?.setValue(user.email);
    this.formGroup.get('roles')?.setValue(
      roleList.filter(item => user.roles.find(item2 => item2.id === item.id))
    );
    this.formGroup.get('imageName')?.setValue(user.imageName);
  }

  onFileChange(event: any) {
    event.stopPropagation();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.formGroup.get('imageName')?.setValue(file.name);
    }
  }

  async resetToDefault() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Reset data',
        body: 'Are you sure you want to reset banker personal info to default?'
      },
      disableClose: true
    });

    const dialogValue = await firstValueFrom(dialogRef.afterClosed());

    if (dialogValue) {
      this.formGroup.get('userName')?.setValue(this.userOriginalData.name);
      this.formGroup.get('email')?.setValue(this.userOriginalData.email);
      this.formGroup.get('roles')?.setValue(
        roleList.filter(item => this.userOriginalData.roles.find(item2 => item2.id === item.id))
      );
      this.formGroup.get('image')?.setValue(null);
      this.formGroup.get('passwordChange')?.setValue(null);
      this.formGroup.get('imageName')?.setValue(this.userOriginalData.imageName);
    }
  }

  async editBanker() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      data: {
        header: 'Edit banker',
        body: 'Are you sure you want to edit banker personal info?'
      },
      disableClose: true
    });

    const dialogValue = await firstValueFrom(dialogRef.afterClosed());

    if (dialogValue) {
      // Change banker info
      if (this.checkIfThereIsAnythingToEdit()) {
        const newUserDto = this.createUserDto();

        if (this.isClicked)
          newUserDto.imageName = 'DELETE';

        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(newUserDto)], { type: 'application/json' }));
        formData.append('file', this.selectedFile);

        const user = await firstValueFrom(this._userApiService.editUser(formData))
          .catch(err => console.error(err));

        if (user !== undefined) {
          this.userOriginalData = user;
          this.setImage(user);
          this.populateUserData(user);
        }
      }
    }
  }

  deletePicture(isClicked: boolean) {
    this.isClicked = !isClicked;
  }

  checkIfThereIsAnythingToEdit() {
    // console.log(this.formGroup.get('userName')?.getRawValue() === this.userOriginalData.name);
    // console.log(this.formGroup.get('email')?.getRawValue() === this.userOriginalData.email);
    // console.log(this.checkForRoles());
    // console.log(this.formGroup.get('passwordChange')?.getRawValue() === this.userOriginalData.password);
    // console.log(this.formGroup.get('imageName')?.getRawValue() === this.userOriginalData.imageName);
    return !(
      this.formGroup.get('userName')?.getRawValue() === this.userOriginalData.name &&
      this.formGroup.get('email')?.getRawValue() === this.userOriginalData.email &&
      this.checkForRoles() &&
      this.formGroup.get('passwordChange')?.getRawValue() === this.userOriginalData.password &&
      this.formGroup.get('imageName')?.getRawValue() === this.userOriginalData.imageName &&
      !this.isClicked
    );
  }

  checkForRoles() {
    for (const value of this.formGroup.get('roles')?.getRawValue()) {
      if (this.userOriginalData.roles.find(item => item.id === value.id) === undefined)
        return false;
    }

    return true;
  }

  createUserDto() {
    const data: UserDto = {
      id: this.userOriginalData.id,
      name: this.formGroup.get('userName')?.getRawValue(),
      email: this.formGroup.get('email')?.getRawValue(),
      roles: this.formGroup.get('roles')?.getRawValue(),
      password: this.formGroup.get('password')?.getRawValue(),
    }

    return data;
  }
}
