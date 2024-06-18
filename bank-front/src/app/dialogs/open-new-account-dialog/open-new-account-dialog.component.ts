import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyList, currencyList } from '../../util-components/enums/currencyList';
import { AccountTypeList, accountTypeList } from '../../util-components/enums/accountTypeList';
import { isValueDefined } from '../../util-components/util-methods/util-methods';

@Component({
  selector: 'app-open-new-account-dialog',
  templateUrl: './open-new-account-dialog.component.html',
  styleUrl: './open-new-account-dialog.component.css'
})
export class OpenNewAccountDialogComponent {
  accountFormGroup: FormGroup;
  myCurrencyList: CurrencyList[] = currencyList;
  myAccountTypeList: AccountTypeList[] = accountTypeList;

  constructor(
    public dialogRef: MatDialogRef<NavBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.accountFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      accountTypeId: ['', [Validators.required, Validators.minLength(3)]],
      accountDetailCurrencyAmmount: ['', [Validators.required, Validators.min(0)]],
      accountDetailCurrencyId: ['', [Validators.required, Validators.minLength(3)]],
      clientId: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],
    });
    if (isValueDefined(data.clientId))
      this.accountFormGroup.get('clientId')?.setValue(data.clientId);
  }

  openAccount() {
    const accountData = {
      name: this.accountFormGroup.get('name')?.getRawValue(),
      accountTypeId: this.accountFormGroup.get('accountTypeId')?.getRawValue(),
      accountDetailCurrencyAmmount: this.accountFormGroup.get('accountDetailCurrencyAmmount')?.getRawValue(),
      accountDetailCurrencyId: this.accountFormGroup.get('accountDetailCurrencyId')?.getRawValue(),
      clientId: this.accountFormGroup.get('clientId')?.getRawValue(),
    }
    this.dialogRef.close(accountData);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  errorControll(formControll: any) {
    let errMsg = '';
    if (isValueDefined(formControll)) {
      const errors = formControll?.errors;

      if (this.checkErrors(errors['required']))
        errMsg += 'Input is required\n';
      if (this.checkErrors(errors['minlength'])) {
        const value = errors['minlength']?.requiredLength;
        errMsg += `Minimum length is ${value} characters\n`;
      }
      if (this.checkErrors(errors['pattern']))
        errMsg += `Only numbers allowed\n`;
      if (this.checkErrors(errors['needsToBePickedFromTheList']))
        errMsg += `Needs to be picked from list\n`;
      if (this.checkErrors(errors['email']))
        errMsg += `Email input needed\n`;
      if (this.checkErrors(errors['min'])) {
        const value = errors['min']?.min;
        errMsg += `Minimum is ${value}\n`;
      }
    }

    return errMsg;
  }

  checkErrors(formControllErrors: any) {
    return formControllErrors !== undefined && formControllErrors !== null;
  }
}
