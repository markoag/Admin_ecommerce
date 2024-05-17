import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SlidersService } from '../service/sliders.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-sliders',
  templateUrl: './delete-sliders.component.html',
  styleUrls: ['./delete-sliders.component.scss']
})
export class DeleteSlidersComponent {

  @Input() slider: any;
  @Output() SliderD: EventEmitter<any> = new EventEmitter();
  isLoading: any;

  constructor(
    public sliderService: SlidersService,
    private toastr: ToastrService,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.isLoading = this.sliderService.isLoading$;
  }

  delete() {
    this.sliderService.deleteSliders(this.slider.id).subscribe((res: any) => {
      this.toastr.success('Éxito','Slider eliminado correctamente');
      this.SliderD.emit({message: 200});
      this.modal.close();
    });
  }
}
