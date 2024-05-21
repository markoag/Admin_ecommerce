import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductService } from '../service/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent {

  @Input() product: any;
  @Output() ProductD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.isLoading = this.productService.isLoading$;
  }

  delete() {
    this.productService.deleteProducts(this.product.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Producto eliminado correctamente');
      this.ProductD.emit({message: 200});
      this.modal.close();
    });
  }
}
