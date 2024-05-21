import { Component, EventEmitter, Output } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent {

  @Output() BrandC: EventEmitter<any> = new EventEmitter();

  name: string = '';  
  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Validación','Todos los campos son requeridos');
      return;
    }
    let data = {
      name: this.name,      
      state: 1,
    };
    this.brandService.createBrands(data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        this.toastr.error('Validación','El nombre de la marca ya existe');
        return;
      }
      this.BrandC.emit(res.brand);
      this.toastr.success('Éxito','Marca creada correctamente');
      this.modal.close();
    })
  }
}
