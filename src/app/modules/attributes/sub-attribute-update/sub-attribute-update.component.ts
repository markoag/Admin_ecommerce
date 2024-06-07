import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../service/attributes.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-attribute-update',
  templateUrl: './sub-attribute-update.component.html',
  styleUrls: ['./sub-attribute-update.component.scss'],
})
export class SubAttributeUpdateComponent {
  @Output() PropertyE: EventEmitter<any> = new EventEmitter();

  // @Input() attribute: any;
  @Input() propertie: any;

  // type_attribute: number = 1;
  isLoading$: any;

  name: string = '';
  color: any;
  type_action: number = 1;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.name = this.propertie.name;
    this.color = this.propertie.code;
    this.type_action = this.propertie.code ? 2 : 1;
    // console.log(this.propertie);
  }

  store() {
    if (!this.name) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }
    if (this.type_action == 2 && !this.color) {
      this.toastr.error('Validación', 'Seleccione un color');
      return;
    }

    let data = {
      name: this.name,
      type_action: this.type_action == 1 ? this.color = null : this.color = this.color,
      code: this.color,
    };    
    this.attributeService
      .updateProperties(this.propertie.id, data)
      .subscribe((res: any) => {
        // console.log(res);
        if (res.message == 403) {
          this.toastr.error(
            'Validación',
            'El nombre de la propiedad ya existe'
          );
          return;
        }
        this.PropertyE.emit(res);
        this.toastr.success('Éxito', 'Propiedad actualizada correctamente');
        this.modal.close();
      });
  }
}
