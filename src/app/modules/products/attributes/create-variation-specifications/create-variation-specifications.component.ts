import { Component } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-variation-specifications',
  templateUrl: './create-variation-specifications.component.html',
  styleUrls: ['./create-variation-specifications.component.scss'],
})
export class CreateVariationSpecificationsComponent {
  title: string = '';
  sku: string = '';
  word: string = '';
  isLoading$: any;

  specification_attribute_id: string = '';
  variations_attribute_id: string = '';
  type_attribute_specification: number = 1;
  type_attribute_variation: number = 3;
  attributes: any = [];

  dropdownList: any = [];
  dropdownListVariations: any = [];
  dropdownSettings: IDropdownSettings = {};
  isShowMultiSelect: boolean = false;
  PRODUCT_ID: any = '';
  PRODUCT_SELECTED: any;

  campo_e1: string = '';
  campo_e2: number = 0;
  campo_e3: any;
  selectedItems: any = []; //campo_4
  campo_v1: any;
  selectedItemsVariations: any = []; //campo_2
  price_variation: number = 0;
  stock_variation: number = 0;

  attributes_specifications: any = [];
  properties: any = [];
  propertie_id: any = null;
  value: any = null;
  specifications: any = [];

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    public modalService: NgbModal
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

    this.activeRoute.params.subscribe((res: any) => {
      this.PRODUCT_ID = res.id;
    });

    this.showProduct();
    this.configAll();
    this.listSpecification();
  }

  configAll() {
    this.attributeService.configAll().subscribe((res: any) => {
      console.log(res);
      this.attributes_specifications = res.attributes_specifications;
    });
  }

  listSpecification() {
    this.attributeService
      .listSpecification(this.PRODUCT_ID)
      .subscribe((res: any) => {
        console.log(res);
        this.specifications = res.specifications;
      });
  }

  showProduct() {
    this.attributeService.showProduct(this.PRODUCT_ID).subscribe((res: any) => {
      console.log(res);

      this.PRODUCT_SELECTED = res.product;
      this.title = res.product.title;
      this.sku = res.product.sku;
    });
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

  addItems() {
    this.isShowMultiSelect = true;
    let time_date = new Date().getTime();
    this.dropdownList.push({ item_id: time_date, item_text: this.word });
    this.selectedItems.push({ item_id: time_date, item_text: this.word });
    setTimeout(() => {
      this.word = '';
      this.isShowMultiSelect = false;
      this.isLoadingView();
    }, 100);
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  isLoadingView() {
    this.attributeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.attributeService.isLoadingSubject.next(false);
    }, 50);
  }

  save() {
    
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
      product_id: this.PRODUCT_ID,
      attribute_id: this.specification_attribute_id,
      propertie_id: this.propertie_id,
      value: this.value,
    };

    this.attributeService.createSpecification(data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        this.toastr.error('Validación', res.message_text);
      } else {
        this.toastr.success('Éxito', 'Especificación creada correctamente');
        this.specifications.unshift(res.specification);
        this.value = null;
        this.propertie_id = null;
        this.specification_attribute_id = '';
      }
    });
  }

  getValueAttribute(attribute_special: any) {
    console.log(attribute_special);      
    if (attribute_special.propertie_id) {
      return attribute_special.propertie.name;
    }     
    
    if (attribute_special.value) {
      if (attribute_special.attribute.type_attribute == 4) {
        let value = JSON.parse(attribute_special.value);
        return value.map((item: any) => item.name).join(', ');       
      }
      return attribute_special.value;
    }

    return '---';
  }
}
