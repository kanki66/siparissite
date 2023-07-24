import { Component } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { SuccessOrderComponent } from './success-order/success-order.component';

interface Products {
  product_id: string;
  quantity: number;
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
  product_id: string;
  quantity: number;

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
      products: [{product:"64bcc6428d9dbe2c2120f50e", quantity: 2}],
      timestamp: timestamp,
      order_date_for: this.order_date_for,      
    }

    this.http.post("http://localhost:5000/orders/", order_string, {headers})
      .subscribe(data =>{
        console.log(data);
        this.firstname = "";
        this.lastname = "";
        this.phonenumber = "";
        this.order_date_for = null;
        this.openSucceed()
        console.log("Bestellt für den " + this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth()+1) + '.' + this.order_date_for.getFullYear())
      })
  }

  disable_order() {
    return !this.firstname || !this.lastname || !this.phonenumber
  }

  disable_add_product() {
    return !this.product_id || !this.quantity
  }

  get_products() {
    this.http.get("http://localhost:5000/products/").subscribe((data:any) =>{
      console.log(data); 
      this.all_products = data;
    })
  }

  add_chosen_products() {
    let product: Products = {product_id: this.product_id, quantity: this.quantity};
    this.chosen_products.push(product);
    console.log(this.chosen_products);
  }
}
