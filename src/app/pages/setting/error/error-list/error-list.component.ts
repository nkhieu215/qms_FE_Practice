
import { Component, OnInit } from '@angular/core';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { AuthService } from 'src/app/share/_services/auth.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.css']
})
export class ErrorListComponent implements OnInit {

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0); 
  }

  page = 1;
  pageSize = 10;
  collectionSize = 0;

  auditCriteria: any[] = [];
  errorListRes?: ErrorListResponse;

  formSearch: any = {
    name: null,
    code: null
  };

  constructor(private errorService: ErrorListService,
    protected autoLogout: AuthService) {
    this.refreshExamination();
  }

  refreshExamination() {
    const { name, code } = this.formSearch;
    this.errorService.getAll(this.page, this.pageSize, name, code).subscribe(
      data => {
        console.log('list error', data)
        console.log('list error', data)
        this.errorListRes = data;
        this.auditCriteria = data.lstError;
        this.collectionSize = Number(this.errorListRes?.total) * this.pageSize;
      },
      err => {

      }
    );
  }
  // this.auditCriteria = COUNTRIES
  //   .map((country, i) => ({id: i + 1, ...country}))
  //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);



  delete(id?: any, name?: any) {
    if (confirm("Bạn có muốn thực hiện xóa " + name)) {
      console.log("xóa");
      this.errorService.delete(id).subscribe(
        data => {
          this.errorListRes = data;
          this.refreshExamination();
        },
        err => {
        }
      );
    }
  }

}
