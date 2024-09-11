import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

const route: Routes = [
    {
        path: "purchase-orders",
        loadComponent: () => import('./purchase-order-list/purchase-order-list.component').then(m => m.PurchaseOrderListComponent)
    },
    {
        path: "invoices",
        loadComponent: () => import('./invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
    },
    {
        path: "receipts",
        loadComponent: () => import('./receipt-list/receipt-list.component').then(m => m.ReceiptListComponent)
    }
]

@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})
export class BillpayRoutingModule { }