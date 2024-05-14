import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriesService } from '../service/categories.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent {

  @Input() categorie: any;
  @Output() CategorieD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public categorieService: CategoriesService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;
  }

  delete() {
    this.categorieService.deleteCategories(this.categorie.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Categoría eliminada correctamente');
      this.CategorieD.emit({message: 200});
      this.modal.close();
    });
  }
}
