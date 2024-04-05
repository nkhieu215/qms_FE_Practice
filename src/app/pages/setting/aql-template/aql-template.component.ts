import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AqlTemplateService } from 'src/app/share/_services/aqlTemplate.service';

@Component({
  selector: 'app-aql-template',
  templateUrl: './aql-template.component.html',
  styleUrls: ['./aql-template.component.css']
})
export class AqlTemplateComponent implements OnInit {

  constructor(private errorService: AqlTemplateService,
    private modalService: NgbModal,) {
    this.refreshExamination();
  }

  ngOnInit(): void {
  }

  formSearch: any = {
  };

  formEx:any ={

  }
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstRest?:any

  refreshExamination() {
    const { name, code } = this.formSearch;
    this.errorService.getList(this.formSearch.testLevel,this.formSearch.acceptanceLevel,this.formSearch.allowedError,this.page, this.pageSize).subscribe(
      data => {
        this.lstRest  = data.lstTemplate;
        this.collectionSize = Number(data.total) * this.pageSize;
        console.log(this.collectionSize);
      },
      err => {

      }
    );
  }

  onCreate(){
    this.errorService.createUpdate(this.formEx.id,this.formEx.testLevel,this.formEx.acceptanceLevel,this.formEx.allowedError,this.formEx.note).subscribe(
      data => {
       this.refreshExamination()
       Swal.fire(
        'Thành công',
        'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
        'success'
      )
      },
      err => {

      }
    );
  }

  open(content: any,data:any) {
    if(data != null){
      this.formEx = data;
    }
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  delete(data:any){
    this.errorService.remove(data.id).subscribe( data => {
      this.refreshExamination()
     },
     err => {

     })
  }




  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
