import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/share/_services/auth.service';
import { ProcessSettingsService } from 'src/app/share/_services/prcessSetting.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-setting-process',
  templateUrl: './setting-process.component.html',
  styleUrls: ['./setting-process.component.css']
})
export class SettingProcessComponent implements OnInit {


  constructor(private processService: ProcessSettingsService,
    private modalService: NgbModal,
    protected autoLogout: AuthService) {
    this.refreshExamination();
  }

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
  }

  formSearch: any = {
  };

  formEx: any = {

  }
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstRest?: any

  refreshExamination() {
    const { name, code } = this.formSearch;
    this.processService.getList(this.formSearch.name, this.formSearch.code, this.page, this.pageSize).subscribe(
      data => {
        this.lstRest = data.lstSettingProcess;
        this.collectionSize = Number(data.total) * this.pageSize;
        console.log(this.collectionSize);
      },
      err => {

      }
    );
  }

  onCreate() {
    this.processService.createUpdate(this.formEx.id, this.formEx.name, this.formEx.code).subscribe(
      data => {
        this.refreshExamination()
        Swal.fire(
          'Thành công',
          'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
          'success'
        )
        this.modalService.dismissAll();
      },
      err => {

      }
    );
  }

  open(content: any, data: any) {
    if (data != null) {
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

  delete(data: any) {
    this.processService.remove(data.id).subscribe(data => {
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
