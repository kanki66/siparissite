import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  html_text: string;
}

@Component({
  selector: 'app-success-order',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.css']
})
export class SuccessOrderComponent {

  html_text: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
}
