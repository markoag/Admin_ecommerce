import { Component } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss'],
})
export class EditCategorieComponent {
  type_categorie: number = 1;

  name: string = '';
  icon: string = '';
  position: number = 1;
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  state: string = '1';
  img_preview: string =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';

  file_image: any = null;
  isLoading$: any;

  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];

  CATEGORIE_ID: string = '';
  CATEGORIE: any = null;

  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
    public activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.categorieService.isLoading$;
    this.config();

    this.activeRoute.params.subscribe((res: any) => {
      console.log(res);
      this.CATEGORIE_ID = res.id;
    });

    this.categorieService
      .showCategorie(this.CATEGORIE_ID)
      .subscribe((res: any) => {
        console.log(res);
        this.CATEGORIE = res.categorie;
        this.type_categorie = res.categorie.type_categorie;
        this.name = res.categorie.name;
        this.icon = res.categorie.icon;
        this.state = res.categorie.state;
        this.position = res.categorie.position;
        this.categorie_second_id = res.categorie.categorie_second_id;
        this.categorie_third_id = res.categorie.categorie_third_id;
        this.img_preview = res.categorie.image;
        this.categories_seconds_backups = this.categories_seconds.filter(
          (item: any) => item.categorie_second_id == this.categorie_third_id
        );
      });
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
    console.log(this.categories_seconds_backups);
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

    // if (this.type_categorie == 1 && !this.file_image) {
    //   this.toastr.error('Validación', 'Debe seleccionar una imagen');
    //   return;
    // }

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
    } else if (this.CATEGORIE.icon) {
      formData.append('icon', '');
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

    formData.append('state', this.state);

    this.categorieService
      .updateCategories(this.CATEGORIE_ID, formData)
      .subscribe((res: any) => {
        console.log(res);

        if (res.message == 403) {
          this.toastr.error(
            'Validación',
            'El nombre de la categoría ya existe'
          );
          return;
        }

        this.toastr.success('Éxito', 'Categoría actualizada');
        this.config();
      });
  }
}
