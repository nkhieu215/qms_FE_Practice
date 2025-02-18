import { StoreCheckService } from './../../../share/_services/store_check.service';

import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { DatePipe, formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { IqcComponentNVL } from 'src/app/share/response/iqcComponent/iqcComponentNVL';
import { IqcComponentNVLResponse } from 'src/app/share/response/iqcComponent/iqcComponentNVLResponse';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { OitmObjResponse } from 'src/app/share/response/oitm/OitmObjResponse';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { OitmResponse } from 'src/app/share/response/oitm/OitmResponse';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { IqcCheckService } from 'src/app/share/_services/iqcNvl.service';
import { Constant } from 'src/app/share/_services/constant';
import Utils from 'src/app/share/_utils/utils';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/share/_services/auth.service';

@Component({
  selector: 'app-check-lkdt',
  templateUrl: './check-lkdt.component.html',
  styleUrls: ['./check-lkdt.component.css']
})
export class CheckLkdtComponent implements OnInit {
  // ------------------------------------------------ list item ----------------------------------------------
  // bản test
  //address = 'http://localhost:8449';
  // hệ thống
  address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  //list item
  rawData: any;
  listOfItem: any[] = [];
  listOfItems: any;
  @Input() itemResult: any;
  itemcode: any;
  iqcElecCompId: any;
  iqcElecCompCode: any;
  iqcElecCompname: any;
  //----------------------------------------- autocomplete ---------------------------------------
  testingCriticalGroup: any;
  listOfCriticalGroup: any;
  listOfCriticalName: any;
  //------------------------------------------------- list errors ---------------------------------------------
  listOfError: any;
  listOfErrorWait: any[] = [];
  errorsResult: any;
  auditResultItemId = 0;
  @Input() itemCode = '';
  @Input() errCode = '';
  @Input() errGroup = '';
  @Input() errName = '';
  lstItemCode: any[] = [];
  lstErrCode: any[] = [];
  lstErrName: any[] = [];
  lstErrGroup: any[] = [];
  listErrorGroup: any;
  listErrors: any;
  //-------------------------------------------------------------------------------------------------------------
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  form: any = {};
  formErrorChild: any = {};
  lstError?: ErrorList[];
  lstErrorGr?: any[];
  errorAdd?: string;
  arrErrChild: Array<ErrorElectronicComponent> = [];
  auditnvl: IqcComponentNVL[] = [];
  examiantionRes?: IqcComponentNVLResponse;
  formSearch: any = {};
  formAuditCriteriaLKDT: any = {};
  formAuditParam: any = {};
  minLengthTerm = 3;
  minLengthElectronic = 6;
  minLengthOrigin = 2;
  selectExamination: any = '';
  selectedElectronic: any = '';
  selectedOrigin: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  strSelectElecName: any = '';
  strSelectOrigin: any = '';
  lstview = true;
  lstAuditCriteriaParamResponse: Array<AuditCriteriaParam> = [];
  lstAuditCriteriaParam: Array<AuditCriteriaParam> = [];
  lstAuditCriteriaParamCheckDup: Array<AuditCriteriaParam> = [];
  listOfParameters: any;
  lstAuditCriteriaLKDTResponse: Array<AuditCriteriaLKDT2> = [];
  lstAuditCriteriaLKDT: Array<AuditCriteriaLKDT2> = [];
  lstAuditCriteriaLKDTCheckDup: Array<AuditCriteriaLKDT2> = [];

  lstElectronic?: Array<OitmObjResponse> = [];
  lstErrorRes?: ErrorListResponse;
  searchExaminationCtrl = new FormControl();
  searchELectronicCtrl = new FormControl();
  searchOriginCtrl = new FormControl();
  filteredExamination = new ExaminationResponse();
  filteredOitm = new OitmResponse();
  filteredOrigin = new OitmResponse();
  isLoading = false;
  isLoadingElec = false;
  isLoadingOrigin = false;
  isEdit = false;
  isShow = false;
  show_approve = false;
  show_edit = false;
  show_edit_button = false;
  id?: any;
  file?: any;
  arrayBuffer?: any;
  filelist?: [];
  typeAction?: any;
  errorMsg!: string;
  closeResult: string = '';
  statusStr?: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  constructor(
    private actRoute: ActivatedRoute,
    private exampleService: ExaminationService,
    private modalService: NgbModal,
    private errorService: ErrorListService,
    private oitmService: OitmService,
    private router: Router,
    private tokenStorage: KeycloakService,
    private exportExelService: ExportExcelService,
    private iqcCheckService: IqcCheckService,
    private storeCheckService: StoreCheckService,
    private datePipe: DatePipe,
    protected http: HttpClient,
    protected autoLogout: AuthService
  ) { }
  sortList() {
    this.lstAuditCriteriaLKDT = this.lstAuditCriteriaLKDT.sort((a: any, b: any) => a.positionNumber - b.positionNumber);
    this.lstAuditCriteriaParam = this.lstAuditCriteriaParam.sort((a: any, b: any) => a.positionNumber - b.positionNumber);
  }
  checkDuplicateNumber(type: any) {
    if (type == 'LKDT') {

      var result1 = this.lstAuditCriteriaLKDTCheckDup.find(x => x.positionNumber == this.formAuditCriteriaLKDT.positionNumber);
      if (result1) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lặp số thứ tự',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: true,
        })
        if (this.lstAuditCriteriaLKDT.length == 0) {
          this.formAuditCriteriaLKDT.positionNumber = 1;
        } else {
          this.formAuditCriteriaLKDT.positionNumber = 0;
          this.lstAuditCriteriaLKDT.forEach(x => {
            if (x.positionNumber! >= this.formAuditCriteriaLKDT.positionNumber) {
              const i = x.positionNumber!
              this.formAuditCriteriaLKDT.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    } else if (type == 'TS') {
      var result2 = this.lstAuditCriteriaParamCheckDup.find(x => x.positionNumber == this.formAuditCriteriaLKDT.positionNumber);
      if (result2) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lặp số thứ tự',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: true,
        })
        if (this.lstAuditCriteriaParam.length == 0) {
          this.formAuditParam.positionNumber = 1;
        } else {
          this.formAuditParam.positionNumber = 0;
          this.lstAuditCriteriaParam.forEach(x => {
            if (x.positionNumber! >= this.formAuditParam.positionNumber) {
              const i = x.positionNumber!
              this.formAuditParam.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    }
  }
  ngOnInit(): void {
    this.autoLogout.autoLogout(0, 'check lkdt');
    this.typeAction = this.actRoute.snapshot.params['type'];
    this.id = this.actRoute.snapshot.params['id'];
    var data1 = { testingCriticalGroup: 'Thông số điện', type: 'LKDT' }
    this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data1).subscribe(res => {
      this.listOfParameters = res;
      // console.log(this.listOfParameters)
    })
    this.getListError();
    this.getListErrorGroup();
    this.initCreate();
    this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
      this.listOfErrorWait = res;
    })
    if (this.typeAction) {
      this.iqcElecCompId = this.id;
      this.lstview = false;
    } else {
      this.refreshExamination();
    }
  }

  async initCreate() {

    this.errorService.getAllCategories().subscribe(
      (data) => {
        this.lstErrorRes = data;
        this.lstErrorGr = this.lstErrorRes?.lstError;
        this.lstErrorGr = this.lstErrorRes?.lstError;
        // console.log(this.lstErrorRes);
      },
      (err) => { }
    );

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
          this.exampleService.searchBycode(value, 2).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredExamination = data;
        // console.log(this.filteredExamination);
      });

    this.searchELectronicCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthElectronic;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';

          this.isLoadingElec = true;
        }),
        switchMap((value) =>
          this.oitmService.searchBycode(value).pipe(
            finalize(() => {
              this.isLoadingElec = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredOitm = data;
      });


    this.searchOriginCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthOrigin;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';

          this.isLoadingOrigin = true;
        }),
        switchMap((value) =>
          this.storeCheckService.searchBycode(value).pipe(
            finalize(() => {
              this.isLoadingOrigin = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredOrigin = data;
        console.log(this.filteredOrigin)
      });


    if (this.typeAction == 'add') {
      this.form.checkDate = new Date();
      this.form.importDate = new Date();
      this.form.reportCode = formatDate(new Date(), 'yyyyMMddhhmmss', 'en_US') + '-RANGDONG-QC';
      this.form.iqcElectType = false;
      this.form.itemType = 'Hàng nhập';
      this.form.suggestion = 'Nhập kho bình thường';
      this.form.conclusion = 'Đạt nhập kho';
    } else if (this.typeAction == 'edit' || this.typeAction == 'show') {
      this.http.get<any>(`${this.address}/${this.path}/iqc/get-all/${this.id}`).subscribe(res => {
        this.listOfItem = res;
      })
      let data = await this.iqcCheckService.detail(this.id);
      this.form = data.component;
      setTimeout(() => {
        if (this.form.iqcElectType == 'false') {
          this.form.iqcElectType = false;
        } else {
          this.form.iqcElectType = true;
        }
      }, 300);
      this.statusStr = Utils.getStatusApproveName(this.form.status)
      // this.selectedEx = this.form.templateCode = data.component.templateCode;
      // this.form.checkDate =  this.form.checkDate ? this.datePipe.transform(Number(this.form.checkDate), 'yyyy-MM-dd') : '';
      // console.log("checkdate ::" +  this.form.checkDate);


      this.form.importDate = new Date(this.form.importDate);
      this.strSelectElec = data.component.elecCompCode;
      this.strSelectElecName = data.component.elecCompName;
      this.strSelectOrigin = data.component.origin;
      // console.log('check mau bien ban: ', this.form)
      // check status
      if (this.typeAction == 'edit') {
        if (data.component.status == 'WAIT_APPROVE' || data.component.status == 'APPROVE') {
          Swal.fire({
            title: 'Lỗi',
            text: 'Bạn không thể thực hiện chỉnh sửa yêu cầu ! ',
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1000
          })
          this.router.navigate([
            `/iqc/iqc-lkdt-check`,
            {},
          ]);
        }
      }
    }

    const id = this.actRoute.snapshot.params['id'];
    const type = this.actRoute.snapshot.params['type'];
    this.id = id;
    if (id != null && id != 0) {

      if (type == 'show') {
        this.isShow = true;
      } else if (type == 'edit') {
        this.isEdit = true;
      }

      this.id = id;
      let data = await this.iqcCheckService.detail(id);
      this.form = data.component;
      this.isEdit = true;
      // this.arrErrChild = data.component.resultError;

      this.lstAuditCriteriaLKDT = data.component.resultLkdt;
      this.lstAuditCriteriaLKDT.forEach(element => {
        element.auditQuantity = element.quantity;
      })
      this.sortList()
      this.lstAuditCriteriaParam = data.component.resultParam;
    } else {

    }


  }

  async refreshExamination() {
    const { name, code, iqcCode, reportCode, invoiceNumber, startDate, endDate, status, itemType, origin } = this.formSearch;
    const dataSearch = {
      name: name,
      code: code,
      iqcCode: iqcCode,
      reportCode: reportCode,
      startDate: startDate ? startDate : null,
      endDate: endDate ? endDate : null,
      // startDate: startDate ? startDate + " 00:00:00" : null,
      // endDate: endDate ? endDate + " 23:59:59" : null,
      status: status,
      itemType: itemType,
      invoiceNumber: invoiceNumber,
      origin: origin,
      grpoNumber: null,
      createBy: null
    }
    let data = await this.iqcCheckService.getAll(this.page, this.pageSize, dataSearch, Constant.TYPE_ELECTRIC_COMPONENT_LKDT_BTP, Constant.IQC_TYPE_CREATE)
    // console.log(data);
    this.auditnvl = data.lst;
    this.collectionSize = Number(data.total) * this.pageSize;
  }


  async delete(id?: any) {
    let data = await this.iqcCheckService.delete(id);
    if (data.result.responseCode == '00') {
      this.refreshExamination();
      Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
    }

  }

  report(id?: any, code?: any) {
    this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${id}`).subscribe(res => {
      this.listOfError = res;
      setTimeout(() => {
        let fileName = this.tokenStorage.getUsername() + "_" + code + "_" + formatDate(new Date(), 'dd_MM_yyyy_HH_mm', 'en_US') + ".xlsx"
        this.iqcCheckService.downloadfileBtp(id, fileName, this.listOfError);
      }, 100)
    })
  }
  createReport() {
    this.form.elecCompCode = '';
    this.form.electCompName = '';
    this.form.checkDate = new Date();
    this.form.importDate = new Date();
    this.form.reportCode = formatDate(new Date(), 'yyyyMMddhhmmss', 'en_US') + '-RANGDONG-QC';
    this.form.iqcElectType = false;
    this.form.itemType = 'Hàng nhập';
    this.form.suggestion = 'Nhập kho bình thường';
    this.form.conclusion = 'Đạt nhập kho';
    this.form.status = 'DRAFF';
    this.form.type = Constant.TYPE_ELECTRIC_COMPONENT_LKDT_BTP;
    setTimeout(async () => {
      let data = await this.iqcCheckService.create(this.form, null, null, null, 'ADD');
      // setTimeout(() => {
      console.log('check data :: ', data)
      this.router.navigate([
        `/iqc/iqc-lkdt-check/${data.id}/edit`,
        {},
      ]).then(() => {
        window.location.reload();
      });
      // }, 200);
    }, 200);
  }
  onSubmit(buttonType: any) {
    if (this.file) {
      const body = { iqcElectCompId: this.actRoute.snapshot.params['id'], data: JSON.stringify(this.rawData), createdAt: new Date }
      this.http.post(`${this.address}/store/download-raw-data`, body).subscribe();
      // console.log("Them moi thanh cong", JSON.stringify(this.rawData))
    }
    var checkResult = false;
    if ((this.form.reportCode === '' || this.form.itemType === '') ||
      (this.form.reportCode === null || this.form.itemType === null)) {
      checkResult = true;
    }
    setTimeout(async () => {
      if (checkResult === true) {
        Swal.fire({
          title: 'Cảnh báo',
          text: 'Vui lòng điền đầy đủ thông tin biên bản !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Đồng ý',
        })
      } else {
        this.form.importDateStr =
          this.form.importDate != null
            ? moment(this.form.importDate).format('DD-MM-YYYY')
            : '';
        this.form.checkDateStr =
          this.form.checkDate != null
            ? moment(this.form.checkDate).format('DD-MM-YYYY')
            : '';
        this.form.type = 2;
        let message = '';
        if (buttonType == 'save') {
          this.form.status = 'DRAFF';
          message = 'Bạn đã thực hiện thêm mới thành công'
        } else if (buttonType == 'send_approve') {
          this.form.status = 'WAIT_APPROVE';
          message = 'Bạn đã gửi duyệt thành công.';
        }

        var action = "";
        if (this.id == 0 || this.id == null) {
          action = "ADD"
        } else {
          action = "EDIT"
        }

        this.lstAuditCriteriaLKDT.forEach(element => {
          element.quantity = element.auditQuantity;
        })
        console.log("check list item: ", this.lstAuditCriteriaParam, this.lstAuditCriteriaLKDT)
        let data = await this.iqcCheckService.create(this.form, null, this.lstAuditCriteriaParam, this.lstAuditCriteriaLKDT, action)
        if (data.result.responseCode == '00') {

          //Swal.fire("Thành công", message, "success");

          Swal.fire({
            title: 'Thành công',
            text: message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Đồng ý'
          }).then((result) => {
            this.listOfErrorWait.forEach(x => {
              x.electCompId = data.id;
            })
            setTimeout(() => {
              if (buttonType == 'send_approve') {
                //window.location.href = `/iqc/iqc-lkdt-check/${data.id}/show`;
                this.iqcElecCompId = data.id;
                this.listOfItem.forEach((item: any) => item.iqcElecCompId = data.id);
                setTimeout(() => {
                  var result = this.listOfItem.filter((item: any) => item.itemCode !== '')
                  const body = { auditType: this.actRoute.snapshot.params['type'], item: result };
                  this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, body).subscribe(res => {
                    console.log('id item: ', res)
                    this.listOfErrorWait.forEach(x => {
                      var result2 = res.find((y: any) => y.itemCode == x.itemCode);
                      if (result2) {
                        x.auditResultItemId = result2.id;
                      }
                    })
                    setTimeout(() => {
                      this.http.post<any>(`${this.address}/${this.path}/error/submit`, this.listOfErrorWait).subscribe(() => {
                        setTimeout(() => {
                          this.router.navigate([
                            `/iqc/iqc-lkdt-check/${data.id}/show`,
                            {},
                          ]).then(() => {
                            window.location.reload();
                          });
                        }, 1000);
                      });
                    }, 300);
                  });
                  // setTimeout(() => {
                  //   window.location.reload();
                  // }, 100);
                }, 300);
              } else {
                this.iqcElecCompId = data.id;
                this.listOfItem.forEach((item: any) => item.iqcElecCompId = data.id);
                setTimeout(() => {
                  var result = this.listOfItem.filter((item: any) => item.itemCode !== '')
                  const body = { auditType: this.actRoute.snapshot.params['type'], item: result };
                  this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, body).subscribe(res => {
                    console.log('check item 1:', res);
                    this.listOfErrorWait.forEach(x => {
                      var result2 = res.find((y: any) => y.itemCode == x.itemCode);
                      if (result2) {
                        x.auditResultItemId = result2.id;
                      }
                    })
                    setTimeout(() => {
                      this.http.post<any>(`${this.address}/${this.path}/error/submit`, this.listOfErrorWait).subscribe(() => {
                        console.log('update error item 111111:', this.listOfErrorWait);
                        setTimeout(() => {
                          this.router.navigate([
                            `/iqc/iqc-lkdt-check/${data.id}/edit`,
                            {},
                          ]).then(() => {
                            window.location.reload();
                          });
                        }, 1000);
                      });
                    }, 300);
                  }
                  );
                }, 300);
                // window.location.href = `/iqc/iqc-lkdt-check/${data.id}/edit`
              }
            }, 300)
          })


        }
      }
    }, 100);
  }

  open(content: any, type: any, index: any) {
    var data = { type: 'LKDT' }
    this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
      console.log("check list: ", res)
      this.listOfCriticalGroup = res;
    })
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );


    if (type == 'edit') {
      this.formAuditCriteriaLKDT = this.lstAuditCriteriaLKDT[index];
      this.formAuditParam = this.lstAuditCriteriaParam[index];
      document.getElementById('btn-update')!.hidden = false;
      document.getElementById('btn-insert')!.hidden = true;
      this.lstAuditCriteriaLKDTCheckDup = this.lstAuditCriteriaLKDT.filter(x => (x.positionNumber != this.lstAuditCriteriaLKDT[index].positionNumber) || x.positionNumber != undefined);
      this.lstAuditCriteriaParamCheckDup = this.lstAuditCriteriaParam.filter(x => (x.positionNumber != this.lstAuditCriteriaParam[index].positionNumber) || x.positionNumber != undefined);
      console.log("check update: ", this.lstAuditCriteriaLKDTCheckDup)
    } else {
      document.getElementById('btn-update')!.hidden = true;
      document.getElementById('btn-insert')!.hidden = false;
      this.formAuditCriteriaLKDT = {};
      var list3 = this.lstAuditCriteriaLKDT
      this.lstAuditCriteriaLKDTCheckDup = list3;
      this.formAuditCriteriaLKDT.positionNumber = 0;
      this.lstAuditCriteriaLKDT.forEach(x => {
        if (x.positionNumber! >= this.formAuditCriteriaLKDT.positionNumber) {
          const i = x.positionNumber!
          this.formAuditCriteriaLKDT.positionNumber = Number(i) + 1;
        }
      })
      this.formAuditParam = {};
      var list4 = this.lstAuditCriteriaParam
      this.lstAuditCriteriaParamCheckDup = list4;
      this.formAuditParam.positionNumber = 0;
      this.lstAuditCriteriaParam.forEach(x => {
        if (x.positionNumber! >= this.formAuditParam.positionNumber) {
          const i = x.positionNumber!
          this.formAuditParam.positionNumber = Number(i) + 1;
        }
      })
    }
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

  onSelected() {
    // console.log('hello', this.selectExamination);
    this.http.get<any>(`${this.address}/${this.path}/examinations/get-all/${this.selectExamination.id}`).subscribe(res => {
      this.listOfItem = res;
      // this.strSelect = this.selectExamination.name + '(' + this.selectExamination.code + ')';
      this.strSelectElec = this.iqcElecCompCode = this.form.elecCompCode = this.selectExamination.code;
      this.strSelectElecName = this.iqcElecCompname = this.form.electCompName = this.selectExamination.name;
      this.strSelect = this.selectExamination.name + '(' + this.selectExamination.code + ')';
      this.lstAuditCriteriaParam = this.selectExamination.iqcAuditCriteriaParameters;
      this.lstAuditCriteriaParam.forEach(element => {
        element.parameterId = element.id;
        element.checkResult = 'Đạt';
        element.ids = Utils.randomString(5);
      })

      this.lstAuditCriteriaLKDT = this.selectExamination.lstAuditCriteriaLkdt;
      this.lstAuditCriteriaLKDT?.forEach(element => {
        element.auditCritetiaLkdtId = element.id;
        element.checkResult = 'Đạt';
        element.ids = Utils.randomString(5);
        element.auditQuantity = null;
        element.inaccuracy = '0';
      })

      // console.log(this.lstAuditCriteriaParam);
      // console.log(this.lstAuditCriteriaLKDT)
      this.sortList();
    })
  }

  onSelectedElectronic(index: any, itemCode: any) {
    this.itemResult = itemCode;
    var check = false;
    for (let i = 0; i < this.listOfItem.length; i++) {
      if (this.listOfItem[i].itemCode === this.itemResult.itemCode) {
        check = true;
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại mã sản phẩm ! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
      }
    }
    setTimeout(() => {
      if (check === false) {
        this.listOfItem[index].itemCode = this.itemResult.itemCode;
        this.listOfItem[index].itemName = this.itemResult.itemName;
      } else {
        this.listOfItem[index].itemCode = '';
        this.listOfItem[index].itemName = '';
        this.listOfItems = [];
      }
    }, 50);
    // console.log(this.selectedElectronic);
    //this.strSelectElec = this.selectedElectronic.itemCode;
    // this.form.electCompName = this.selectedElectronic.itemName;
  }

  onSelectedOrigin() {
    // console.log(this.selectedOrigin);
    this.strSelectOrigin = this.selectedOrigin.name;
    this.form.origin = this.selectedOrigin.name;
    // console.log(this.strSelectOrigin);

  }

  onChangeQuantity() {
    var checkQuantity = this.form.checkingQuantity;
    if (this.form.checkingQuantity != null && this.arrErrChild.length !== 0) {
      this.arrErrChild.forEach((element) => {
        var ratio =
          (
            (element.quantity / (checkQuantity == 0 ? 1 : checkQuantity)) *
            100
          ).toFixed(4) + '%';
        console.log(ratio);
        element.ratio = ratio;
      });
    }
  }

  /**
   * thêm mới thông tin kiểm tra
   */
  onAddErrorChild() {
    const { errGroup, errName, quantity, ratio } = this.formErrorChild;
    var errGrname = null;
    this.lstErrorGr?.forEach((element) => {
      if (element.id == errGroup) {
        errGrname = element.name;
      } else {
        errGrname = '';
      }
    });

    const errorChild = new ErrorElectronicComponent(
      errName,
      errGrname,
      quantity,
      ratio,
      Utils.randomString(5)
    );
    this.arrErrChild.push(errorChild);
  }

  onChangeErrorGroup(name: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == name) {
        this.lstError = element.errChild;
        // console.log(this.lstError)
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  onChangeQuantityError(errorNumber: any) {
    if (this.form.checkingQuantity == null || this.form.checkingQuantity == 0) {
      this.errorAdd = 'Bạn chưa thực hiện nhập số lượng kiểm tra';
      this.formErrorChild.ratio = 0;
    } else {
      this.errorAdd = '';
      var number = (errorNumber / this.form.checkingQuantity) * 100;
      this.formErrorChild.ratio = number.toFixed(4) + '%';
    }
  }

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });
  }

  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      // console.log("event", this.arrayBuffer)
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      worksheet['!cols'];
      var arraylist: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.filelist = [];
      var filteredData: any[] = [];
      for (let index = 4; index < arraylist.length; index++) {
        if (arraylist[index].length != 0) {
          filteredData.push(arraylist[index]);
        } else break;
      }

      // console.log(filteredData);
      this.rawData = filteredData;
      function getValueByCol(col: number, type: string) {
        var arr = filteredData.map(item => item[col]).filter(Number);

        if (type == 'min') {
          return arr.length == 0 ? 0 : Math.min(...arr);
        }
        if (type == 'max') {
          return arr.length == 0 ? 0 : Math.max(...arr);
        }
        if (type == 'avg') {
          const sum = arr.reduce((a, b) => a + b, 0);
          return (sum / arr.length) || 0;
        }
        if (type == 'data') {
          return arr;
        }
        if (type == 'length') {
          return arr.length;
        }
        return null;
      }

      this.lstAuditCriteriaParam.forEach((element, index) => {
        element.minAudit = getValueByCol(index, 'min');
        element.maxAudit = getValueByCol(index, 'max');
        element.avgResult = getValueByCol(index, 'avg');
        element.data = getValueByCol(index, 'data');
        element.s = this.checkS(element.data, element.avgResult);
        element.quantity = getValueByCol(index, 'length');

        element.ku = this.checkKu(element.max, element.avgResult, element.s);
        element.kl = this.checkKl(element.min, element.avgResult, element.s);
        element.cpkUp = this.checkCpkUp(element.max, element.avgResult, element.s);
        element.cpkLow = this.checkCpkLow(element.min, element.avgResult, element.s);
        element.checkResult = 'Đạt'

        if (element.max && element.min) {
          element.kmin = Math.min(element.ku, element.kl);
          element.cpk = Math.min(element.cpkUp, element.cpkLow);
        }
        else if (element.max && !element.min) {
          element.kmin = element.ku;
          element.cpk = element.cpkUp;
        }
        else if (!element.max && element.min) {
          element.kmin = element.kl;
          element.cpk = element.cpkLow;
        } else {
          element.kmin = '';
          element.cpk = '';
        }
      })
    };
  }

  // tính S
  checkS(array: [], avg: number) {
    var total = 0;
    var count = 0;
    array.forEach(value => {
      var a = avg - value;
      total += Math.pow(a, 2);
      count++;
    })
    if (total == 0) {
      return 0;
    } else {
      return Math.sqrt(total / (count - 1)).toFixed(4);
    }
  }

  checkKu(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0 && Number(s) != 0) {
      return ((maxAudit - avg) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkKl(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0 && Number(s) != 0) {
      return ((avg - minAudit) / s).toFixed(4);
    } else {
      return '';
    }
  }

  checkCpkUp(maxAudit: any, avg: any, s: any) {
    if (maxAudit && Number(maxAudit) != 0 && Number(s) != 0) {
      return ((maxAudit - avg) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }


  checkCpkLow(minAudit: any, avg: any, s: any) {
    if (minAudit && Number(minAudit) != 0 && Number(s) != 0) {
      return ((avg - minAudit) / (3 * s)).toFixed(4);
    } else {
      return '';
    }
  }

  displayWith(value: any) {
    return value?.Title;
  }


  downloadTemplate() {
    let dataHeader: string[] = [];
    this.lstAuditCriteriaParam.forEach(element => {
      dataHeader.push(element.parameterName);
    })
    let reportData = {
      title: 'Thông tin kiểm tra thông số',
      fileName: 'mau_kiem_tra_thong_so',
      data: [],
      headers: dataHeader,
    };
    this.exportExelService.exportTemplatePhotoelectric(reportData);
  }


  async addAuditCriterialLKDT(index: any) {
    if (index != null) {
      this.sortList();
    } else {
      this.formAuditCriteriaLKDT.ids = Utils.randomString(5);
      if (this.typeAction == 'add') {
        this.lstAuditCriteriaLKDT.push(this.formAuditCriteriaLKDT)
      }
      else if (this.typeAction == 'edit') {
        this.lstAuditCriteriaLKDT.push(this.formAuditCriteriaLKDT)
      }
      this.sortList();
    }
    this.formAuditCriteriaLKDT = {};
    this.modalService.dismissAll()
  }


  addAuditCriterialParam(index: any) {
    if (index != null) {
      this.sortList();
    } else {
      this.formAuditParam.ids = Utils.randomString(5);
      if (this.typeAction == 'add') {
        this.lstAuditCriteriaParam.push(this.formAuditParam)
      }
      else if (this.typeAction == 'edit') {
        this.lstAuditCriteriaParam.push(this.formAuditParam)
      }
      this.sortList();
    }


    this.formAuditCriteriaLKDT = {};
    this.modalService.dismissAll()
  }


  removeAuditLKDT(ids: any) {
    if (this.typeAction == 'edit') {

    }

    this.lstAuditCriteriaLKDT.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaLKDT.splice(index, 1);
      }
    });
  }

  removeAuditParam(ids: any) {
    if (this.typeAction == 'edit') {

    }

    this.lstAuditCriteriaParam.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaParam.splice(index, 1);
      }
    });
  }

  copyCheckNvl(id: any, type: any) {
    Swal.fire({
      title: 'Cảnh báo',
      text: 'Bạn có muốn tiếp tục thực hiện copy biên bản không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      const data = await this.iqcCheckService.copy(id);
      // this.router.navigate([`/iqc/iqc-lkdt-check/${data.id}/edit`, {},]);
      window.open(`/iqc/iqc-lkdt-check/${data.id}/edit`, '_blank');
      window.location.reload();
    })
  }
  async exportExcelDetail() {
    let data = await this.iqcCheckService.detail(this.id);
    this.report(data.component.id, data.component.reportCode);
  }
  // -------------------------------------------- Danh sách sản phẩm --------------------------------------------------------
  deleteById(index: any) {
    if (this.listOfItem[index].id === null) {
      this.listOfItem = this.listOfItem.filter((item: any) => item.itemCode !== this.listOfItem[index].itemCode);
    } else {
      this.http.delete<any>(`${this.address}/${this.path}/iqc/delete/${this.listOfItem[index].id}`).subscribe(() => {
        this.listOfItem = this.listOfItem.filter((item: any) => item.itemCode !== this.listOfItem[index].itemCode);
        if (this.listOfItem.length > 5) {
          document.getElementById('table-body')!.style.width = '99.9%';
        } else {
          document.getElementById('table-body')!.style.width = '99%';
        }
        Swal.fire({
          title: 'Xóa',
          text: 'Bạn đã xóa thông tin sản phẩm thành công! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
      })
    }
  }
  updateItem(id: any) {
    if (id === null) {
      document.getElementById(`null-input-po-quantity`)!.hidden = false;
      document.getElementById(`null-input-lot-number`)!.hidden = false;
      document.getElementById(`null-input-bill-number`)!.hidden = false;
      document.getElementById(`null-input-quantity-check`)!.hidden = false;
      document.getElementById(`null-input-note`)!.hidden = false;
      document.getElementById(`null-input`)!.hidden = false;
      document.getElementById(`null-button`)!.hidden = false;
      document.getElementById(`null-span-po-quantity`)!.hidden = true;
      document.getElementById(`null-span-lot-number`)!.hidden = true;
      document.getElementById(`null-span-bill-number`)!.hidden = true;
      document.getElementById(`null-span-quantity-check`)!.hidden = true;
      document.getElementById(`null-span-note`)!.hidden = true;
      document.getElementById(`null-span`)!.hidden = true;

    } else {
      if (document.getElementById(`${id.toString()}-input`)!.hidden == true) {
        document.getElementById(`${id.toString()}-input-po-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-lot-number`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-bill-number`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-quantity-check`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-note`)!.hidden = false;
        document.getElementById(`${id.toString()}-input`)!.hidden = false;
        document.getElementById(`${id.toString()}-button`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-po-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-lot-number`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-bill-number`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-quantity-check`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-note`)!.hidden = true;
        document.getElementById(`${id.toString()}-span`)!.hidden = true;
      } else {
        document.getElementById(`${id.toString()}-input-po-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-lot-number`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-bill-number`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-quantity-check`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-note`)!.hidden = true;
        document.getElementById(`${id.toString()}-input`)!.hidden = true;
        document.getElementById(`${id.toString()}-button`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-po-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-lot-number`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-bill-number`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-quantity-check`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-note`)!.hidden = false;
        document.getElementById(`${id.toString()}-span`)!.hidden = false;
      }
    }
  }
  addNewItem() {
    var date = new Date
    var item = {
      id: null,
      itemCode: '',
      itemName: '',
      billNumber: '',
      lotNumber: '',
      poQuantity: 0,
      quantityCheck: 0,
      createdAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      updateAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      username: 'admin',
      note: '',
      iqcElecCompId: this.iqcElecCompId,
    }
    this.listOfItem = [item, ... this.listOfItem];

    setTimeout(() => {

      if (this.listOfItem.length > 5) {
        document.getElementById('table-body')!.style.width = '99.9%';
      } else {
        document.getElementById('table-body')!.style.width = '99%';
      }
      this.updateItem(null);
    }, 50)
  }
  getListOfItems(value: any) {
    if (value.length > 5) {
      this.oitmService.searchBycode(value).subscribe((data: any) => {
        this.listOfItems = data.lstOitm;
        // console.log('hello', this.listOfItems);
      });
    }
  }
  submit(index: any) {
    if (index === null) {
      const body = { auditType: this.actRoute.snapshot.params['type'], item: [this.listOfItem[index]] };
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, body).subscribe(res => {
        Swal.fire({
          title: 'Thêm mới',
          text: 'Thành công thêm mới thông tin sản phẩm  ! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
        this.listOfItem.forEach((item: any) => {
          var result = res.find((item1: any) => item1.itemCode === item.Code);
          if (result) {
            item.id = result.id;
          }
        })
        setTimeout(() => {
          this.updateItem(null);
        }, 100);
      })
    } else {
      const body2 = { auditType: this.actRoute.snapshot.params['type'], item: [this.listOfItem[index]] };
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, body2).subscribe(res => {
        Swal.fire({
          title: 'Thêm mới',
          text: 'Thành công thêm mới thông tin sản phẩm ! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
        this.listOfItem[index].id = res[0].id;
        setTimeout(() => {
          this.updateItem(null);
        }, 100);
      })
    }
  }
  checkDuplicate() {
    for (let i = 0; i < this.listOfItem.length; i++) {
      if (this.listOfItem[i].itemCode === this.itemResult.itemCode) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại mã sản phẩm ! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
      }
    }
  }
  submitItem(index: any) {
    if (this.listOfItem[index].itemCode === '') {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng điền mã sản phẩm ! ',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 5000
      })
    } else {
      const body = { auditType: this.actRoute.snapshot.params['type'], item: [this.listOfItem[index]] };
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, body).subscribe((res) => {
        this.listOfItem[index].id = res[0].id;
        setTimeout(() => {
          this.updateItem(this.listOfItem[index].id);
        }, 50)
        this.listOfItems = [];
        Swal.fire({
          title: 'Cập nhật',
          text: 'Bạn đã cập nhật thông tin sản phẩm thành công ! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
      })
    }
  }
  // --------------------------------------------------------------------------- Khai báo lỗi -------------------------------------------------------
  updateError(id: any, errGroup: any) {
    if (id === null) {
      document.getElementById(`null-input-error-errCode`)!.hidden = false;
      document.getElementById(`null-input-quantity`)!.hidden = false;
      document.getElementById(`null-input-error-errGroup`)!.hidden = false;
      document.getElementById(`null-input-error-note`)!.hidden = false;
      document.getElementById(`null-button-error`)!.hidden = false;
      document.getElementById(`null-span-error-errCode`)!.hidden = true;
      document.getElementById(`null-span-quantity`)!.hidden = true;
      document.getElementById(`null-span-error-errGroup`)!.hidden = true;
      document.getElementById(`null-span-error-note`)!.hidden = true;
    } else {
      if (document.getElementById(`${id.toString()}-input-error-errCode`)!.hidden == true) {
        this.onChangeErrorGroup(errGroup);
        document.getElementById(`${id.toString()}-input-error-errCode`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-error-errGroup`)!.hidden =
          document.getElementById(`${id.toString()}-input-error-note`)!.hidden = false;
        document.getElementById(`${id.toString()}-button-error`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-errCode`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-errGroup`)!.hidden =
          document.getElementById(`${id.toString()}-span-error-note`)!.hidden = true;
      } else {
        document.getElementById(`${id.toString()}-input-error-errCode`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-error-errGroup`)!.hidden =
          document.getElementById(`${id.toString()}-input-error-note`)!.hidden = true;
        document.getElementById(`${id.toString()}-button-error`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-errCode`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-errGroup`)!.hidden =
          document.getElementById(`${id.toString()}-span-error-note`)!.hidden = false;
      }
    }
  }
  submitError(index: any) {
    if (this.listOfError[index].quantity == 0) {
      Swal.fire(
        'Lỗi',
        'Số lượng lỗi cần lớn hơn 0 !',
        'warning'
      )
      return;
    }
    if (this.listOfError[index].errorCode === '') {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng điền lỗi ! ',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 5000
      })
    } else {
      var item = this.listOfItem.find(item1 => item1.itemCode === this.listOfError[index].itemCode);
      // console.log('submit', item);
      this.listOfError[index].electCompId = this.iqcElecCompId;
      setTimeout(() => {
        this.listOfError[index].auditResultItemId = item.id;
        var data = [this.listOfError[index]]
        this.http.post<any>(`${this.address}/${this.path}/error/submit`, data).subscribe((res) => {
          this.listOfError[index].id = res[0].id;
          this.listOfErrorWait.push(this.listOfError[index]);
          // console.log('list error', this.listOfErrorWait);
          setTimeout(() => {
            this.updateError(this.listOfError[index].id, '');
          }, 50)
          this.listOfItems = [];
          Swal.fire({
            title: 'Cập nhật',
            text: 'Bạn đã cập nhật thông tin lỗi thành công ! ',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
        })
      }, 100);
    }
  }
  submitErrors() {
    var item1 = this.listOfError.find((item2: any) => item2.errCode === '');
    var auditResultItemId = this.listOfItem.find(item1 => item1.itemCode === this.listOfError[0].itemCode);
    // console.log({ code1: item1, code2: this.listOfError[0] })
    setTimeout(() => {
      if (item1) {
        Swal.fire(
          'Lỗi',
          'Vui lòng điền lỗi !',
          'warning'
        )
      } else {
        this.listOfError.forEach((item: any) => {
          item.electCompId = this.iqcElecCompId,
            item.auditResultItemId = auditResultItemId.id
        })
        setTimeout(() => {
          this.http.post<any>(`${this.address}/${this.path}/error/submit`, this.listOfError).subscribe((res) => {
            this.listOfError = res;
            document.getElementById('btn-save-item')!.hidden = true;
            setTimeout(() => {
              this.listOfError.forEach((item: any) => {
                item.itemCode = this.itemCode,
                  this.updateError(item.id, '')
              })
            }, 50)
            this.listOfItems = [];
            Swal.fire(
              'Cập nhật',
              'Bạn đã cập nhật thông tin lỗi thành công.',
              'success'
            )
          })
        }, 100);
      }
    }, 10);
  }
  deleteErrorById(index: any) {
    if (this.listOfError[index].id === null) {
      this.listOfError = this.listOfError.filter((item: any) => item.errCode !== this.listOfError[index].errCode);
    } else {
      this.http.delete<any>(`${this.address}/${this.path}/errors/delete/${this.listOfError[index].id}`).subscribe(() => {
        this.listOfError = this.listOfError.filter((item: any) => item.errCode !== this.listOfError[index].errCode);
        Swal.fire({
          title: 'Xóa',
          text: 'Bạn đã xóa thông tin lỗi thành công ! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
      })
    }
  }
  addNewError() {
    var date = new Date
    if (this.iqcElecCompId == 0) {
      this.iqcElecCompId = 1;
    }
    setTimeout(() => {
      var item = {
        id: null,
        itemCode: this.itemCode,
        errCode: '',
        errGroup: '',
        errName: '',
        quantity: 0,
        ratio: 0,
        electCompId: this.iqcElecCompId,
        auditResultItemId: this.auditResultItemId,
        createdAt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        username: 'admin',
        note: '',
      }
      this.listOfError = [item, ... this.listOfError];
      setTimeout(() => {
        // document.getElementById('btn-save-item')!.hidden = false;
        this.updateError(null, '');
      }, 50)
    }, 100);
  }
  openPopupError(content: any, item: any) {
    console.log('check item: ', item)
    this.errCode = '';
    this.errGroup = '';
    this.errName = '';
    if (item === null) {
      this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
        this.listOfError = res;
      })
    } else {
      this.itemCode = item.itemCode;
      this.http.get<any>(`${this.address}/${this.path}/errors/audit-result-item-id/${item.id}`).subscribe(res => {
        this.listOfError = res;
        this.getLstItemCode();
      })
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
  findInListErrors() {
    const data = { errCode: this.errCode, errName: this.errName, errGroup: this.errGroup, itemCode: this.itemCode, electCompId: this.id };
    this.http.post<any>(`${this.address}/${this.path}/errors/search`, data).subscribe(res => {
      this.listOfError = res;
      // console.log('list errors: ', res, this.id);
    })
  }
  getLstItemCode() {
    this.lstItemCode = [];
    var list = this.listOfError.filter((item: any) => item.itemCode.includes(this.itemCode));
    list.forEach((item: any) => {
      const data = this.lstItemCode.find((x: any) => x.itemCode === item.itemCode);
      if (!data) {
        this.lstItemCode.push(item);
      }
    })
    this.getLstErrGroup();
    this.getLstErrCode();
    this.getLstErrName();
  }
  getLstErrCode() {
    this.lstErrCode = [];
    var list = this.listOfError.filter((item: any) => item.errCode.includes(this.errCode) && item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrCode.find((x: any) => x.errCode === item.errCode);
      if (!data) {
        this.lstErrCode.push(item);
      }
    })
    this.getLstErrName();
  }
  getLstErrName() {
    this.lstErrName = [];
    var list = this.listOfError.filter((item: any) => item.errName.includes(this.errName) && item.errCode.includes(this.errCode) && item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrName.find((x: any) => x.errName === item.errName);
      if (!data) {
        this.lstErrName.push(item);
      }
    })
  }
  getLstErrGroup() {
    this.lstErrGroup = [];
    var list = this.listOfError.filter((item: any) => item.itemCode.includes(this.itemCode) && item.errGroup.includes(this.errGroup));
    list.forEach((item: any) => {
      const data = this.lstErrGroup.find((x: any) => x.errGroup === item.errGroup);
      if (!data) {
        this.lstErrGroup.push(item);
      }
    })
    this.getLstErrCode();
    this.getLstErrName();
  }
  getListErrorGroup() {
    this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all`).subscribe(res => {
      this.listErrorGroup = res;
    })
  }
  getListError() {
    this.http.get<any>(`${this.address}/${this.path}/errors/get-all`).subscribe(res => {
      this.listErrors = res;
    })
  }
  getListErrorById(errGroup: any, index: any) {
    var data = this.listErrorGroup.find((item: any) => item.errGroup === errGroup);
    this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all/${data.id}`).subscribe(res => {
      // console.log("check result", res)
      this.listErrors = res;
      setTimeout(() => {
        if (this.listErrors.length === 0) {
          this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all/null`).subscribe(res => {
            this.listOfError[index].errGroup = '';
            this.listErrors = res;
          })
        }
      }, 100);
    })
  }
  mappingErrCode(errName: any, index: any) {
    var data = this.lstError!.find((item: any) => item.name == errName);
    this.listOfError[index].errCode = data!.description;
  }
  findByCritiCalGroup() {
    this.listOfCriticalName = [];
    var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'LKDT' }
    this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
      this.listOfCriticalName = res;
      // console.log(this.listOfCriticalName)

    })
    // }else if(this.examinationType === '3'){
    //   var data = {testingCriticalGroup:this.testingCriticalGroup,type:'Đánh giá CL SP'}
    //   this.http.post<any>(`${this.address}/${this.path}/get-list-guide`,data).subscribe(res=>{
    //     this.listOfCriticalName = res;
    //     console.log(this.listOfCriticalName)

    //   })
    // }
  }
  onSelectedOriginS() {
    this.strSelectOrigin = this.selectedOrigin.name;
    this.formSearch.origin = this.selectedOrigin.name;
    console.log(this.formSearch.origin);

  }
}
