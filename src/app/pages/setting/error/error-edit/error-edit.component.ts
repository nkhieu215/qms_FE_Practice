
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import Utils from 'src/app/share/_utils/utils';
import { ErrorScadaResponse } from 'src/app/share/response/examination/ErrorScadaResponse';

@Component({
  selector: 'app-error-edit',
  templateUrl: './error-edit.component.html',
  styleUrls: ['./error-edit.component.css']
})
export class ErrorEditComponent implements OnInit {


  constructor(private errorService: ErrorListService, private modalService: NgbModal, private exampleService: ExaminationService) { }

  ngOnInit(): void {
    this.searchExaminationCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';

          this.isLoading = true;
        }),
        switchMap((value) =>
          this.errorService.searchErrScada(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filterError.lstError = data.lstErrorScada;
        console.log(this.filterError.lstError);
      });
  }


  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg'
  };
  minLengthTerm = 2;
  errorMsg!: string;
  error?: string;
  classError?: string;

  form: any = {
    name: null,
    errorCode: null,
    description: null,
    lstErrorChild: null
  };


  formErrorChild: any = {
    name: null,
    errorCode: null,
    description: null
  };

  selectExamination: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  searchExaminationCtrl = new FormControl();
  isLoading = false;
  arrErrChild: Array<ErrorList> = [];

  /**
   * thêm mới thông tin audit
   */
  onSubmit(): any {
    const { name, description, errorCode } = this.form;
    const auditForm = new ErrorList(name, errorCode, description, this.arrErrChild);

    this.errorService.createOne(auditForm).subscribe(
      data => {
        console.log(data.result);
        if (data.result.responseCode == '00') {
          this.error = "Thêm mới thông tin lỗi thành công";
          this.classError = "alert alert-success alert-dismissible fade show";
        } else {
          this.error = data.result.message;
          this.classError = "alert alert-danger alert-dismissible fade show";
        }
      },
      err => {
        console.log(JSON.parse(err.error).message)
      }
    );
  }

  /**
   * thêm mới thông tin kiểm tra
   */
  onAddErrorChild() {

    const { name, description, errorCode } = this.formErrorChild;
    console.log(this.selectExamination);
    var nameSelect = "";

    if(this.isString(this.selectExamination)){
      nameSelect = this.selectExamination;
    }else{
      nameSelect = this.selectExamination.name
    }

    const errorChild = new ErrorList(nameSelect, description, errorCode, [], Utils.randomString(5));
    this.arrErrChild.push(errorChild);

    this.formErrorChild = {};
    this.check=false;
  }

  isString(value:any) {
    return typeof value === 'string' || value instanceof String;
  }

  deleteAuditRow(ids: any) {

    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });

  }

  open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
    );
  }

  check = false;
  openError() {
    this.check = true;
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

  displayWith(value: any) {
    return value?.Title;
  }

  filterError = new ErrorScadaResponse();
  onSelected() {
    console.log(this.selectExamination);
    this.strSelect = this.selectExamination.name;
   this.formErrorChild.errorCode = this.selectExamination.label
  }
}
