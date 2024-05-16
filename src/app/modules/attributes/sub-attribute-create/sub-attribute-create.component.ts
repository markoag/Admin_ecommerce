import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';
import { SubAttributeDeleteComponent } from '../sub-attribute-delete/sub-attribute-delete.component';

@Component({
  selector: 'app-sub-attribute-create',
  templateUrl: './sub-attribute-create.component.html',
  styleUrls: ['./sub-attribute-create.component.scss']
})
export class SubAttributeCreateComponent {

  // @Output() AttributeC: EventEmitter<any> = new EventEmitter();
  @Input() attribute: any;
  @Input() properties: any = [];

  type_attribute: number = 1; 
  isLoading$: any;
  
  name: string = '';
  color: any;
  type_action: number = 1;

  constructor(
    public attributeService: AttributesService,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    public modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.attributeService.isLoading$;
    this.properties = this.attribute.properties;
  }

  store() {    
    if (!this.name) {
      this.toastr.error('Validación','Todos los campos son requeridos');
      return;
    }
    if (this.type_action == 2 && !this.color) {
      this.toastr.error('Validación','Seleccione un color');
      return;
    }
    let data = {
      name: this.name,
      code: this.color,
      attribute_id: this.attribute.id,
      state: 1,
    };
    this.attributeService.createProperties(data).subscribe((res: any) => {
      console.log(res);
      if (res.message == 403) {
        this.toastr.error('Validación','El nombre de la propiedad ya existe');
        return;
      }
      this.properties.unshift(res.propertie);
      this.toastr.success('Éxito','Propiedad creada correctamente');
      // this.modal.close();
    })
  }

  delete(propertie: any) {
    const modalRef = this.modalService.open(SubAttributeDeleteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.propertie = propertie;

    modalRef.componentInstance.PropertieD.subscribe((res: any) => {
      let INDEX = this.properties.findIndex((item: any) => item.id == propertie.id);
      if (INDEX != -1) {
        this.properties.splice(INDEX, 1);
      }
    });
  }
}
