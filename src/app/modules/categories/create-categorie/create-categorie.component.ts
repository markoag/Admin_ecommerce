import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-categorie',
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss'],
})
export class CreateCategorieComponent {
  type_categorie: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  img_preview: string =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

  file_image: any = null;
  isLoading$: any;

  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];

  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();
  }

  config() {
    this.categorieService.configCategories().subscribe((res: any) => {
      this.categories_first = res.categories_first;
      this.categories_seconds = res.categories_seconds;
    });
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

  isLoadingView() {
    this.categorieService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.categorieService.isLoadingSubject.next(false);
    }, 50);
  }

  changeTypeCategorie(val: number) {
    this.type_categorie = val;
    this.categorie_third_id = '';
    this.categorie_second_id = '';
    this.categories_seconds_backups = [];
  }

  changeDepartament() {
    this.categories_seconds_backups = this.categories_seconds.filter(
      (item: any) => item.categorie_second_id == this.categorie_third_id
    );
    // console.log(this.categories_seconds_backups);
  }

  save() {
    if (!this.name || !this.position) {
      this.toastr.error('Validación', 'Los campos con * son obligatorios');
      return;
    }

    if (this.type_categorie == 1 && !this.icon) {
      this.toastr.error('Validación', 'El ícono es obligatorio');
      return;
    }

    if (this.type_categorie == 1 && !this.file_image) {
      this.toastr.error('Validación', 'Debe seleccionar una imagen');
      return;
    }

    if (this.type_categorie == 2 && !this.categorie_second_id) {
      this.toastr.error('Validación', 'Debe seleccionar un departamento');
      return;
    }

    if (
      this.type_categorie == 3 &&
      (!this.categorie_second_id || !this.categorie_third_id)
    ) {
      this.toastr.error(
        'Validación',
        'Debe seleccionar un departamento y una categoría'
      );
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    if (this.icon) {
      formData.append('icon', this.icon);
    }
    formData.append('position', this.position + '');
    formData.append('type_categorie', this.type_categorie + '');
    if (this.file_image) {
      formData.append('imagen', this.file_image);
    }
    if (this.categorie_second_id) {
      formData.append('categorie_second_id', this.categorie_second_id);
    }
    if (this.categorie_third_id) {
      formData.append('categorie_third_id', this.categorie_third_id);
    }

    this.categorieService.createCategories(formData).subscribe((res: any) => {
      console.log(res);

      if (res.message == 403) {
        this.toastr.error('Validación', 'El nombre de la categoría ya existe');
        return;
      }
      // Limpiar campos
      this.name = '';
      this.icon = '';
      this.position = 1;
      this.type_categorie = 1;
      this.file_image = null;
      this.img_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.categorie_second_id = '';
      this.categorie_third_id = '';

      this.toastr.success('Éxito','Categoría creada correctamente');
      this.config();
    });
  }
}
