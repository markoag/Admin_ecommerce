import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../../service/attributes.service';
import { EditNestedVariationComponent } from '../edit-nested-variation/edit-nested-variation.component';
import { DeleteVariationSpecificationsComponent } from '../delete-variation-specifications/delete-variation-specifications.component';

@Component({
  selector: 'app-create-nested-variation',
  templateUrl: './create-nested-variation.component.html',
  styleUrls: ['./create-nested-variation.component.scss'],
})
export class CreateNestedVariationComponent {
  @Input() variation: any;
  @Input() attributes_variations: any = [];

  isLoading$: any;

  specification_attribute_id: string = '';
  type_attribute_specification: number = 2;
  variations_attribute_id: string = '';
  type_attribute_variation: number = 3;
  attributes: any = [];
  precio_add: number = 0;
  stock_add: number = 0;

  attributes_specifications: any = [];
  properties: any = [];
  propertie_id: any = null;
  value_add: any = null;
  specifications: any = [];
  variations: any = [];

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.listVariationNested();
  }

  listVariationNested() {
    setTimeout(() => {
    this.attributeService
      .listVariationNested(this.variation.product_id, this.variation.id)
      .subscribe((resp: any) => {
        this.variations = resp.variations;
      });
    }, 0);
  }

  changeVariations() {
    this.value_add = null;
    this.propertie_id = null;
    let ATTRIBUTE = this.attributes_variations.find(
      (item: any) => item.id == this.variations_attribute_id
    );
    if (ATTRIBUTE) {
      this.type_attribute_variation = ATTRIBUTE.type_attribute;
      if (
        this.type_attribute_variation == 3 ||
        this.type_attribute_variation == 4
      ) {
        this.properties = ATTRIBUTE.properties;
      } else {
        this.properties = [];
      }
    } else {
      this.type_attribute_variation = 0;
      this.properties = [];
    }
  }

  getValueAttribute(attribute_special: any) {
    // console.log(attribute_special);
    if (attribute_special.propertie_id) {
      return attribute_special.propertie.name;
    }
    if (attribute_special.value_add) {
      if (attribute_special.attribute.type_attribute == 4) {
        let value = JSON.parse(attribute_special.value_add);
        return value.map((item: any) => item.name).join(', ');
      }
      return attribute_special.value_add;
    }

    return '---';
  }

  saveVariation() {
    if (
      !this.variations_attribute_id ||
      (!this.propertie_id && !this.value_add)
    ) {
      this.toastr.error('Validación', 'Llene los campos necesarios');
      return;
    }
    if (this.precio_add < 0) {
      this.toastr.error(
        'Validación',
        'El valor del precio debe ser mayor o igual'
      );
      return;
    }
    if (this.stock_add <= 0) {
      this.toastr.error('Validación', 'El stock debe ser mayor a 0');
      return;
    }
    let data = {
      product_id: this.variation.product_id,
      attribute_id: this.variations_attribute_id,
      propertie_id: this.propertie_id,
      value_add: this.value_add,
      price_add: this.precio_add,
      stock: this.stock_add,
      product_variation_id: this.variation.id,
    };

    this.attributeService.createVariationNested(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toastr.error('Validación', resp.message_text);
      } else {
        this.toastr.success(
          'Exito',
          'Se registro la variación anidada correctamente'
        );
        this.variations.unshift(resp.variation);
        this.value_add = null;
        this.propertie_id = null;
        this.variations_attribute_id = '';
        this.precio_add = 0;
        this.stock_add = 0;
      }
    });
  }

  editVariation(variation: any) {
    const modal = this.modalService.open(EditNestedVariationComponent, {
      centered: true,
      size: 'md',
    });
    modal.componentInstance.specification = variation;    
    modal.componentInstance.attributes_variations = this.attributes_variations;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.EspecificationE.subscribe((edit: any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex(
        (item: any) => item.id == edit.variation.id
      );
      if (INDEX != -1) {
        this.variations[INDEX] = edit.variation;
      }
    });
  }
  deleteVariation(variation: any) {
    const modal = this.modalService.open(DeleteVariationSpecificationsComponent, {
      centered: true,
      size: 'md',
    });
    modal.componentInstance.specification = variation;
    modal.componentInstance.is_variation = 1;

    modal.componentInstance.EspecificationD.subscribe((edit: any) => {
      console.log(edit);
      let INDEX = this.variations.findIndex(
        (item: any) => item.id == variation.id
      );
      if (INDEX != -1) {
        this.variations.splice(INDEX, 1);
      }
    });
  }
}
