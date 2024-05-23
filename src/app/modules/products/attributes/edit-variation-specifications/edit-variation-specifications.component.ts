import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-variation-specifications',
  templateUrl: './edit-variation-specifications.component.html',
  styleUrls: ['./edit-variation-specifications.component.scss'],
})
export class EditVariationSpecificationsComponent {
  @Output() EspecificationE: EventEmitter<any> = new EventEmitter();
  @Input() specification: any;

  isLoading$: any;
  
  specification_attribute_id: string = '';
  variations_attribute_id: string = '';
  type_attribute_specification: number = 2;
  type_attribute_variation: number = 3;
  attributes: any = [];

  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {};
  selectedItems: any = []; //campo_4

  @Input() attributes_specifications: any = [];
  properties: any = [];
  propertie_id: any = null;
  value: any = null;
  specifications: any = [];

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.specification_attribute_id = this.specification.attribute_id;
    setTimeout(() => {
      this.changeSpecifications();
      setTimeout(() => {
        this.propertie_id = this.specification.propertie_id ? this.specification.propertie_id : null;
        if (this.specification.attribute.type_attribute == 4) {
          this.selectedItems = this.specification.value ? JSON.parse(this.specification.value) : [];          
        } else {
          this.value = this.specification.value ? this.specification.value : null;
        }
      }, 25);
    }, 50);
  }

  store() {
   if(this.type_attribute_specification == 4 && this.selectedItems.length == 0){
      this.toastr.error('Validación', 'Seleccione al menos una propiedad');
      return;
    }
    if(this.selectedItems.length > 0){
      this.value = JSON.stringify(this.selectedItems);
    }
    if (
      !this.specification_attribute_id ||
      (!this.propertie_id && !this.value)
    ) {
      this.toastr.error('Validación', 'Llene los campos requeridos');
      return;
    }

    let data = {   
      product_id: this.specification.product_id,   
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value: this.value,
    };

    this.attributeService
      .updateSpecification(this.specification.id, data)
      .subscribe((res: any) => {
        console.log(res);
        if (res.message == 403) {
        this.toastr.error('Validación', res.message_text);
      } else {
        this.toastr.success('Éxito', 'Especificación actualizada correctamente');
        this.EspecificationE.emit(res);
        this.modal.close();
      }
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  changeSpecifications() {
    this.value = null;
    this.propertie_id = null;
    this.selectedItems = [];
    let ATTRIBUTE = this.attributes_specifications.find(
      (item: any) => item.id == this.specification_attribute_id
    );    
    if (ATTRIBUTE) {
      this.type_attribute_specification = ATTRIBUTE.type_attribute;
      if (
        this.type_attribute_specification == 3 ||
        this.type_attribute_specification == 4
      ) {
        this.properties = ATTRIBUTE.properties;
        this.dropdownList = ATTRIBUTE.properties;
      } else {
        this.properties = [];
        this.dropdownList = [];
      }
    } else {
      this.type_attribute_specification = 0;
      this.properties = [];
      this.dropdownList = [];
    }
  }
}
