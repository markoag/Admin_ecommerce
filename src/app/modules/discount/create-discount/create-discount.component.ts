import { Component } from '@angular/core';
import { DiscountService } from '../service/discount.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.scss'],
})
export class CreateDiscountComponent {
  type_discount: number = 1;
  discount: number = 0;
  type_campaign: number = 1;
  discount_type: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  start_date: any;
  end_date: any;

  isLoading$: any;

  categories_first: any = [];
  products: any = [];
  brands: any = [];
  products_add: any = [];
  categories_add: any = [];
  brands_add: any = [];

  constructor(
    public discountService: DiscountService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.discountService.isLoading$;
    this.config();
  }

  config() {
    this.discountService.configDiscounts().subscribe((res: any) => {
      this.products = res.products;
      this.categories_first = res.categories;
      this.brands = res.brands;
    });
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCampaign(value: number) {
    this.type_campaign = value;
  }
  changeTypeCoupon(value: number) {
    this.discount_type = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = '';
    this.categorie_id = '';
    this.brand_id = '';
  }

  save() {
    // VALIDACIONES
    if (!this.discount || !this.start_date || !this.end_date) {
      this.toastr.error('Validación', 'Debe completar todos los campos requeridos');
      return;
    }
    if (this.type_discount == 1 && this.discount > 50) {
      this.toastr.error('Validación', 'El descuento no puede ser mayor al 50%');
      return;
    }
    if (this.discount_type == 1 && this.products_add.length == 0) {
      this.toastr.error('Validación', 'Debe seleccionar al menos un producto');
      return;
    }
    if (this.discount_type == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validación',
        'Debe seleccionar al menos una categoría'
      );
      return;
    }
    if (this.discount_type == 3 && this.brands_add.length == 0) {
      this.toastr.error('Validación', 'Debe seleccionar al menos una marca');
      return;
    }

    let data = {
      type_discount: this.type_discount,
      discount: this.discount,
      discount_type: this.discount_type,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
      start_date: this.start_date,
      end_date: this.end_date,
      type_campaign: this.type_campaign,
    };

    this.discountService.createDiscounts(data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        this.toastr.error('Validación', res.message_text);
      } else {
        this.toastr.success('Éxito', 'Campaña de descuento creada correctamente');
        // Limpiar formulario
        this.type_discount = 1;
        this.discount = 0;
        this.discount_type = 1;        
        this.type_campaign = 1;
        this.start_date = '';
        this.end_date = '';
        this.products_add = [];
        this.categories_add = [];
        this.brands_add = [];
      }
    });
  }

  addProduct() {
    if (!this.product_id) {
      this.toastr.error('Validación', 'Debe seleccionar un producto');
      return;
    }
    // validar si ya existe
    if (
      this.products_add.find((product: any) => product.id == this.product_id)
    ) {
      this.toastr.error('Validación', 'El producto ya fue agregado');
      return;
    }

    let DATA = this.products.find(
      (product: any) => product.id == this.product_id
    );

    if (DATA) {
      this.products_add.push(DATA);
      this.product_id = '';
    }
  }
  addCategory() {
    if (!this.categorie_id) {
      this.toastr.error('Validación', 'Debe seleccionar una categoría');
      return;
    }
    // validar si ya existe
    if (
      this.categories_add.find(
        (category: any) => category.id == this.categorie_id
      )
    ) {
      this.toastr.error('Validación', 'La categoría ya fue agregada');
      return;
    }

    let DATA = this.categories_first.find(
      (category: any) => category.id == this.categorie_id
    );

    if (DATA) {
      this.categories_add.push(DATA);
      this.categorie_id = '';
    }
  }
  addBrand() {
    if (!this.brand_id) {
      this.toastr.error('Validación', 'Debe seleccionar una marca');
      return;
    }
    // validar si ya existe
    if (this.brands_add.find((brand: any) => brand.id == this.brand_id)) {
      this.toastr.error('Validación', 'La marca ya fue agregada');
      return;
    }

    let DATA = this.brands.find((brand: any) => brand.id == this.brand_id);

    if (DATA) {
      this.brands_add.push(DATA);
      this.brand_id = '';
    }
  }

  removeProduct(product: any) {
    let INDEX = this.products_add.findIndex(
      (item: any) => item.id == product.id
    );
    if (INDEX != -1) {
      this.products_add.splice(INDEX, 1);
    }
  }
  removeCategorie(categorie: any) {
    let INDEX = this.categories_add.findIndex(
      (item: any) => item.id == categorie.id
    );
    if (INDEX != -1) {
      this.categories_add.splice(INDEX, 1);
    }
  }
  removeBrand(brand: any) {
    let INDEX = this.brands_add.findIndex((item: any) => item.id == brand.id);
    if (INDEX != -1) {
      this.brands_add.splice(INDEX, 1);
    }
  }
}
