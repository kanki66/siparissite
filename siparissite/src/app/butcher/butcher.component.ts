import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatTable} from '@angular/material/table';
import { environment } from 'src/environments/environment'; 
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-butcher',
  templateUrl: './butcher.component.html',
  styleUrls: ['./butcher.component.css']
})
export class ButcherComponent implements OnInit {

  displayedColumns: string[] = ['firstname', 'lastname', 'phonenumber', 'products', 'total_price', 'order_for_date_string'];

  all_orders: any;
  all_orders_export: any;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private http: HttpClient) {
    this.get_orders();
  }

  ngOnInit(): void {
  }

  get_orders() {
    this.http.get(environment.server_URL+"/orders/").subscribe((data:any) =>{
      this.all_orders = new MatTableDataSource(data.orders);  
      this.all_orders_export = data.orders;    
      console.log(this.all_orders); 
      this.all_orders.sort = this.sort;
      this.table.renderRows();
    })
  }

  show_date(date: Date) {
    let date_object = new Date(date);
    console.log(date_object.getFullYear());
    return date_object.getDate() + '.' + (date_object.getMonth()+1) + '.' + date_object.getFullYear()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.all_orders.filter = filterValue.trim().toLowerCase();
  }

  export_to_csv() {
    var options = {
      title: "Bestellungen",
      fieldSeperator: ',',
      quoteStrings: '"',
      decimalseperator: '.',
      showLabels: false,
      noDownload: false,
      showTitle: false,
      useBom: false,
      headers: ['Vorname', 'Nachname', 'Telefonnummer', 'Produkte', 'Gesamtpreis', 'Bestellt für Datum'],
    }
    
    new ngxCsv(this.all_orders_export, "bestellungen_", options);
  }
}
