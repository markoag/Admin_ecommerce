import { Component } from '@angular/core';
import { CouponService } from '../service/coupon.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCouponComponent } from '../delete-coupon/delete-coupon.component';

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss']
})
export class ListCouponComponent {

  coupons: any[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  isLoading$: any;

  constructor(
    public couponService: CouponService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {    
    this.listCoupons();
    this.isLoading$ = this.couponService.isLoading$;
  }

  listCoupons(page = 1) {
    this.couponService
      .listCoupons(this.search, page)
      .subscribe((res: any) => {
        console.log(res);
        this.coupons = res.coupons.data;
        this.totalPages = res.total;
        this.currentPage = page;
      });
  }

  searchTo() {
    this.listCoupons();
  }

  loadPage($event: any) {
    this.listCoupons($event);
  } 

  getNameTypeCoupon(type_coupon: number) {
    switch (type_coupon) {      
      case 1:
        return 'Productos';
      case 2:
        return 'Categorías';
      case 3:
        return 'Marcas';
      default:
        break;
    }
  }

  deleteCoupon(coupon: any) {
    const modalRef = this.modalService.open(DeleteCouponComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.coupon = coupon;

    modalRef.componentInstance.CouponD.subscribe((res: any) => {
      let INDEX = this.coupons.findIndex((item: any) => item.id == coupon.id);
      if (INDEX != -1) {
        this.coupons.splice(INDEX, 1);
      }
    });
  }
}
