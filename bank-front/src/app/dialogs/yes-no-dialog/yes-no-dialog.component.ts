import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrl: './yes-no-dialog.component.css'
})
export class YesNoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  dialogYes() {
    this.dialogRef.close(true);
  }

  dialogNo() {
    this.dialogRef.close(false);
  }
}
