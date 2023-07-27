import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  all_products: any;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.http.get(environment.server_URL + "/products/").subscribe((data: any) => {
      this.all_products = data;
      console.log(this.all_products);
    },
      (error) => {                              //Error callback
        console.error('error caught in component: ' + error)
        alert('Daten konnten nicht geladen werden.')
        //throw error;   //You can also throw the error to a global error handler
      })
  }

  deleteProduct(index) {

  }
}
