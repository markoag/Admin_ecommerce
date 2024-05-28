import { Component } from '@angular/core';
import { CouponService } from '../service/coupon.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss'],
})
export class EditCouponComponent {
  code: string = '';
  type_discount: number = 1;
  discount: number = 0;
  type_count: number = 1;
  num_use: number = 0;
  type_coupon: number = 1;
  product_id: any;
  categorie_id: any;
  brand_id: any;
  state: string = '1';
  COUPON_ID: string = '';
  COUPON: any = null;

  isLoading$: any;

  categories_first: any = [];
  products: any = [];
  brands: any = [];
  products_add: any = [];
  categories_add: any = [];
  brands_add: any = [];

  constructor(
    public couponService: CouponService,
    private toastr: ToastrService,
    public activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.couponService.isLoading$;
    this.config();

    this.activeRoute.params.subscribe((res: any) => {
      this.COUPON_ID = res.id;
    });

    this.couponService.showCoupon(this.COUPON_ID).subscribe((res: any) => {
      // console.log(res);
      this.COUPON = res.coupon;
      this.code = res.coupon.code;
      this.type_discount = res.coupon.type_discount;
      this.discount = res.coupon.discount;
      this.type_count = res.coupon.type_count;
      this.num_use = res.coupon.num_use;
      this.type_coupon = res.coupon.type_coupon;

      this.products_add = res.coupon.products;
      this.categories_add = res.coupon.categories;
      this.brands_add = res.coupon.brands;
    });
  }

  config() {
    this.couponService.configCoupons().subscribe((res: any) => {
      this.products = res.products;
      this.categories_first = res.categories;
      this.brands = res.brands;
    });
  }

  isLoadingView() {
    this.couponService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.couponService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeDiscount(value: number) {
    this.type_discount = value;
  }
  changeTypeCount(value: number) {
    this.type_count = value;
    this.num_use = 0;
  }
  changeTypeCoupon(value: number) {
    this.type_coupon = value;
    this.products_add = [];
    this.categories_add = [];
    this.brands_add = [];
    this.product_id = '';
    this.categorie_id = '';
    this.brand_id = '';
  }

  save() {
    // VALIDACIONES
    if (!this.code || !this.discount) {
      this.toastr.error('Validación', 'Debe completar todos los campos');
      return;
    }
    if (this.type_discount == 1 && this.discount > 50) {
      this.toastr.error('Validación', 'El descuento no puede ser mayor al 50%');
      return;
    }
    if (this.type_count == 2 && this.num_use == 0) {
      this.toastr.error(
        'Validación',
        'Debe ingresar la cantidad de usos para el cupón'
      );
      return;
    }
    if (this.type_coupon == 1 && this.products_add.length == 0) {
      this.toastr.error('Validación', 'Debe seleccionar al menos un producto');
      return;
    }
    if (this.type_coupon == 2 && this.categories_add.length == 0) {
      this.toastr.error(
        'Validación',
        'Debe seleccionar al menos una categoría'
      );
      return;
    }
    if (this.type_coupon == 3 && this.brands_add.length == 0) {
      this.toastr.error('Validación', 'Debe seleccionar al menos una marca');
      return;
    }

    let data = {
      code: this.code,
      type_discount: this.type_discount,
      discount: this.discount,
      type_count: this.type_count,
      num_use: this.num_use,
      type_coupon: this.type_coupon,
      product_selected: this.products_add,
      categorie_selected: this.categories_add,
      brand_selected: this.brands_add,
    };

    this.couponService
      .updateCoupons(this.COUPON_ID, data)
      .subscribe((res: any) => {
        // console.log(res);

        if (res.message == 403) {
          this.toastr.error('Validación', res.message_text);
          return;
        }

        this.toastr.success('Éxito', 'Cupón actualizado correctamente');
        this.config();
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
