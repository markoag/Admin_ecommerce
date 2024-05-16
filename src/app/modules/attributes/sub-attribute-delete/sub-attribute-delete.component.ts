import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AttributesService } from '../service/attributes.service';

@Component({
  selector: 'app-sub-attribute-delete',
  templateUrl: './sub-attribute-delete.component.html',
  styleUrls: ['./sub-attribute-delete.component.scss']
})
export class SubAttributeDeleteComponent {

  @Input() propertie: any;
  @Output() PropertieD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public attributeService: AttributesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.isLoading = this.attributeService.isLoading$;
  }

  delete() {
    this.attributeService.deleteProperties(this.propertie.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Propiedad eliminada correctamente');
      this.PropertieD.emit({message: 200});
      this.modal.close();
    });
  }
}
