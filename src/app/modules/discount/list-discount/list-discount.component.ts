import { Component } from '@angular/core';
import { DiscountService } from '../service/discount.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDiscountComponent } from '../delete-discount/delete-discount.component';
import { URL_TIENDA } from 'src/app/config/config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss'],
})
export class ListDiscountComponent {
  discounts: any[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  start_date: any;
  end_date: any;
  isLoading$: any;

  constructor(
    public discountService: DiscountService,
    private toastr: ToastrService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listDiscounts();
    this.isLoading$ = this.discountService.isLoading$;
  }

  listDiscounts(page = 1) {
    let data = {
      search: this.search,
      start_date: this.start_date,
      end_date: this.end_date,
    };
    this.discountService
      .listDiscounts(data, page)
      .subscribe((res: any) => {
        // console.log(res);
        this.discounts = res.discounts.data;
        this.totalPages = res.total;
        this.currentPage = page;
      }, (err: any) => {
        this.toastr.error("Api Response - Cominiquese con el sistema", err.error.message);
      });
  }

  searchTo() {
    this.listDiscounts();
  }

  loadPage($event: any) {
    this.listDiscounts($event);
  }

  getNameTypeDiscount(discount_type: number) {
    switch (discount_type) {
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
  getNameTypeCampaign(type_campaign: number) {
    switch (type_campaign) {
      case 1:
        return 'Normal';
      case 2:
        return 'Flash';
      case 3:
        return 'Link';
      default:
        break;
    }
  }

  copyLink(discount: any) {
    var aux = document.createElement('input');
    aux.setAttribute('value', URL_TIENDA+"/descuentos/"+discount.code);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    this.toastr.info('Link copiado al portapapeles');
  }

  deleteDiscount(discount: any) {
    const modalRef = this.modalService.open(DeleteDiscountComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.discount = discount;

    modalRef.componentInstance.DiscountD.subscribe((res: any) => {
      let INDEX = this.discounts.findIndex(
        (item: any) => item.id == discount.id
      );
      if (INDEX != -1) {
        this.discounts.splice(INDEX, 1);
      }
    });
  }
}
