import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../service/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteImageAddComponent } from './delete-image-add/delete-image-add.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  title: string = '';
  sku: string = '';
  summary: string = '';
  price_pvp: number = 0;
  price_desc: number = 0;
  description: any = '<p>Hello, world!</p>';
  img_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  brand_id: string = '';
  brands: any = [];
  state: number = 1;
  stock: number = 0;
  word: string = '';

  isLoading$: any;

  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  isShowMultiSelect: boolean = false;
  PRODUCT_ID: any = '';
  PRODUCT_SELECTED: any;
  imagen_add: any = null;
  img_add_preview: any =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  images_files: any = [];

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}

  ngOnInit() {
    this.isLoading$ = this.productService.isLoading$;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.activeRoute.params.subscribe((res: any) => {
      this.PRODUCT_ID = res.id;
    });

    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((res: any) => {
      console.log(res);
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_seconds = res.categories_seconds;
      this.categories_thirds = res.categories_thirds;
      this.showProduct();
    });
  }

  showProduct() {
    this.productService.showProduct(this.PRODUCT_ID).subscribe((res: any) => {
      console.log(res);

      this.PRODUCT_SELECTED = res.product;
      this.title = res.product.title;
      this.sku = res.product.sku;
      this.summary = res.product.summary;
      this.state = res.product.state;
      this.stock = res.product.stock;
      this.price_pvp = res.product.price_pvp;
      this.price_desc = res.product.price_desc;
      this.description = res.product.description;
      this.img_preview = res.product.image;
      this.brand_id = res.product.brand_id;
      this.categorie_first_id = res.product.categorie_first_id;
      this.categorie_second_id = res.product.categorie_second_id;
      this.categorie_third_id = res.product.categorie_third_id;
      this.selectedItems = res.product.selectedItems;
      this.images_files = res.product.images;

      this.changeDepartament();
      this.changeCategorie();
      this.dropdownList = res.product.tags;
      this.selectedItems = res.product.tags;
    });
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

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error(
        'Validación',
        'El archivo seleccionado no es una imagen'
      );
      return;
    }
    this.file_image = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => (this.img_preview = reader.result as string);
    this.isLoadingView();
  }
  processFileE($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error(
        'Validación',
        'El archivo seleccionado no es una imagen'
      );
      return;
    }
    this.imagen_add = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_add);
    reader.onloadend = () => (this.img_add_preview = reader.result);
    this.isLoadingView();
  }

  isLoadingView() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  // Filtrar Categorias por Departamento
  changeDepartament() {
    this.categories_seconds_backups = this.categories_seconds.filter(
      (item: any) => item.categorie_second_id == this.categorie_first_id
    );
  }

  changeCategorie() {
    this.categories_thirds_backups = this.categories_thirds.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
  }

  addImagen() {
    if (!this.imagen_add) {
      this.toastr.error('Validación', 'Necesita subir una imagen');
      return;
    }
    let formData = new FormData();
    formData.append('imagen_add', this.imagen_add);
    formData.append('product_id', this.PRODUCT_ID);
    this.productService.imagenAdd(formData).subscribe((res: any) => {
      console.log(res);
      this.toastr.success('Éxito', 'Imagen agregada correctamente');
      this.images_files.unshift(res.image);
      this.imagen_add = null;
      this.img_add_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
    });
  }
  removeImages(id: number) {
    const modalRef = this.modalService.open(DeleteImageAddComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.id = id;

    modalRef.componentInstance.ImageD.subscribe((res: any) => {
      let INDEX = this.images_files.findIndex((item: any) => item.id == id);
      if (INDEX != -1) {
        this.images_files.splice(INDEX, 1);
      }
    });
  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  save() {
    if (
      !this.title ||
      !this.sku ||
      !this.price_pvp ||
      !this.price_desc ||
      !this.brand_id ||
      !this.description ||
      !this.categorie_first_id ||
      this.selectedItems == 0
    ) {
      this.toastr.error('Validación', 'Los campos con * son obligatorios');
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    formData.append('sku', this.sku);
    formData.append('price_pvp', this.price_pvp + '');
    formData.append('price_desc', this.price_desc + '');
    formData.append('brand_id', this.brand_id);
    formData.append('stock', this.stock + '');
    if (this.file_image) {
      formData.append('portada', this.file_image);
    }
    formData.append('summary', this.summary);
    formData.append('description', this.description);
    formData.append('categorie_first_id', this.categorie_first_id);
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }
    formData.append('multiselect', JSON.stringify(this.selectedItems));
    formData.append('state', this.state + '');

    this.productService
      .updateProducts(this.PRODUCT_ID, formData)
      .subscribe((res: any) => {
        console.log(res);

        if (res.message == 403) {
          this.toastr.error('Validación', res.message_text);
          return;
        }

        this.file_image = null;

        this.toastr.success('Éxito', 'Producto actualizado correctamente');
      });
  }
}
