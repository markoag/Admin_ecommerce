import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlidersComponent } from './sliders.component';
import { CreateSlidersComponent } from './create-sliders/create-sliders.component';
import { EditSlidersComponent } from './edit-sliders/edit-sliders.component';
import { ListSlidersComponent } from './list-sliders/list-sliders.component';

const routes: Routes = [
  {
    path: '',
    component: SlidersComponent,
    children: [
      {
        path: 'registro',
        component: CreateSlidersComponent,
      },
      {
        path: 'listar/editar/:id',
        component: EditSlidersComponent,
      },
      {
        path: 'listar',
        component: ListSlidersComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidersRoutingModule { }
