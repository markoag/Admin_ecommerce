import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DeleteImageAddComponent } from './edit-product/delete-image-add/delete-image-add.component';
import { CreateVariationSpecificationsComponent } from './attributes/create-variation-specifications/create-variation-specifications.component';
import { EditVariationSpecificationsComponent } from './attributes/edit-variation-specifications/edit-variation-specifications.component';
import { DeleteVariationSpecificationsComponent } from './attributes/delete-variation-specifications/delete-variation-specifications.component';
import { DeleteNestedVariationComponent } from './attributes/delete-nested-variation/delete-nested-variation.component';
import { CreateNestedVariationComponent } from './attributes/create-nested-variation/create-nested-variation.component';
import { EditNestedVariationComponent } from './attributes/edit-nested-variation/edit-nested-variation.component';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ListProductComponent,
    DeleteProductComponent,
    DeleteImageAddComponent,
    CreateVariationSpecificationsComponent,
    EditVariationSpecificationsComponent,
    DeleteVariationSpecificationsComponent,
    DeleteNestedVariationComponent,
    CreateNestedVariationComponent,
    EditNestedVariationComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    CKEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ProductsModule { }
