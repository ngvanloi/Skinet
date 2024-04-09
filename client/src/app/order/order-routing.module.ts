import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderItemComponent } from './order-item/order-item.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: ':id', component: OrderItemComponent, data: { breadcrumb: { alias: 'orderDetails' } } },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class OrderRoutingModule { }
