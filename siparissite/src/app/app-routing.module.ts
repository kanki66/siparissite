import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButcherComponent } from './butcher/butcher.component';
import { OrderComponent } from './order/order.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: 'butcher', component: ButcherComponent },
  { path: 'bestellen', component: OrderComponent },
  { path: 'produkte', component: ProductsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
