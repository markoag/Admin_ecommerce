import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
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

  constructor(
    public productService: ProductService,
    private toastr: ToastrService
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
    this.configAll();
  }

  configAll() {
    this.productService.configAll().subscribe((res: any) => {
      console.log(res);
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_seconds = res.categories_seconds;
      this.categories_thirds = res.categories_thirds;
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
    reader.onloadend = () => (this.img_preview = reader.result);
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
    // limpia el select de subcategorias
    this.categorie_third_id = '';
  }

  changeCategorie() {
    this.categories_thirds_backups = this.categories_thirds.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
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
      !this.file_image ||      
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
    formData.append('portada', this.file_image);
    if (this.summary) {
      formData.append('summary', this.summary);
    }    
    formData.append('description', this.description);
    formData.append('categorie_first_id', this.categorie_first_id);
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }
    formData.append('multiselect', JSON.stringify(this.selectedItems));

    this.productService.createProducts(formData).subscribe((res: any) => {
      console.log(res);

      if(res.message == 403) {
        this.toastr.error('Validación', res.message_text);
        return;
      }

      // Limpiar campos
      this.title = '';
      this.file_image = null;
      this.sku = '';
      this.price_pvp = 0;
      this.price_desc = 0;
      this.brand_id = '';
      this.summary = '';
      this.description = '';
      this.categorie_first_id = '';
      this.categorie_second_id = '';
      this.categorie_third_id = '';
      this.selectedItems = [];

      this.img_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

      this.toastr.success('Éxito', 'Producto creado correctamente');
    });
  }
}
