import { Observable, startWith, map, firstValueFrom } from 'rxjs';
import { FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import Utils from 'src/app/share/_utils/utils';
import { StepCheck } from '../aprove-quality-evaluation/aprove-quality-evaluation.component';
import {
  Component,
  OnInit,
  Input,
  HostListener,
  Directive,
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { StoreCheckService } from 'src/app/share/_services/store_check.service';
import { ScadaRequestService } from 'src/app/share/_services/scada-request.service';
import { AqlTemplateService } from 'src/app/share/_services/aqlTemplate.service';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { CommonService } from 'src/app/share/_services/common.service';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { TinSerial } from 'src/app/share/_models/tin_serial.model';
import { StoreCheckError } from 'src/app/share/_models/storeCheckError.model';
import { StoreCheckStructure } from 'src/app/share/_models/storeCheckStructure.model';
import { StoreElectronic } from 'src/app/share/_models/storeElectronic.model';
import { StoreCheckSize } from 'src/app/share/_models/storeCheckSize.model';
import { StoreCheckSafe } from 'src/app/share/_models/storeCheckSafe.model';
import { StoreCheckConfused } from 'src/app/share/_models/storeCheckConfused.model';
import { StoreCheck } from 'src/app/share/_models/storeCheck.model';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';



@Component({
  selector: 'app-store-check',
  templateUrl: './store-check.component.html',
  styleUrls: ['./store-check.component.css'],
})
export class StoreCheckComponent implements OnInit {
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  //Điều kiện triển khai hiện tại
  path = 'store-check';
  packing = '';
  tray = '';
  serial: string[] = [];
  text = '';
  lstCheckStep?: string[] = []
  @HostListener('document:keydown', ['$event'])
  clickout(event: any) {
    if (event.code == 'Enter' || event.code == 'Tab') {
      if (this.packing == '') {
        this.packing = this.replaceAll(this.text, 'Shift', '');
        this.packing = this.replaceAll(this.packing, 'Backspace', '');
      } else if (this.tray == '') {
        this.tray = this.replaceAll(this.text, 'Shift', '');
        this.tray = this.replaceAll(this.tray, 'Backspace', '');
      } else {
        var textSerial = this.replaceAll(this.text, 'Shift', '');
        textSerial = this.replaceAll(textSerial, 'Backspace', '');
        this.serial.push(textSerial);
      }
      this.text = '';
    }
    if (event.code != 'Shift' && event.code != 'Enter') {
      this.text += event.key;
      console.log(this.text);
    }

    console.log('abc :: ' + this.packing);
  }
  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  @Input() show_check = '';
  idWorkOrder?: string;
  show_work_order = true;

  lstview = true;
  crud = false;
  create = false;
  edit = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private errorService: ErrorListService,
    private storeCheckService: StoreCheckService,
    private scadaService: ScadaRequestService,
    private aqlService: AqlTemplateService,
    private exportExelService: ExportExcelService,
    private commonService: CommonService,
    protected http: HttpClient
  ) { }
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  lstErrCheck: any = [];
  myControl = new FormControl('');
  options: string[] = [];
  lstProductionLine?: any[] = [];
  filteredOptions?: Observable<string[]>;
  lstColor?: any[] = [];
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
    sap: null
  };

  formEx: any = {
  };

  form: any = {};

  formErrorChild: any = {};
  ngOnInit(): void {
    this.getInfo();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = (value ?? "").toLowerCase();
    return this.options?.filter(option => (option ?? "").toLowerCase().includes(filterValue));
  }


  id?: any;
  lstCheck: StepCheck[] = []
  async getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;

    this.commonService.statusStep(id).toPromise().then(
      data => {
        this.lstCheck = data.lstStep;
        this.lstCheck.forEach(element => {
          this.lstCheckStep?.push(element.step);
          element.checked = true;
        });
      },
      error => { }
    )

    var type = this.actRoute.snapshot.params['type'];
    if (id == null && type == null) {
      this.lstview = true;
      this.crud = false;
    }

    if (type == 'add') {
      this.edit = false;
      this.create = true;
      this.lstview = false;
      this.errorService.getAllCategories().subscribe(
        (data) => {
          this.lstErrorRes = data;
          this.lstErrorGr = data.lstError;
          console.log(this.lstErrorRes);
        },
        (err) => { }
      );
    } else if (type == 'edit') {
      this.edit = true;
      this.create = false;
      this.lstview = false;
    } else if (type == 'show') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      this.show_work_order = false;
    }

    this.idWorkOrder = id;
    if (this.show_check == 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }
    console.log(this.lstview);

    this.storeCheckService.getColorSap().subscribe(data => {
      this.lstColor = data.lstColor;
    });

    if (!this.lstview) {

      let dataLine = await firstValueFrom(this.scadaService.getLine());
      this.lstProductionLine = dataLine.lstLine;
      this.lstProductionLine?.forEach(({ name, code }) => {
        this.options.push(`${name} - ${code}`);
      })

      // load check store
      this.storeCheckService
        .loadStoreCheckByWoId(this.id)
        .toPromise()
        .then(
          (data) => {
            this.lstStoreCheck = data.lstCheck;
            console.log('load check store', data.lstCheck);
            this.lstStoreCheck.forEach((element) => {
              element.ids = Utils.randomString(5);
              element.statusApproveSapStr = Utils.getStatusName(element.statusApproveSap);
            });
          },
          (error) => { }
        );
    }
  }

  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
    windowClass: 'modal-xxl',
    backdrop: 'static',
    keyboard: false,
  };
  modalOptionss: NgbModalOptions = {
    size: 'lg',
    // windowClass: 'modal-xxl',
    backdrop: 'static',
    keyboard: false,
  };
  error = '';
  onSubmit(action: any) {
    console.log(this.formEx);
    var data = {
      lstCheckStore: this.lstStoreCheck,
    };
    this.pqcService
      .addStep(data, 'STORE_CHECK', this.actRoute.snapshot.params['id'], action)
      .toPromise()
      .then(
        (data) => {
          this.edit = false;
          this.create = false;

          Swal.fire(
            'Thành công',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
        },
        (err) => { }
      );
  }

  deleteCheck(ids: any, action: any, id: any) {

    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện xóa',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.delete(ids, action, id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  delete(ids: any, action: any, id: any) {
    if (action == 'CHECK') {
      this.lstStoreCheck?.forEach((element, index) => {
        if (element.ids == ids) {
          this.lstStoreCheck?.splice(index, 1);

          if (element.id != '') {
            this.storeCheckService
              .remove(element.id, 'CHECK')
              .toPromise()
              .then(
                (data) => {
                  Swal.fire(
                    'Xóa thông tin',
                    'Bạn đã thực hiện xóa thông tin kiểm tra thành công.',
                    'success'
                  )
                },
                (error) => { }
              );
          }
        }
      });
    } else {
      this.lstStoreCheck.forEach((element) => {

        console.log(ids, action)

        if (element.ids == ids) {
          this.storeCheck = element;
          this.storeCheckService.remove(id, action).subscribe(
            data => {
              Swal.fire(
                'Xóa',
                'Thành công',
                'warning'
              )
            },
            error => { }
          );
          switch (action) {
            case 'ELEC':
              element.lstElectronic.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quantityCheck));
                  element.lstElectronic?.splice(index, 1);
                }
              });
              break;

            case 'EXTER':
              element.lstExternal.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quantity));
                  element.lstExternal?.splice(index, 1);
                }
              });
              break;

            case 'SIZE':
              element.lstSize.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quatity));
                  element.lstSize?.splice(index, 1);
                }
              });
              break;
            case 'SAFE':
              element.lstSafe.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quatity));
                  element.lstSafe?.splice(index, 1);
                }
              });

              break;
            case 'CONFUSED':
              element.lstConfused.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quatity));
                  element.lstConfused?.splice(index, 1);
                }
              });
              break;
            case 'STRUCTURE':
              element.lstStructure.forEach((ele, index) => {
                if (ele.id == id) {
                  this.updateStoreCheck(this.openId, 0 - Number(ele.quatity));
                  element.lstStructure?.splice(index, 1);
                }
              });
              break;
            case 'ERROR':
              element.lstErrorCheck.forEach((ele, index) => {
                if (ele.id == id) {
                  element.lstErrorCheck?.splice(index, 1);
                }
              });
              break;
            default:
              break;
          }
        }
      });
    }
  }

  lstStoreCheck: StoreCheck[] = [];
  storeCheck?: any;
  updateStoreCheck(ids: any, quantity: any) {
    var check = new StoreCheck();
    this.lstStoreCheck.forEach((x: StoreCheck) => {
      if (x.id == ids) {
        console.log('check: ', ids, this.lstStoreCheck);
        x.quatity = Number(x.quatity) + Number(quantity);
        check = x;
      }
    });
    this.http.post<any>(`${this.address}/${this.path}/update`, check).subscribe();
  }
  onAddError(action: any, ids: any) {
    console.log("save store check : ", this.formEx, action)
    if (action == 'CHECK' || action == 'CHECK_EDIT') {
      var check = new StoreCheck();
      check.checkDate = this.formEx.checkDate;
      check.quatityStore = this.formEx.quatityStore;
      check.lot = this.formEx.lot;
      check.quatity = 0;
      check.totalErr = this.formEx.totalErr;
      check.checkPerson = this.tokenStorage.getUsername();
      check.ids = Utils.randomString(5);
      check.conclude = this.formEx.conclude;
      check.workOrderId = this.id;
      check.note = this.formEx.note;
      check.id = this.formEx.id;
      check.colorCode = this.formEx.colorCode;
      check.colorName = this.formEx.colorName;
      // call api save
      this.storeCheckService.createUpdateStoreCheck(check).subscribe(
        (data) => {
          if (action == 'CHECK_EDIT') {
            this.lstStoreCheck.forEach((element) => {
              if (element.ids == ids) {
                element.checkDate = this.formEx.checkDate;
                element.quatityStore = this.formEx.quatityStore;
                element.lot = this.formEx.lot;
                element.quatity = this.formEx.quatity;
                element.totalErr = this.formEx.totalErr;
                element.checkPerson = this.tokenStorage.getUsername();
                element.ids = Utils.randomString(5);
                element.conclude = this.formEx.conclude;
                element.workOrderId = this.id;
                element.note = this.formEx.note;
                element.id = this.formEx.id;
                check.colorCode = this.formEx.colorCode;
                check.colorName = this.formEx.colorName;
              }
            });
            Swal.fire(
              'Thành công',
              'Cập nhật thông tin kiểm tra thành công.',
              'success'
            )

          } else {
            check.id = data.id;
            check.statusApproveSap = "DRAFF";
            check.statusApproveSapStr = Utils.getStatusName(check.statusApproveSap);
            this.lstStoreCheck.push(check);
            Swal.fire(
              'Thành công',
              'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
              'success'
            )
          }
          this.modalService.dismissAll();
        },
        (error) => {
          alert('Có lỗi xảy ra vui lòng thử lại sau ít phút.');
        }
      );

      // this.formEx = null;
    } else {
      this.lstStoreCheck.forEach((element) => {
        if (element.ids == ids) {
          var store_check_id = element.id;
          this.storeCheck = element;
          switch (action) {
            case 'ELEC':
              var checkelec = new StoreElectronic();
              checkelec.cosFi = this.formEx.cosFi;
              checkelec.elecCheck = this.formEx.elecCheck;
              checkelec.powCheck = this.formEx.powCheck;
              checkelec.workOrderId = this.id;
              checkelec.ids = Utils.randomString(5);
              checkelec.note = this.formEx.note;
              checkelec.quantityCheck = this.formEx.quantityCheck;
              checkelec.storeCheckId = store_check_id;
              this.updateStoreCheck(store_check_id, this.formEx.quantityCheck);
              this.storeCheckService
                .createCheck(checkelec, 'ELEC')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    this.modalService.dismissAll();
                    checkelec.id = data.id;
                    element.lstElectronic.push(checkelec);
                  },
                  (error) => { }
                );
              break;

            case 'EXTER':
              var quatity = 0;
              this.lstAqlCheck?.forEach(element => {
                element.id = '',
                  element.workOrderId = this.id;
                element.storeCheckId = store_check_id;
                element.allow = element.allowedError;
                quatity += Number(element.quantity);
              })
              this.updateStoreCheck(store_check_id, quatity);
              this.storeCheckService
                .createCheck(this.lstAqlCheck, 'EXTER')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Thực hiện thêm mới thành công',
                      'success'
                    )
                    this.formEx = {}
                    // this.modalService.dismissAll();
                    this.storeCheckService.getLstCheckByStoreId("EXTER", this.openId).subscribe(
                      (data2) => {
                        this.storeCheck.lstExternal = data2.lsCheckExternalInspections
                      }
                    );

                  },
                  (error) => {
                    Swal.fire(
                      'Lỗi',
                      'Có lỗi xảy ra vui lòng thử lại sau.',
                      'warning'
                    )
                  }
                );
              break;

            case 'SIZE':
              var size = new StoreCheckSize();
              size.ids = Utils.randomString(5);
              size.checkPerson = this.tokenStorage.getUsername();
              size.conclude = this.formEx.conclude;
              size.note = this.formEx.note;
              size.quatity = this.formEx.quatity;
              size.storeCheckId = store_check_id;
              size.workOrderId = this.id;
              this.updateStoreCheck(store_check_id, this.formEx.quatity);
              this.storeCheckService
                .createCheck(size, 'SIZE')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    this.modalService.dismissAll();
                    size.id = data.id;
                    element.lstSize.push(size);
                    this.formEx = [];
                  },
                  (error) => { }
                );

              break;
            case 'SAFE':
              var safe = new StoreCheckSafe();
              safe.ids = Utils.randomString(5);
              safe.checkPerson = this.tokenStorage.getUsername();
              safe.conclude = this.formEx.conclude;
              safe.note = this.formEx.note;
              safe.quatity = this.formEx.quatity;
              safe.storeCheckId = store_check_id;
              safe.workOrderId = this.id;
              safe.standard = this.formEx.standard
              this.updateStoreCheck(store_check_id, this.formEx.quatity);
              this.storeCheckService
                .createCheck(safe, 'SAFE')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    safe.id = data.id;
                    element.lstSafe.push(safe);
                    this.formEx = [];
                  },
                  (error) => { }
                );
              break;

            case 'CONFUSED':
              var confu = new StoreCheckConfused();
              confu.ids = Utils.randomString(5);
              confu.checkPerson = this.tokenStorage.getUsername();
              confu.conclude = this.formEx.conclude;
              confu.note = this.formEx.note;
              confu.quatity = this.formEx.quatity;
              confu.storeCheckId = store_check_id;
              confu.workOrderId = this.id;
              this.updateStoreCheck(store_check_id, this.formEx.quatity);
              this.storeCheckService
                .createCheck(confu, 'CONFUSED')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    this.modalService.dismissAll();
                    confu.id = data.id;
                    element.lstConfused.push(confu);
                    this.formEx = [];
                  },
                  (error) => { }
                );
              break;

            case 'STRUCTURE':
              var struct = new StoreCheckStructure();
              struct.ids = Utils.randomString(5);
              struct.checkPerson = this.tokenStorage.getUsername();
              struct.conclude = this.formEx.conclude;
              struct.note = this.formEx.note;
              struct.quatity = this.formEx.quatity;
              struct.storeCheckId = store_check_id;
              struct.workOrderId = this.id;
              this.updateStoreCheck(store_check_id, this.formEx.quatity);
              this.storeCheckService
                .createCheck(struct, 'STRUCTURE')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    this.modalService.dismissAll();
                    struct.id = data.id;
                    element.lstStructure.push(struct);
                    this.formEx = [];
                  },
                  (error) => { }
                );
              break;
            case 'ERROR':
              var error = new StoreCheckError();
              error.err = this.formEx.errName;
              error.grErr = this.formEx.errGroup;
              error.line = this.formEx.line;
              error.note = this.formEx.note;
              error.quatity = this.formEx.quatity;
              error.lot = this.formEx.lot;
              error.workOrderId = this.id;
              error.storeCheckId = store_check_id;
              this.storeCheckService
                .createCheck(error, 'ERROR')
                .toPromise()
                .then(
                  (data) => {
                    Swal.fire(
                      'Thành công',
                      'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
                      'success'
                    )
                    this.modalService.dismissAll();
                    error.id = data.id;
                    element.lstErrorCheck.push(error);
                  },
                  (error) => { }
                );
              break;
            default:
              break;
          }
        }
      });
    }
  }

  onChangeErrorGroup(idx: any) {
    console.log("IDX::" + idx)
    this.lstErrorGr?.forEach((element) => {
      if (element.name == idx) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  titlemodal = '';
  action = '';
  ids = '';
  openId = '';
  idStoreCheck = '';
  open(content: any, title: any, action: any, ids: any, id: any) {

    this.formEx = {};

    if (ids != '') {
      this.ids = ids;
      this.lstStoreCheck.forEach((element) => {
        if (element.ids == ids) {
          this.storeCheck = element;
          this.openId = element.id;
          this.getInfoByAction(action, element.id, element);
          console.log("id:: ", this.openId);
        }
      });
    } else {

    }

    this.titlemodal = title;
    this.action = action;
    this.formEx.checkDate = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    this.formEx.lot = this.wo.lotNumber;

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    if (action == 'PACKING') {
      this.packing = '';
      this.tray = '';
      this.serial = [];
      this.idStoreCheck = id;
    }

    if (action == 'EDIT') {
      this.lstStoreCheck.forEach((element) => {
        if (element.ids == ids) {
          this.formEx.checkDate = element.checkDate;
          this.formEx.quatityStore = element.quatityStore;
          this.formEx.lot = element.lot;
          this.formEx.quatity = element.quatity;
          this.formEx.totalErr = element.totalErr;
          element.checkPerson = this.tokenStorage.getUsername();
          this.formEx.ids = element.ids = ids;
          this.formEx.conclude = element.conclude;
          this.id = element.workOrderId;
          this.formEx.note = element.note;
          this.formEx.id = element.id;
        }
      });
    }

    if (action == 'EXTER') {
      this.lstAqlCheck = [];
      this.refreshAqlTemplate();
    }
  }

  getInfoByAction(action: any, id: any, element: any) {
    if (action != '')
      this.storeCheckService
        .getLstCheckByStoreId(action, id)
        .toPromise()
        .then((data) => {
          switch (action) {
            case 'ELEC':
              element.lstElectronic = data.lstElectric;
              break;

            case 'EXTER':
              element.lstExternal = data.lsCheckExternalInspections;
              break;

            case 'SIZE':
              element.lstSize = data.lstSize;

              break;
            case 'SAFE':
              element.lstSafe = data.lstStoreSafe;
              break;

            case 'CONFUSED':
              element.lstConfused = data.lstConfuseds;
              break;

            case 'STRUCTURE':
              element.lstStructure = data.lstStructures;
              break;
            case 'ERROR':

              element.lstErrorCheck = data.lstCheckErrs;
              break;

            default:
              break;
          }
        });
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

  lstPacking: TinSerial[] = [];
  lstSerial: TinSerial[] = [];
  addInput(type: any) {
    var serial = new TinSerial();
    if (type == 'P') {
      this.lstPacking.push(serial);
    } else {
      this.lstSerial.push(serial);
    }
  }

  addPacking() {
    this.storeCheckService
      .savePacking(this.packing, this.tray, this.serial, this.id, this.actRoute.snapshot.params['id'])
      .toPromise()
      .then(
        (data) => {
          Swal.fire(
            'Thêm mới thông tin',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
          this.modalService.dismissAll;
        },
        (error) => { }
      );
  }

  wo: any;
  exportInfo() {
    let dataForExcel = [
      this.wo.branchName,
      this.wo.lotNumber,
      this.wo.planingWorkOrderCode,
      this.wo.workOrderId,
      this.wo.quantityPlan,
      this.wo.productionCode,
      this.wo.productionName,
      this.wo.sapWo,
      this.wo.bomVersion,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]
    let reportData = {
      fileName: 'export_genQrCode_' + this.wo.lotNumber,
      title: 'Thông tin kiểm tra',
      data: dataForExcel,
      headers: [
        "ProductionLine", "Lot", "PoCode", "PlanningCode", "NumberOfPlanning", "ItemCode", "ProductName", "SapWo", "Version",
        "TimeRecieved", "ReelID", "PartNumber", "Vendor", "QuantityOfPackage", "MFGDate", "ProductionShilt", "OpName", "Comments"
      ],
    };

    this.exportExelService.exportPrint(reportData);

  }
  changeWo(dataWo: any) {
    this.wo = dataWo;
  }



  aql_page = 1;
  aql_pageSize = 10000;
  aql_collectionSize = 0;
  lstAql?: any[] = []
  lstAqlCheck?: any[] = []
  refreshAqlTemplate() {
    this.aqlService.getList(this.formSearch.testLevel, this.formSearch.acceptanceLevel, this.formSearch.allowedError, this.aql_page, this.aql_pageSize).subscribe(
      data => {
        this.lstAql = data.lstTemplate;
        this.aql_collectionSize = Number(data.total) * this.aql_pageSize;
        console.log(this.aql_collectionSize);
      },
      err => {

      }
    );
  }

  selectCheck(data: any) {
    this.lstAqlCheck?.push(data);
    const index = Number(this.lstAql?.indexOf(data, 0));
    console.log(index);
    if (Number(index) > -1) {
      this.lstAql?.splice(index, 1);
    }
  }

  deleteCheckAql(data: any) {
    this.lstAql?.push(data);
    const index = Number(this.lstAqlCheck?.indexOf(data, 0));
    console.log(index);
    if (Number(index) > -1) {
      this.lstAqlCheck?.splice(index, 1);
    }
  }

  checkConcludeAql(data: any) {

    if (Number(data.reality) > Number(data.allowedError)) {
      data.conclude = "Không đạt";
    } else {
      data.conclude = "Đạt";
    }
  }

  sendApprove(ids: string, id: string) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn tiếp tục thực hiện gửi phê duyệt nhập kho?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        this.storeCheckService.sendRequestApproveStore({ id: id }).subscribe(data => {
          if (data.result.ok) {
            Swal.fire("Thành công", 'Bạn đã thực hiện gửi yêu cầu thành công', 'success')
          } else {
            Swal.fire("Thành công", data.result.message, 'warning')
          }

          this.storeCheckService.loadStoreCheckByWoId(this.id).subscribe(
            (data) => {
              this.lstStoreCheck = data.lstCheck;

              this.lstStoreCheck.forEach((element) => {
                element.ids = Utils.randomString(5);
                element.statusApproveSapStr = Utils.getStatusName(element.statusApproveSap);
              });
            },
            (error) => { }
          );

        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  openDetail(content: any, id: any) {

    this.commonService.statusStep(id).toPromise().then(
      data => {
        this.lstCheck = data.lstStep.filter((x: any) => x.step != 'QC_CHECK' && x.step != 'PHOTOELECTRIC_PRODUCT' && x.step != 'PHOTOELECTRIC' && x.step != 'APPROVE_STORE' && x.step != 'SAP_STORE');
        this.lstCheck?.forEach(el => {
          el.status = Utils.getStatusName(el.status);
          el.checked = true;
        })
        console.log(data.lstStep)
      },
      error => { }
    )
    this.modalService.open(content, this.modalOptionss).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  openShowDetailStore(content: any, id: any) {
    this.lstStoreCheck.forEach((element) => {
      if (element.id == id) {
        element.lstElectronic = [];
        element.lstErrorCheck = [];
        element.lstStructure = [];
        element.lstConfused = [];
        element.lstSafe = [];
        element.lstSize = [];
        element.lstExternal = [];

        this.storeCheckService.getLstCheckByStoreId('ELEC', id).toPromise().then((data) => {
          element.lstElectronic = data.lstElectric;
        })

        this.storeCheckService.getLstCheckByStoreId('ERROR', id).toPromise().then((data) => {
          element.lstErrorCheck = data.lstCheckErrs;
        })

        this.storeCheckService.getLstCheckByStoreId('STRUCTURE', id).toPromise().then((data) => {
          element.lstStructure = data.lstStructures;
        })

        this.storeCheckService.getLstCheckByStoreId('CONFUSED', id).toPromise().then((data) => {
          element.lstConfused = data.lstConfuseds;
        })

        this.storeCheckService.getLstCheckByStoreId('SAFE', id).toPromise().then((data) => {
          element.lstSafe = data.lstStoreSafe;
        })

        this.storeCheckService.getLstCheckByStoreId('SIZE', id).toPromise().then((data) => {
          element.lstSize = data.lstSize;
        })

        this.storeCheckService.getLstCheckByStoreId('EXTER', id).toPromise().then((data) => {
          element.lstExternal = data.lsCheckExternalInspections;
        })

        this.storeCheck = element;
      }
    });


    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  colorSelect?: any;
  selectColor(color: any) {
    this.formEx.colorName = color.name;
    this.formEx.colorCode = color.code;
    console.log(this.formEx);
  }
  updateStatus() {
    var body = this.lstCheck.filter(x => x.status != 'Hoàn thành' && x.checked == true);
    console.log(body)
    this.http.post(`${this.address}/pqc/approves`, body).subscribe(() => {
      Swal.fire({
        title: 'Thành công',
        text: 'Cập nhật trạng thái các công đoạn',
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: 'Đồng ý',
        timer: 1000
      })
      this.lstCheck.forEach(x => {
        body.forEach(y => {
          if (y.id == x.id) {
            x.status = 'Hoàn thành';
          }
        })
      })
    })
  }
}
