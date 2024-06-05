import { Component } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-sliders',
  templateUrl: './edit-sliders.component.html',
  styleUrls: ['./edit-sliders.component.scss'],
})
export class EditSlidersComponent {
  title: string = '';
  label: string = '';
  subtitle: string = '';
  link: string = '';
  color: string = '';
  state: any = 1;

  img_preview: string =
    'https://preview.keenthemes.com/metronic8/demo1/assets/media/svg/illustrations/easy/2.svg';
  img_preview2: string = '';
  file_image: any = null;
  file_image2: any = null;
  type: any = 1;
  type_view: any = null;
  original_price: any = null;
  campaign_price: any = null;

  isLoading$: any;
  slider_id: string = '';

  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService,
    public activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading$ = this.sliderService.isLoading$;
    this.activedRoute.params.subscribe((res: any) => {
      this.slider_id = res.id;
    });

    this.sliderService.showSlider(this.slider_id).subscribe((res: any) => {
      console.log(res);

      this.title = res.slider.title;
      this.label = res.slider.label;
      this.type = res.slider.type;
      this.type_view = res.slider.type_view;
      this.subtitle = res.slider.subtitle;
      this.link = res.slider.link;
      this.color = res.slider.color;
      this.state = res.slider.state;
      this.original_price = res.slider.original_price;
      this.campaign_price = res.slider.campaign_price;
      this.img_preview = res.slider.image;
      this.img_preview2 = res.slider.image2;
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
  processFile2($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error(
        'Validación',
        'El archivo seleccionado no es una imagen'
      );
      return;
    }
    this.file_image2 = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image2);
    reader.onloadend = () => (this.img_preview2 = reader.result as string);
    this.isLoadingView();
  }

  isLoadingView() {
    this.sliderService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.sliderService.isLoadingSubject.next(false);
    }, 50);
  }

  changeType(type: any) {
    this.type = type;
    // this.type_view = null;
    // this.original_price = null;
    // this.campaign_price = null;
  }

  changeTypeView(value: number) {
    this.type_view = value;
  }

  save() {
    if (!this.title || !this.subtitle) {
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
    if (this.file_image) {
      formData.append('imagen', this.file_image);
    }
    formData.append('state', this.state);
    formData.append('type', this.type);
    if (this.type == 1) {
      formData.append('type_view', '');
      formData.append('original_price', '');
      formData.append('campaign_price', '');
      formData.append('imagen2', '');
    } else if (this.type == 2) {
      formData.append('type_view', this.type_view);
      formData.append('original_price', '');
      formData.append('campaign_price', '');
      formData.append('imagen2', '');
    } else if (this.type == 3) {
      formData.append('type_view', '');
      formData.append('original_price', this.original_price);
      formData.append('campaign_price', this.campaign_price);
      if (this.file_image2) {
        formData.append('imagen2', this.file_image2);
      }
    }
    if (this.link) {
      formData.append('link', this.link);
    }
    if (this.color) {
      formData.append('color', this.color);
    }    

    this.sliderService
      .updateSliders(this.slider_id, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.toastr.success('Éxito', 'Slider actualizado correctamente');
      });
  }
}
