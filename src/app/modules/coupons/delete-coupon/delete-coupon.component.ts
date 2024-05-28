import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CouponService } from '../service/coupon.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-coupon',
  templateUrl: './delete-coupon.component.html',
  styleUrls: ['./delete-coupon.component.scss']
})
export class DeleteCouponComponent {

  @Input() coupon: any;
  @Output() CouponD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public couponService: CouponService,
    private toastr: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.couponService.isLoading$;
  }

  delete() {
    this.couponService
      .deleteCoupons(this.coupon.id)
      .subscribe((res: any) => {
        if (res.message == 403) {
          this.toastr.error('Validación', res.message_text);
        } else {
          this.toastr.success('Éxito', 'Cupón eliminado correctamente');
          this.CouponD.emit({ message: 200 });
          this.modal.close();
        }
      });
  }
}
