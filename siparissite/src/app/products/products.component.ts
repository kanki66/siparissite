import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PostProductComponent } from '../post-product/post-product.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteSomethingComponent } from '../delete-something/delete-something.component';

import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  all_products: any;

  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) {

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

  deleteProduct(product: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE'
    });

    this.http.delete(environment.server_URL + '/products/' + product._id, { headers })
      .subscribe(
        (data: any) => {
          console.log(data);
          this.getProducts();
          this.openSnackBar(product.name + ' wurde gelöscht!');
        },
        err => {
          console.log(err);
        });
  }

  postProduct(name, price) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE'
    });


    let product_string = {
      name: name,
      price: price,
    }
    console.log(product_string);
    this.http.post(environment.server_URL + "/products/", product_string, { headers })
      .subscribe((data: any) => {
        console.log(data);
        this.getProducts();
        this.openSnackBar(data.createdProduct.name + ' wurde hinzugefügt!');
      },
        (error) => {                              //Error callback
          console.error('error caught in component: ' + error)
          alert('Hinzugüfen war NICHT erfolgreich! Bitte versuchen Sie es später nocheinmal.')
          //throw error;   //You can also throw the error to a global error handler
        })
  }

  openPostDialog() {
    const dialogRef = this.dialog.open(PostProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result.product_name && result.product_price) {
        this.postProduct(result.product_name, result.product_price)
      }
    })
  }

  openDeleteDialog(product) {
    const dialogRef = this.dialog.open(DeleteSomethingComponent, {
      data: product,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        console.log(result);
        this.deleteProduct(result);
      }
    })
  }

  openSnackBar(data: string) {
    this._snackBar.open(data, "", {
      duration: 3000
    });
  }
}
