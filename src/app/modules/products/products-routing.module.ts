import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateVariationSpecificationsComponent } from './attributes/create-variation-specifications/create-variation-specifications.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'registro',
        component: CreateProductComponent,
      },
      {
        path: 'listar/editar/:id',
        component: EditProductComponent,
      },
      {
        path: 'listar',
        component: ListProductComponent,
      },
      {
        path: 'listar/variacion-especificacion/:id',
        component: CreateVariationSpecificationsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
