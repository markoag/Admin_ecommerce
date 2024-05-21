import { Component } from '@angular/core';
import { BrandService } from '../service/brand.service';
import { CreateBrandComponent } from '../create-brand/create-brand.component';
import { EditBrandComponent } from '../edit-brand/edit-brand.component';
import { DeleteBrandComponent } from '../delete-brand/delete-brand.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.scss']
})
export class ListBrandComponent {

  brands: any[] = [];
  search: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  isLoading$: any;

  constructor(
    public brandService: BrandService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listBrands();
    this.isLoading$ = this.brandService.isLoading$;
  }

  listBrands(page = 1) {
    this.brandService
      .listBrands(this.search, page)
      .subscribe((res: any) => {
        console.log(res);
        this.brands = res.brands;
        this.totalPages = res.total;
        this.currentPage = page;
      });
  }

  searchTo() {
    this.listBrands();
  }

  loadPage($event: any) {
    this.listBrands($event);
  }

  openModalCreateBrand() {
    const modalRef = this.modalService.open(CreateBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.BrandC.subscribe((attrib: any) => {
      this.brands.unshift(attrib);
    });
  }

  openModalEditBrand(brand: any) {
    const modalRef = this.modalService.open(EditBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandE.subscribe((attrib: any) => {
      let INDEX = this.brands.findIndex(
        (item: any) => item.id == attrib.id
      );
      if (INDEX != -1) {
        this.brands[INDEX] = attrib;
      }
    });
  }

  deleteBrand(brand: any) {
    const modalRef = this.modalService.open(DeleteBrandComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.brand = brand;

    modalRef.componentInstance.BrandD.subscribe((res: any) => {
      let INDEX = this.brands.findIndex((item: any) => item.id == brand.id);
      if (INDEX != -1) {
        this.brands.splice(INDEX, 1);
      }
    });
  }
  
}
