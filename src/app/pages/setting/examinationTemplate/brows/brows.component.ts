
import { AnimationPlayer } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { Examination } from 'src/app/share/response/examination/Examination';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brows',
  templateUrl: './brows.component.html',
  styleUrls: ['./brows.component.css'],
  styles: [`
    .greenClass{
      background-color:#0AE40A;width: 75px;
      border-radius: 10px;
    text-align:center;}
    .redClass{
      background-color:#FF0000;width: 100px;
      border-radius: 10px;
      text-align:center;}
    `]
})
export class ExaminationBrowsComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  auditCriteria: Examination[] = [];
  examiantionRes?: ExaminationResponse ;

  formSearch: any = {
    name: null,
    type: 1
  };

  constructor(private examinationService: ExaminationService) {
    this.refreshExamination();
  }

  refreshExamination() {
    const { name, type, code } = this.formSearch;
    this.examinationService.getAll(this.page, this.pageSize, name, type,code).subscribe(
      data => {
        this.examiantionRes  = data;
        this.auditCriteria =  data.lstExamination;
        this.collectionSize = Number(this.examiantionRes?.total) * this.pageSize;
      },
      err => {

      }
    );
  }
  // this.auditCriteria = COUNTRIES
  //   .map((country, i) => ({id: i + 1, ...country}))
  //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  ngOnInit(): void {}

  delete(id?: any) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện xóa biên bản kiểm tra không ? ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {

            this.examinationService.delete(id).subscribe(
              data => {
                Swal.fire(
                  'Thông báo',
                  'Bạn đã thực hiện xóa thành công.',
                  'success'
                )
                this.refreshExamination();
              },
              error => { }
            )

      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  copy(id?:any){
    this.examinationService.copy(id).subscribe(
      data => {
        Swal.fire(
          'Thông báo',
          'Bạn đã thực hiện copy thành công.',
          'success'
        )
        this.refreshExamination();
      },
      error => { }
    )

  }
}
