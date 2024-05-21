import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-image-add',
  templateUrl: './delete-image-add.component.html',
  styleUrls: ['./delete-image-add.component.scss']
})
export class DeleteImageAddComponent {

  @Input() id: any;
  @Output() ImageD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public productImageService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.isLoading = this.productImageService.isLoading$;
  }

  delete() {
    this.productImageService.deleteImageProduct(this.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Imagen eliminada correctamente');
      this.ImageD.emit({message: 200});
      this.modal.close();
    });
  }
}
