import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

const route: Routes = [
    {
        path: "all-files",
        loadComponent: () => import('./all-files/all-files.component').then(m => m.AllFilesComponent)
    },
]
@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})
export class DocsyncRoutingModule { }