import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent {

  @Output() BrandE: EventEmitter<any> = new EventEmitter();
  @Input() brand: any;

  name: string = '';  
  isLoading$: any;
  state: number = 1;

  constructor(
    public brandService: BrandService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.brandService.isLoading$;
    this.name = this.brand.name;
    this.state = this.brand.state;
  }

  store() {
    if (!this.name) {
      this.toastr.error('Validación','Todos los campos son requeridos');
      return;
    }
    let data = {
      name: this.name,      
      state: this.state,
    };
    this.brandService.updateBrands(this.brand.id, data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        this.toastr.error('Validación','El nombre de la marca ya existe');
        return;
      }
      this.BrandE.emit(res.brand);
      this.toastr.success('Éxito','Marca actualizada correctamente');
      this.modal.close();
    })
  }
}
