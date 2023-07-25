import { Component, ViewChild } from '@angular/core';
import {MatTable} from '@angular/material/table';
import { environment } from 'src/environments/environment'; 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { SuccessOrderComponent } from '../success-order/success-order.component';

interface Products {
  product_id: string;
  quantity: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  firstname: string = "";
  lastname: string = "";
  phonenumber: string = "";
  order_date_for: Date;
  minDate = new Date();
  all_products: any;
  chosen_products: Products[] = [];
  product: any;
  quantity: number;
  total_price: number;

  displayedColumns: string[] = ['name', 'quantity', 'price', 'delete'];

  @ViewChild(MatTable) table: MatTable<any>;

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
      order_for_date_format: this.order_date_for,
      order_for_date_string: this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth()+1) + '.' + this.order_date_for.getFullYear(),
      total_price: this.total_price, 
    }
    console.log(order_string);
    this.http.post(environment.server_URL+"/orders/", order_string, {headers})
      .subscribe((data:any) =>{
        console.log(data);
        this.reset_all();
        this.openSucceed();
        console.log("Bestellt für den " + this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth()+1) + '.' + this.order_date_for.getFullYear())
      },
      (error) => {                              //Error callback
        console.error('error caught in component: ' + error)
        alert('Bestellung war NICHT erfolgreich! Bitte versuchen Sie es später nocheinmal.')
        //throw error;   //You can also throw the error to a global error handler
      })
  }

  disable_order() {
    return !this.firstname || !this.lastname || !this.phonenumber || !this.order_date_for || !this.chosen_products.length
  }

  disable_add_product() {
    return !this.product || !this.quantity
  }

  get_products() {
    this.http.get(environment.server_URL+"/products/").subscribe((data:any) =>{
      console.log(data); 
      this.all_products = data;
    },
    (error) => {                              //Error callback
      console.error('error caught in component: ' + error)
      alert('Produkte konnten nicht geladen werden! Eine Bestellung ist leider nicht möglich.')
      //throw error;   //You can also throw the error to a global error handler
    })
  }

  add_chosen_products() {
    let product: Products = {product_id: this.product._id, quantity: this.quantity, name: this.product.name, price: this.product.price};
    this.chosen_products.push(product);
    console.log(this.chosen_products);
    this.table.renderRows();
    this.product = null;
    this.quantity = null;
  }

  remove_chosen_products(index: number) {
    this.chosen_products.splice(index, 1);
    this.table.renderRows();
  }

  reset_all() {
    this.firstname = "";
    this.lastname = "";
    this.phonenumber = "";
    this.order_date_for = null;
    this.chosen_products = [];
    this.total_price = null;
  }

  getTotalCost() {
    this.total_price = Number(this.chosen_products.map(t => t.price*t.quantity).reduce((acc, value) => acc + value, 0).toFixed(2));
    return this.total_price;
  }

}
