
import { KeycloakService } from 'keycloak-angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { IqcComponentNVLResponse } from 'src/app/share/response/iqcComponent/iqcComponentNVLResponse';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { OitmResponse } from 'src/app/share/response/oitm/OitmResponse';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { OitmObjResponse } from 'src/app/share/response/oitm/OitmObjResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { IqcCheckService } from 'src/app/share/_services/iqcNvl.service';
import Utils from 'src/app/share/_utils/utils';
import { Constant } from 'src/app/share/_services/constant';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-check-nvl',
  templateUrl: './check-nvl.component.html',
  styleUrls: ['./check-nvl.component.css']
})
export class CheckNvlComponent implements OnInit {
  // ------------------------------------------------ list item ----------------------------------------------
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  //list item
  listOfItem: any[] = [];
  listOfItems: any;
  @Input() itemResult: any;
  itemcode: any;
  iqcElecCompId: any;
  //----------------------------------------- autocomplete ---------------------------------------
  testingCriticalGroup: any;
  listOfCriticalGroup: any;
  listOfCriticalName: any;
  //------------------------------------------------- list errors ---------------------------------------------
  listOfError: any;
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

  validateForm!: UntypedFormGroup;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  auditnvl: any[] = [];
  examiantionRes?: IqcComponentNVLResponse;
  formSearch: any = {
  };
  lstview = true;
  id: any;
  searchExaminationCtrl = new FormControl();
  searchELectronicCtrl = new FormControl();
  filteredExamination = new ExaminationResponse();
  filteredOitm = new OitmResponse();
  isLoading = false;
  isLoadingElec = false;
  errorMsg!: string;
  minLengthTerm = 3;
  minLengthElectronic = 6;
  selectedEx: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  lstAuditCriteriaNvl: AuditCriteriaNvl[] = [];
  lstElectronic?: Array<OitmObjResponse> = [];
  error?: string;
  classError?: string;
  form: any = {};
  formAddCheck: any = {};
  formErrorChild: any = {};
  errorAdd?: string;
  arrErrChild: Array<ErrorElectronicComponent> = [];
  lstErrorRes?: ErrorListResponse;

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  typeAction?: any;
  constructor(
    private actRoute: ActivatedRoute,
    private exampleService: ExaminationService,
    private modalService: NgbModal,
    private errorService: ErrorListService,
    private oitmService: OitmService,
    private router: Router,
    private tokenStorage: KeycloakService,
    private iqcCheckService: IqcCheckService,
    protected http: HttpClient

  ) {
  }

  onSelected() {
    console.log('select', this.selectedEx);
    this.http.get<any>(`${this.address}/${this.path}/examinations/get-all/${this.selectedEx.id}`).subscribe(res => {
      this.listOfItem = res;
    })
    this.strSelect = this.selectedEx.name + '(' + this.selectedEx.code + ')';
    this.lstAuditCriteriaNvl = this.selectedEx.lstAuditCriteriaNvl;
    this.lstAuditCriteriaNvl.forEach((element) => {
      element.auditCriteriaId = element.id + '';
      element.minAudit = element.min;
      element.maxAudit = element.max;
      element.noteAudit = element.note;
      element.unitAudit = element.unit;
      element.min = '';
      element.max = '';
      element.note = '';
      element.checkResult = 'Đạt'
      element.regulationLevel = element.regulationLevel;
      element.ids = Utils.randomString(5);
    })
  }

