import { Component } from '@angular/core';
import { SalesService } from '../service/sales.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss'],
})
export class SalesListComponent {
  sales: any = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  isLoading$: any;
  start_date: any;
  end_date: any;
  method_payment: any;

  brands: any = [];
  brand_id: string = '';
  categorie_first_id: string = '';
  categorie_second_id: string = '';
  categorie_third_id: string = '';
  categories_first: any = [];
  categories_seconds: any = [];
  categories_seconds_backups: any = [];
  categories_thirds: any = [];
  categories_thirds_backups: any = [];
  method_payment_list: any = [];

  constructor(
    public salesService: SalesService,
    // public modalService: NgbModal,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.listSales();
    this.isLoading$ = this.salesService.isLoading$;
    this.configAll();
  }
  configAll() {
    this.salesService.configAll().subscribe((res: any) => {
      console.log(res);
      this.brands = res.brands;
      this.categories_first = res.categories_first;
      this.categories_seconds = res.categories_seconds;
      this.categories_thirds = res.categories_thirds;
      this.method_payment_list = res.method_payment_list;
    });
  }

  listSales(page = 1) {
    let data = {
      search: this.search,
      brand_id: this.brand_id,
      categorie_first_id: this.categorie_first_id,
      categorie_second_id: this.categorie_second_id,
      categorie_third_id: this.categorie_third_id,
      start_date: this.start_date,
      end_date: this.end_date,
      method_payment: this.method_payment,
    };
    this.salesService.listSales(data, page).subscribe(
      (res: any) => {
        console.log(res);
        this.sales = res.sales.data;
        this.totalPages = res.total;
        this.currentPage = page;
      },
      (err: any) => {
        this.toastr.error(
          'Api Response - Cominiquese con el sistema',
          err.error.message
        );
      }
    );
  }

  changeDepartament() {
    this.categories_seconds_backups = this.categories_seconds.filter(
      (item: any) => item.categorie_second_id == this.categorie_first_id
    );
    // limpia el select de categorias y subcategorias
    this.categorie_second_id = '';
    this.categorie_third_id = '';
  }

  changeCategorie() {
    this.categories_thirds_backups = this.categories_thirds.filter(
      (item: any) => item.categorie_second_id == this.categorie_second_id
    );
    // limpia el select de subcategorias
    this.categorie_third_id = '';
  }

  searchTo() {
    this.listSales();
  }

  reset() {
    this.search = '';
    this.brand_id = '';
    this.categorie_first_id = '';
    this.categorie_second_id = '';
    this.categorie_third_id = '';
    this.start_date = null;
    this.end_date = null;
    this.method_payment = '';
    this.listSales();
  }

  loadPage($event: any) {
    this.listSales($event);
  }
}
