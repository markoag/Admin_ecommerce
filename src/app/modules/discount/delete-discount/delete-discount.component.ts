import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiscountService } from '../service/discount.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-discount',
  templateUrl: './delete-discount.component.html',
  styleUrls: ['./delete-discount.component.scss']
})
export class DeleteDiscountComponent {

  @Input() discount: any;
  @Output() DiscountD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public discountService: DiscountService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.discountService.isLoading$;
  }

  delete() {
    this.discountService
      .deleteDiscounts(this.discount.id)
      .subscribe((res: any) => {
        if (res.message == 403) {
          this.toastr.error('Validación', res.message_text);
        } else {
          this.toastr.success('Éxito', 'Campaña de descuento eliminada correctamente');
          this.DiscountD.emit({ message: 200 });
          this.modal.close();
        }
      });
  }
}
