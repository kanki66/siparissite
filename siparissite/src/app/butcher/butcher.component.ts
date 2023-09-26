import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ngxCsv } from 'ngx-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-butcher',
  templateUrl: './butcher.component.html',
  styleUrls: ['./butcher.component.css']
})
export class ButcherComponent implements OnInit {
  displayedColumns: string[] = ['firstname', 'lastname', 'phonenumber', 'products', 'total_price', 'order_for_date_string'];

  all_orders: any;
  all_orders_export: any;
  start_date: Date;
  end_date: Date;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content', { static: false }) content!: ElementRef;

  constructor(private http: HttpClient) {
    this.get_orders();
  }

  ngOnInit(): void {
  }

  get_orders() {
    this.http.get(environment.server_URL + "/orders/").subscribe((data: any) => {
      this.all_orders = new MatTableDataSource(data.orders);
      this.all_orders_export = data.orders;
      console.log(this.all_orders_export);
      this.all_orders.sort = this.sort;
      this.table.renderRows();
    },
      (error) => {                              //Error callback
        console.error('error caught in component: ' + error)
        alert('Daten konnten nicht geladen werden.')
        //throw error;   //You can also throw the error to a global error handler
      })
  }

  show_date(date: Date) {
    let date_object = new Date(date);
    console.log(date_object.getFullYear());
    return date_object.getDate() + '.' + (date_object.getMonth() + 1) + '.' + date_object.getFullYear()
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
      headers: ['Vorname', 'Nachname', 'Telefonnummer', 'Produkte', 'Gesamtpreis', 'Bestellt für den'],
    }

    new ngxCsv(this.all_orders_export, "bestellungen_", options);
  }

  SavePDF(): void {
    let doc = new jsPDF('landscape', 'px', 'a4');

    let head = [['Vorname', 'Nachname', 'Telefonnummer', 'Produkte', 'Gesamtpreis in €', 'Bestellt für den']];
    let body = []
    this.all_orders_export.forEach(function (order) {
      let data = [order.firstname, order.lastname, order.phonenumber]
      let prod: string = '';
      order.products.forEach(function (product) {
        if (product.product_id) {
          prod = prod + product.quantity.toString() + ' kg ' + product.product_id.name + '\n';
        }
        else {
          prod = prod + 'Gelöschtes Produkt'
        }
      })

      data.push(prod, order.total_price, order.order_for_date_string)
      body.push(data)
    });

    autoTable(doc, { head, body });
    doc.save("test.pdf");
  }

  get_by_date() {
    this.http.get(environment.server_URL + "/orders/" + this.start_date.toISOString().substr(0, 10) + "/" + this.end_date.toISOString().substr(0, 10)).subscribe((data: any) => {
      console.log(data);
    },
      (error) => {                              //Error callback
        console.error('error caught in component: ' + error)
        alert('Daten konnten nicht geladen werden.')
        //throw error;   //You can also throw the error to a global error handler
      })
    console.log(this.start_date.toISOString().substr(0, 10))
    console.log(this.end_date)
  }
}

