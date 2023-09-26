import { Component, OnInit, Inject } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-something',
  templateUrl: './delete-something.component.html',
  styleUrls: ['./delete-something.component.css']
})
export class DeleteSomethingComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProductsComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    console.log(this.data)
  }


}
