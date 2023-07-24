import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButcherComponent } from './butcher/butcher.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {path:'butcher', component: ButcherComponent},
  {path:'bestellen', component: OrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
