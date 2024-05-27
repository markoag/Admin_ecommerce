import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttributesService } from '../../service/attributes.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-variation-specifications',
  templateUrl: './delete-variation-specifications.component.html',
  styleUrls: ['./delete-variation-specifications.component.scss']
})
export class DeleteVariationSpecificationsComponent {

  @Input() specification: any;
  @Input() is_variation: any;

  @Output() EspecificationD: EventEmitter<any> = new EventEmitter();
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
    if (this.is_variation) {
      this.deleteVariation();
    } else {
      this.deleteSpecification();
    }
  }
  deleteSpecification() {
    this.attributeService.deleteSpecification(this.specification.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Especificación eliminada correctamente');
      this.EspecificationD.emit({message: 200});
      this.modal.close();
    });
  }
  deleteVariation() {
    this.attributeService.deleteVariation(this.specification.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Variación eliminada correctamente');
      this.EspecificationD.emit({message: 200});
      this.modal.close();
    });
  }
}
