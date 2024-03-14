import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SexList, sexList } from '../../util-components/enums/sexList';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-open-new-client-dialog',
  templateUrl: './open-new-client-dialog.component.html',
  styleUrl: './open-new-client-dialog.component.css',
})
export class OpenNewClientDialogComponent implements OnDestroy, OnInit {
  private unsubscribe$ = new Subject<void>();
  clientFormGroup: FormGroup;
  mySexList: SexList[] = sexList;
  currentDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<NavBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.clientFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.pattern('^[0-9]*$')]],
      sex: ['', Validators.required],
      personalDocNumber: ['', [Validators.required, Validators.minLength(9)]],
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  canContinue() {
    const clientPersonalData = {
      name: this.clientFormGroup.get('name')?.getRawValue(),
      lastName: this.clientFormGroup.get('lastName')?.getRawValue(),
      dateOfBirth: this.clientFormGroup.get('dateOfBirth')?.getRawValue(),
      jmbg: this.clientFormGroup.get('jmbg')?.getRawValue(),
      sex: this.clientFormGroup.get('sex')?.getRawValue(),
      personalDocNumber: this.clientFormGroup.get('personalDocNumber')?.getRawValue(),
    }
    this.dialogRef.close(clientPersonalData);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
