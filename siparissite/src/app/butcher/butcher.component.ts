import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatTable} from '@angular/material/table';
import { environment } from 'src/environments/environment'; 

@Component({
  selector: 'app-butcher',
  templateUrl: './butcher.component.html',
  styleUrls: ['./butcher.component.css']
})
export class ButcherComponent implements OnInit {

  displayedColumns: string[] = ['firstname', 'lastname', 'phonenumber', 'products', 'price', 'timestamp', 'order_date_for'];

  all_orders: any;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private http: HttpClient) {
    this.get_questions();
  }

  ngOnInit(): void {
  }

  get_questions() {
    this.http.get(environment.server_URL+"/orders/").subscribe((data:any) =>{      
      this.all_orders = data.orders
      console.log(this.all_orders); 
      this.table.renderRows();
    })
  }

  show_date(date: Date) {
    let date_object = new Date(date);
    console.log(date_object.getFullYear());
    return date_object.getDate() + '.' + (date_object.getMonth()+1) + '.' + date_object.getFullYear()
  }

  getTotalCost(index: number) {
    return this.all_orders[index].products.map(t => t.product_id.price*t.quantity).reduce((acc, value) => acc + value, 0);
  }
}
