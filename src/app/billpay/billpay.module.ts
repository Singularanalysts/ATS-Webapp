import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillpayRoutingModule } from './billpay-routing.module';
import { PurchaseOrderInfoComponent } from './purchase-order-list/purchase-order-info/purchase-order-info.component';

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    BillpayRoutingModule,
    PurchaseOrderInfoComponent
  ]
})
export class BillpayModule { }