  onSelectedElectronic(index: any, itemCode: any) {
    this.itemResult = itemCode;
    var check = false;
    for (let i = 0; i < this.listOfItem.length; i++) {
      if (this.listOfItem[i].itemCode === this.itemResult.itemCode) {
        check = true;
        Swal.fire(
          'Lỗi',
          'Đã tồn tại mã sản phẩm !',
          'warning'
        )
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
    console.log("check lk", this.selectedElectronic);
    this.strSelectElec = this.selectedElectronic.itemCode;
    this.lstElectronic = this.selectedElectronic.lstAuditCriteriaNvl;
    this.form.electCompName = this.selectedElectronic.itemName;
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    this.selectedEx = '';
    this.filteredExamination = new ExaminationResponse();
  }

  async refreshExamination() {
    const { name, code, iqcCode, reportCode, invoiceNumber, startDate, endDate, status, itemType } = this.formSearch;
    const dataSearch = {
      name: name,
      code: code,
      iqcCode: iqcCode,
      reportCode: reportCode,
      startDate: startDate ? startDate + " 00:00:00" : null,
      endDate: endDate ? endDate + " 23:59:59" : null,
      status: status,
      itemType: itemType,
      invoiceNumber: invoiceNumber
    }
    let data = await this.iqcCheckService.getAll(this.page, this.pageSize, dataSearch, Constant.TYPE_ELECTRIC_COMPONENT_NVL, Constant.IQC_TYPE_CREATE)
    console.log(data);
    this.auditnvl = data.lst;
    this.collectionSize = Number(data.total) * this.pageSize;
  }

  ngOnInit(): void {
    this.typeAction = this.actRoute.snapshot.params['type']
    this.id = this.actRoute.snapshot.params['id'];
    console.log(this.typeAction);
    this.getListError();
    this.getListErrorGroup();
    if (this.typeAction) {
      this.iqcElecCompId = this.id;
      this.lstview = false;
      this.initCreate();
    } else {
      this.lstview = true;
      this.refreshExamination();
    }
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
        this.iqcCheckService.downloadfileNVL(id, fileName, this.listOfError);
      }, 100)
    })
  }

  /**
  * thêm mới thông tin kiểm tra
  */
  async onAddErrorChild() {
    const { errGroup, errName, quantity, ratio, note } = this.formErrorChild;
    const errorChild = new ErrorElectronicComponent(
      errName, errGroup, quantity, ratio, note, Utils.randomString(5)
    );

    if (this.typeAction == 'edit') {
      errorChild.electCompId = this.id;
      let data = await this.iqcCheckService.addCheckParam({ errParam: errorChild, type: 'ERROR' });
      if (data.result.responseCode == '00') {
        errorChild.id = data.id;
        this.arrErrChild.push(errorChild);
        Swal.fire("Thành công", "Bạn đã thêm thông tin kiểm tra thành công", "success")
      }
    } else {
      this.arrErrChild.push(errorChild);
    }
  }

  async onAddCheck() {
    const { criteriaName, regulationLevel, minAudit, maxAudit, unitAudit, noteAudit, ortherRequerement, quantityAudit, min, max, checkResult, note } = this.formAddCheck;
    this.formAddCheck.ids = Utils.randomString(5);
    let audit = new AuditCriteriaNvl();
    audit.criteriaName = criteriaName;
    audit.regulationLevel = regulationLevel;
    audit.minAudit = minAudit;
    audit.maxAudit = maxAudit;
    audit.unitAudit = unitAudit;
    audit.noteAudit = noteAudit;
    audit.ortherRequerement = ortherRequerement;
    audit.min = min;
    audit.quantityAudit = quantityAudit;
    audit.max = max;
    audit.note = note;
    audit.checkResult = checkResult;


    if (this.typeAction == 'edit') {
      audit.electCompId = this.id;
      let data = await this.iqcCheckService.addCheckParam({ nvlParam: audit, type: 'NVL' });
      if (data.result.responseCode == '00') {
        audit.id = data.id;
        this.lstAuditCriteriaNvl.push(audit);
        Swal.fire("Thành công", "Bạn đã thêm thông tin kiểm tra thành công", "success")
      }
    } else {
      this.lstAuditCriteriaNvl.push(audit);
    }
    this.modalService.dismissAll();


    this.formAddCheck = {}
  }

  async deleteAuditRow(ids: any, id: any) {

    if (this.typeAction == 'edit') {
      let data = await this.iqcCheckService.deleteItemCheck(id, this.id, 'NVL');
      if (data.result.responseCode == '00') {
        Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
      }
    }

    this.lstAuditCriteriaNvl.forEach((element, index) => {
      if (element.ids == ids) {
        this.lstAuditCriteriaNvl.splice(index, 1);
      }
    });
  }

  async deleteErrorRow(ids: any, id: any) {

    if (this.typeAction == 'edit') {
      let data = await this.iqcCheckService.deleteItemCheck(id, this.id, 'ERROR');
      if (data.result.responseCode == '00') {
        Swal.fire("Thành công", "Bạn đã xóa thông tin kiểm tra thành công", "warning")
      }
    }

    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.arrErrChild.splice(index, 1);
      }
    });
  }

  open(content: any) {
    var data = { type: 'NVL' }
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

  onChangeErrorGroup(name: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == name) {
        this.lstError = element.errChild;
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
      this.formErrorChild.ratio = number.toFixed(2) + '%';
    }
  }

  onChangeQuantity() {
    var checkQuantity = this.form.checkingQuantity;
    if (this.form.checkingQuantity != null && this.arrErrChild.length !== 0) {
      this.arrErrChild.forEach((element) => {
        var ratio =
          (
            (element.quantity / (checkQuantity == 0 ? 1 : checkQuantity)) *
            100
          ).toFixed(2) + '%';
        console.log(ratio);
        element.ratio = ratio;
      });
    }
  }


  // init create and edit
  async initCreate() {
    this.form = {};
    if (this.typeAction == 'add') {
      this.form.reportCode = formatDate(new Date(), 'yyyyMMddhhmmss', 'en_US') + '-RANGDONG-QC';
      this.form.conclusion = "Đạt nhập kho";
      this.form.checkDate = new Date();
      this.form.importDate = new Date();
      this.form.iqcElectType = false;
    } else if (this.typeAction == 'edit' || this.typeAction == 'show') {
      this.http.get<any>(`${this.address}/${this.path}/iqc/get-all/${this.id}`).subscribe(res => {
        this.listOfItem = res;
        if (this.listOfItem.length > 5) {
          document.getElementById('table-body')!.style.width = '99.9%';
        } else {
          document.getElementById('table-body')!.style.width = '99%';
        }
      })
      var id = this.id;
      let data = await this.iqcCheckService.detail(id);
      this.form = data.component;
      if (this.form.iqcElectType == 'false') {
        this.form.iqcElectType = false;
      } else {
        this.form.iqcElectType = true;
      }
      console.log("check data :", data)
      this.selectedEx = this.form.templateCode = data.component.templateCode;
      this.form.checkDate = new Date(this.form.checkDate);
      this.form.importDate = new Date(this.form.importDate);
      this.lstAuditCriteriaNvl = data.component.resultNvls;
      this.lstAuditCriteriaNvl.forEach(element => {
        element.ids = Utils.randomString(5);
      })
      this.form.id = id;
      this.form.templateCode = data.component.templateCode;
      this.form.elecCompCode = data.component.elecCompCode;
      this.arrErrChild = [];
    }



    this.errorService.getAllCategories().subscribe(
      (data) => {
        this.lstErrorRes = data;
        this.lstErrorGr = data.lstError;
        console.log(this.lstErrorRes);
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
          this.exampleService.searchBycode(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.filteredExamination = data;
        console.log(this.filteredExamination);
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
        console.log('hello', this.filteredOitm);
      });
  }

  /**
   * thêm mới thông tin audit
   */
  async onSubmit(buttonType: any) {
    var checkResult = false;
    if ((this.selectedEx === '' || this.form.reportCode === '' || this.form.itemType === '' || this.form.origin === '' ||
      this.form.grpoNumber === '') ||
      (this.selectedEx === null || this.form.reportCode === null || this.form.itemType === null || this.form.origin === null ||
        this.form.grpoNumber === null)) {
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
          this.form.importDate != null ? moment(this.form.importDate).format('DD-MM-YYYY') : '';
        this.form.checkDateStr = this.form.checkDate != null ? moment(this.form.checkDate).format('DD-MM-YYYY') : '';
        this.form.elecCompCode = this.strSelectElec;
        this.form.type = Constant.TYPE_ELECTRIC_COMPONENT_NVL;

        if (this.typeAction == 'add') {
          this.form.templateCode = this.selectedEx.code;
        }

        let message = "Thêm mới biên bản thành công.";
        let showPage = false;
        if (buttonType == 'save') {
          this.form.status = 'DRAFF';
        } else if (buttonType == 'send_approve') {
          this.form.status = 'WAIT_APPROVE';
          showPage = true;
          message = "Bạn đã thực hiện gửi yêu cầu phê duyệt thành công";
        }

        // let data = await this.iqcCheckService.create(this.form, this.lstAuditCriteriaNvl, null, null, this.arrErrChild, 'ADD');
        let data = await this.iqcCheckService.create(this.form, this.lstAuditCriteriaNvl, null, null, 'ADD');
        if (data && data.result.responseCode == '00') {
          Swal.fire('Thành công', message, 'success')
          Swal.fire({
            title: 'Thành công',
            text: message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Đồng ý',
          }).then(async (result) => {
            if (showPage) {
              this.router.navigate([`/iqc/iqc-nvl-check/${data.id}/show`, {},]).then(() => {
                this.iqcElecCompId = data.id;
                this.listOfItem.forEach((item: any) => item.iqcElecCompId = data.id);
                setTimeout(() => {
                  var result = this.listOfItem.filter((item: any) => item.itemCode !== '')
                  this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, result).subscribe();
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }, 100);
              });
            } else {
              this.router.navigate([
                `/iqc/iqc-nvl-check/${data.id}/edit`,
                {},
              ]).then(() => {
                this.iqcElecCompId = data.id;
                this.listOfItem.forEach((item: any) => item.iqcElecCompId = data.id);
                setTimeout(() => {
                  var result = this.listOfItem.filter((item: any) => item.itemCode !== '')
                  this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, result).subscribe();
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }, 100);
              });

            }
          })
        }
      }
    }, 100);
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
      this.router.navigate([`/iqc/iqc-nvl-check/${data.id}/edit`, {},]);
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
        Swal.fire(
          'Xóa',
          'Bạn đã xóa thông tin sản phẩm thành công.',
          'success'
        )
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
        console.log('hello', this.listOfItems);
      });
    }
  }
  submit(index: any) {
    if (index === null) {
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, this.listOfItem).subscribe(res => {
        Swal.fire(
          'Thêm mới',
          'Thành công thêm mới thông tin sản phẩm .',
          'success'
        )
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
      var data = [this.listOfItem[index]];
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, data).subscribe(res => {
        Swal.fire(
          'Thêm mới',
          'Thành công thêm mới thông tin sản phẩm .',
          'success'
        )
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
        Swal.fire(
          'Lỗi',
          'Đã tồn tại mã sản phẩm !',
          'warning'
        )
      }
    }
  }
  submitItem(index: any) {
    if (this.listOfItem[index].itemCode === '') {
      Swal.fire(
        'Lỗi',
        'Vui lòng điền mã sản phẩm !',
        'warning'
      )
    } else {
      var data = [this.listOfItem[index]]
      this.http.post<any>(`${this.address}/${this.path}/iqc/submit`, data).subscribe((res) => {
        this.listOfItem[index].id = res[0].id;
        setTimeout(() => {
          this.updateItem(this.listOfItem[index].id);
        }, 50)
        this.listOfItems = [];
        Swal.fire(
          'Cập nhật',
          'Bạn đã cập nhật thông tin sản phẩm thành công.',
          'success'
        )
      })
    }
  }
  // --------------------------------------------------------------------------- Khai báo lỗi -------------------------------------------------------
  updateError(id: any) {
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
    if (this.listOfError[index].errorCode === '') {
      Swal.fire(
        'Lỗi',
        'Vui lòng điền lỗi !',
        'warning'
      )
    } else {
      var item = this.listOfItem.find(item1 => item1.itemCode === this.listOfError[index].itemCode);
      console.log('submit', item);
      this.listOfError[index].electCompId = this.id;
      setTimeout(() => {
        this.listOfError[index].auditResultItemId = item.id;
        var data = [this.listOfError[index]]
        this.http.post<any>(`${this.address}/${this.path}/error/submit`, data).subscribe((res) => {
          this.listOfError[index].id = res[0].id;
          setTimeout(() => {
            this.updateError(this.listOfError[index].id);
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
  }
  submitErrors() {
    var item1 = this.listOfError.find((item2: any) => item2.errCode === '');
    var auditResultItemId = this.listOfItem.find(item1 => item1.itemCode === this.listOfError[0].itemCode);
    console.log({ code1: auditResultItemId, code2: this.listOfError[0] })
    setTimeout(() => {
      if (item1) {
        Swal.fire(
          'Lỗi',
          'Vui lòng điền lỗi !',
          'warning'
        )
      } else {
        this.listOfError.forEach((item: any) => {
          item.electCompId = this.id,
            item.auditResultItemId = auditResultItemId.id
        })
        setTimeout(() => {
          this.http.post<any>(`${this.address}/${this.path}/error/submit`, this.listOfError).subscribe((res) => {
            this.listOfError = res;
            document.getElementById('btn-save-item')!.hidden = true;
            setTimeout(() => {
              this.listOfError.forEach((item: any) => {
                item.itemCode = this.itemCode,
                  this.updateError(item.id)
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
        Swal.fire(
          'Xóa',
          'Bạn đã xóa thông tin lỗi thành công.',
          'success'
        )
      })
    }
  }
  addNewError() {
    var date = new Date
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
      document.getElementById('btn-save-item')!.hidden = false;
      this.updateError(null);
    }, 50)
  }
  openPopupError(content: any, item: any) {
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
      console.log('list errors: ', res, this.id);
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
    if (this.id !== undefined) {
      this.http.get<any>(`${this.address}/${this.path}/errors/get-all`).subscribe(res => {
        this.listErrors = res;
        this.http.get<any>(`${this.address}/${this.path}/errors/elect-comp-id/${this.id}`).subscribe(res => {
          this.listOfError = res;

        })
      })
    }
  }
  getListErrorById(errGroup: any, index: any) {
    var data = this.listErrorGroup.find((item: any) => item.errGroup === errGroup);
    this.http.get<any>(`${this.address}/${this.path}/errors/group/get-all/${data.id}`).subscribe(res => {
      console.log("check result", res)
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
    var data = this.listErrors.find((item: any) => item.errName === errName);
    this.listOfError[index].errCode = data.errCode;
  }
  findByCritiCalGroup() {
    this.listOfCriticalName = [];
    var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'NVL' }
    this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
      this.listOfCriticalName = res;
      console.log(this.listOfCriticalName)
    })
  }
}
