import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from './material-design/material-design.module'
import { FormsModule } from '@angular/forms';
import { SuccessOrderComponent } from './success-order/success-order.component';
import { HttpClientModule  } from '@angular/common/http';
import { OrderComponent } from './order/order.component';
import { CustomDateAdapter } from './custom-date-adapter';
import { DateAdapter } from '@angular/material/core';
import { ButcherComponent } from './butcher/butcher.component';
import { ProductsComponent } from './products/products.component';
import { PostProductComponent } from './post-product/post-product.component';
import { DeleteSomethingComponent } from './delete-something/delete-something.component';

@NgModule({
  declarations: [
    AppComponent,
    SuccessOrderComponent,
    OrderComponent,
    ButcherComponent,
    ProductsComponent,
    PostProductComponent,
    DeleteSomethingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialDesignModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
