import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { CreateDiscountComponent } from './create-discount/create-discount.component';
import { ListDiscountComponent } from './list-discount/list-discount.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountComponent,
    children: [
      {
        path: 'registro',
        component: CreateDiscountComponent
      },
      {
        path: 'listar',
        component: ListDiscountComponent
      },
      {
        path: 'listar/editar/:id',
        component: EditDiscountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
