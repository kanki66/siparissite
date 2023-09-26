import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
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

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    if (this.getWeekNumber(new Date()) % 2 == 0 && (this.checkSaturday().toDateString() == d.toDateString())) {
      return false;
    }
    return (day == 6) && (this.getWeekNumber((new Date(d))) % 2 == 0);
    // 1 means monday, 0 means sunday, etc.
  };

  getWeekNumber(_date: Date): number {
    _date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    _date.setDate(_date.getDate() + 3 - (_date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(_date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((_date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  checkSaturday() {
    let today = new Date();
    let saturday = new Date();
    saturday.setDate(today.getDate() + (6 - today.getDay()));
    saturday.setHours(0);
    saturday.setMinutes(0);
    saturday.setSeconds(0);
    saturday.setMilliseconds(0);

    return saturday;
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
      order_for_date_string: this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth() + 1) + '.' + this.order_date_for.getFullYear(),
      total_price: this.total_price,
    }
    console.log(order_string);
    this.http.post(environment.server_URL + "/orders/", order_string, { headers })
      .subscribe((data: any) => {
        console.log(data);
        this.reset_all();
        this.dialog.open(SuccessOrderComponent, {
          data: { html_text: "Ihre Bestellung war erfolgreich!", },
        });
        console.log("Bestellt für den " + this.order_date_for.getDate() + '.' + (this.order_date_for.getMonth() + 1) + '.' + this.order_date_for.getFullYear())
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
    this.http.get(environment.server_URL + "/products/").subscribe((data: any) => {
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
    let product: Products = { product_id: this.product._id, quantity: this.quantity, name: this.product.name, price: this.product.price };
    this.chosen_products.push(product);
    console.log(this.chosen_products);
    this.product = null;
    this.quantity = null;
    this.table.renderRows();
  }

  remove_chosen_product(index: number) {
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
    this.total_price = Number(this.chosen_products.map(t => t.price * t.quantity).reduce((acc, value) => acc + value, 0).toFixed(2));
    return this.total_price;
  }

}
