import { Component } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-sliders',
  templateUrl: './create-sliders.component.html',
  styleUrls: ['./create-sliders.component.scss'],
})
export class CreateSlidersComponent {
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';

  img_preview: string =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  file_image: any = null;
  type: any = 1;
  type_view: any = null;
  original_price: any = null;
  campaign_price: any = null;

  isLoading$: any;

  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.sliderService.isLoading$;
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
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  // Limpiar los campos cuando se cambie el tipo de slider
  changeType(type: any) {
    this.type = type;
    this.type_view = null;
    this.original_price = null;
    this.campaign_price = null;
  }
  changeTypeView(value: number) {
    this.type_view = value;
  }

  save() {
    if (!this.title || !this.subtitle || !this.file_image) {
      this.toastr.error('Validación', 'Los campos con * son obligatorios');
      return;
    }
    if (this.type == 2 && !this.type_view) {
      this.toastr.error('Validación', 'Debe seleccionar un tipo de vista');
      return;
    }
    if (this.type == 3 && (!this.original_price || !this.campaign_price)) {
      this.toastr.error(
        'Validación',
        'Los campos de precio original y precio de campaña son obligatorios'
      );
      return;
    }

    let formData = new FormData();
    formData.append('title', this.title);
    if (this.label) {
      formData.append('label', this.label);
    }
    formData.append('subtitle', this.subtitle);
    formData.append('imagen', this.file_image);
    formData.append('type', this.type);
    if (this.type == 2) {
      formData.append('type_view', this.type_view);
    }
    if(this.type == 3) {
      formData.append('original_price', this.original_price);
      formData.append('campaign_price', this.campaign_price);    
    }
    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.color) {
      formData.append('color', this.color);
    }

    this.sliderService.createSliders(formData).subscribe((res: any) => {
      console.log(res);

      // Limpiar campos
      this.title = '';
      this.label = '';
      this.subtitle = '';
      this.link = '';
      this.color = '';
      this.file_image = null;
      this.img_preview =
        'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
      this.type = 1;
      this.type_view = null;
      this.original_price = null;
      this.campaign_price = null;

      this.toastr.success('Éxito', 'Slider creado correctamente');
    });
  }
}
