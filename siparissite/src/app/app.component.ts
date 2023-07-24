import { Component, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { SuccessOrderComponent } from './success-order/success-order.component';

interface Products {
  product_id: string;
  quantity: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'siparissite';

  firstname: string = "";
  lastname: string = "";
  phonenumber: string = "";
  order_date_for: Date;
  minDate = new Date();
  all_products: any;
  chosen_products: Products[] = [];
  product: any = {};
  quantity: number;

  displayedColumns: string[] = ['name', 'quantity', 'price'];

  @ViewChild(MatTable) table: MatTable<Products>;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.get_products();
  }

  ngOnInit(): void {
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.

    return day !== 0 && day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5;
  }


  openSucceed() {
    this.dialog.open(SuccessOrderComponent);
  }

  send_order() {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE'
      });
      
    let timestamp = new Date()

    let order_string = {
      firstname: this.firstname,
      lastname: this.lastname,
      phonenumber: this.phonenumber,
      products: this.chosen_products,
      timestamp: timestamp,
      order_date_for: this.order_date_for,      
    }

    this.http.post("http://localhost:5000/orders/", order_string, {headers})
      .subscribe(data =>{
        console.log(data);
        this.reset_all();
        this.openSucceed();
        console.log("Bestellt für den " + this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth()+1) + '.' + this.order_date_for.getFullYear())
      })
  }

  disable_order() {
    return !this.firstname || !this.lastname || !this.phonenumber || !this.order_date_for
  }

  disable_add_product() {
    return !this.product || !this.quantity
  }

  get_products() {
    this.http.get("http://localhost:5000/products/").subscribe((data:any) =>{
      console.log(data); 
      this.all_products = data;
    })
  }

  add_chosen_products() {
    let product: Products = {product_id: this.product._id, quantity: this.quantity, name: this.product.name, price: this.product.price};
    this.chosen_products.push(product);
    console.log(this.chosen_products);
    this.table.renderRows();
  }

  remove_chosen_products() {
    this.table.renderRows();
  }

  reset_all() {
    this.firstname = "";
    this.lastname = "";
    this.phonenumber = "";
    this.order_date_for = null;
    this.chosen_products = [];
  }

  getTotalCost() {
    return this.chosen_products.map(t => t.price*t.quantity).reduce((acc, value) => acc + value, 0);
  }
}
