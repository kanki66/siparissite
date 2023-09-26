import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductsComponent } from '../products/products.component';


@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {


  data = {
    product_name: '',
    product_price: null,
  }

  constructor(public dialogRef: MatDialogRef<ProductsComponent>) { }

  ngOnInit(): void {
  }

}
