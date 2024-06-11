import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleList, roleList } from '../../util-components/enums/roleList';
import { UserDto } from '../../util-components/dto/dto-interfaces';

@Component({
  selector: 'app-open-new-banker-dialog',
  templateUrl: './open-new-banker-dialog.component.html',
  styleUrl: './open-new-banker-dialog.component.css'
})
export class OpenNewBankerDialogComponent {
  bankerFormGroup: FormGroup;
  roleList: RoleList[] = roleList;
  selectedFile!: File;

  constructor(
    public dialogRef: MatDialogRef<NavBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.bankerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imageFile: null,
      roles: ['', [Validators.required]],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openBanker() {
    const newUserDto: UserDto = {
      name: this.bankerFormGroup.get('name')?.getRawValue(),
      email: this.bankerFormGroup.get('email')?.getRawValue(),
      password: this.bankerFormGroup.get('password')?.getRawValue(),
      roles: this.bankerFormGroup.get('roles')?.getRawValue()
    }

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(newUserDto)], { type: 'application/json' }));
    formData.append('file', this.selectedFile);

    this.dialogRef.close(formData);
  }
  

  onFileChange(event: any) {
    event.stopPropagation();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
    }
  }
}
