
import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Utils from 'src/app/share/_utils/utils';
import Swal from 'sweetalert2';
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { TinCheckSerialService } from 'src/app/share/_services/tinCheckSerial.service';
import { TinCheck } from 'src/app/share/_models/tin_check.model';
import { PqcTin } from 'src/app/share/_models/pqc_tin_check.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorElectronicComponent } from 'src/app/share/_models/errorElectronicComponent.model';
import { TinSerial } from 'src/app/share/_models/tin_serial.model';

@Component({
  selector: 'app-tin-check',
  templateUrl: './tin-check.component.html',
  styleUrls: ['./tin-check.component.css'],
})
export class TinCheckComponent implements OnInit {
  @Input() show_check = '';

  lstview = true;
  crud = false;
  create = false;
  edit = false;
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private modalService: NgbModal,
    private errorService: ErrorListService,
    private tinCheckSerialService: TinCheckSerialService,
    private tokenStorage: KeycloakService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  lstTinCheck: TinCheck[] = [];
  lstTin: PqcTin[] = [];
  lstTinCheckResponse: TinCheck[] = [];
  show_work_order = true;
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
  };

  formEx: any = {};

  formTincheck: any = {};

  form: any = {};

  formErrorChild: any = {
    errGroup: null,
    errName: null,
    quantity: null,
    ratio: null,
  };

  lstError?: ErrorList[];
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  ngOnInit(): void {
    this.getInfo();
  }

  idWorkOrder?: string;
  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
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

    if (this.show_check == 'SHOW') {
      this.edit = false;
      this.create = false;
      this.lstview = false;
      type = 'show';
      this.show_work_order = false;
    }

    if (type != null) {
      this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
        this.form = data.pqcWorkOrder;
        this.lstTinCheckResponse = data.pqcWorkOrder.lstTin;
        this.lstTinCheckResponse.forEach((element) => {
          var check = new TinCheck();
          check.batchId = element.batchId;
          check.line = element.line;
          check.checkPerson = element.checkPerson;
          check.checkTime = element.checkTime;
          check.expiryDate = element.expiryDate;
          check.quatity = element.quatity;
          check.errTotal = element.errTotal;
          check.conclude = element.conclude;
          check.note = element.note;
          check.classify = element.classify;
          check.ids = Utils.randomString(5);
          check.dttdCheckId = element.dttdCheckId;
          check.machineCode = element.machineCode;
          check.gridCode = element.gridCode;
          check.knifeCode = element.knifeCode;
          check.id = element.dttdCheckId;
          check.operators = element.operators;
          this.lstTinCheck.push(check);
        });
      });

      this.tinCheckSerialService
        .getCheckSerialByWorkOrder(id)
        .subscribe((data) => {
          this.lstTin = data.lstTinCheckSerial;
        });
    }
  }
  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  onSubmit(action: any) {
    const data = { lstTin: this.lstTinCheck, lstCheck: this.lstTin };
    this.pqcService
      .addStep(data, 'TIN', this.actRoute.snapshot.params['id'], action)
      .toPromise()
      .then(
        (data) => {
          this.edit = false;
          this.create = false;
          Swal.fire('Thành công' ,'Thêm mới thông tin thành công', 'success');
        },
        (err) => { }
      );
  }

  onAddError() {
    var check = new TinCheck();
    check.id = this.formEx.id;
    check.batchId = this.formEx.batchId;
    check.line = this.formEx.line;
    check.checkPerson = this.formEx.checkPerson;
    check.checkTime = this.formEx.checkTime;
    check.expiryDate = this.formEx.expiryDate;
    check.quatity = this.formEx.quatity;
    check.errTotal = this.formEx.errTotal;
    check.conclude = this.formEx.conclude;
    check.note = this.formEx.note;
    check.classify = this.formEx.classify;
    check.ids = Utils.randomString(5);
    check.machineCode = this.formEx.machineCode;
    check.knifeCode = this.formEx.knifeCode;
    check.gridCode = this.formEx.gridCode;
    check.operators = this.formEx.operators;
    check.workOrderId = this.actRoute.snapshot.params['id'];

    this.tinCheckSerialService
      .createUpdateTinCheck(
        check.id,
        check.batchId,
        check.line,
        check.checkPerson,
        check.checkTime,
        check.expiryDate,
        check.quatity,
        check.errTotal,
        check.conclude,
        check.note,
        check.classify,
        check.ids,
        check.machineCode,
        check.knifeCode,
        check.gridCode,
        check.workOrderId,
        check.operators
      )
      .toPromise()
      .then(
        (data) => {
          check.id = data.idCheck;
          Swal.fire('Thành công' ,'Thêm mới thông tin thành công', 'success');

          if(this.formEx.id == null){
            this.lstTinCheck.push(check);
          }

          this.modalService.dismissAll;
        },
        (error) => { }
      );
    console.log(this.lstTinCheck);
  }

  deleteCheck(id: any, type: any) {

    this.tinCheckSerialService
      .removeTinCheck(id, type)
      .toPromise()
      .then(
        (data) => {
          Swal.fire(
            'Xóa',
            'Xóa thông tin kiểm tra thành công',
            'success'
          )

          if(type =='check'){
            this.lstTinCheck?.forEach((element, index) => {
              if (element.id == id) {
                this.lstTinCheck?.splice(index, 1);
              }
            });
          }else{
            this.lstTin?.forEach((element, index) => {
              if (element.id == id) {
                this.lstTin?.splice(index, 1);
              }
            });
          }
        },
        (err) => {
          Swal.fire('Lỗi' ,'Có lỗi trong quá trình thực hiện vui lòng thực hiện lại sau ít phút.', 'warning');
        }
      );



  }

  errorAdd = '';
  onChangeQuantityError(errorNumber: any) {
    if (this.totalCheckElement == null || this.totalCheckElement == 0) {
      this.errorAdd = 'Bạn chưa thực hiện nhập số lượng kiểm tra';
      this.formErrorChild.ratio = 0;
    } else {
      this.errorAdd = '';
      var number =
        (errorNumber /
          (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) *
        100;
      this.formErrorChild.ratio = number.toFixed(2) + '%';
    }
  }

  arrErrChild: Array<ErrorElectronicComponent> = [];
  dttdCheckId : any;
  onAddErrorChild() {
    const { errGroup, errName, quantity,serial } = this.formErrorChild;
    var ratio = ((quantity / (this.totalCheckElement == 0 ? 1 : this.totalCheckElement)) * 100).toFixed(2) + '%';
    const errorChild = new ErrorElectronicComponent(errName, errGroup, quantity, ratio, Utils.randomString(5));
    errorChild.dttdCheckId =  this.dttdCheckId;
    errorChild.serial  = serial

    this.tinCheckSerialService.addError(errorChild).toPromise().then(
      data=>{
        Swal.fire(
          'Thông báo',
          'Bạn đã thực hiện thêm mới thông tin thành công.',
          'success'
        )

      },
      error=>{}
    )

    this.arrErrChild.push(errorChild);
  }


  onChangeErrorGroup(idx: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == idx) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }

  deleteErrorRow(ids: any) {
    this.arrErrChild.forEach((element, index) => {
      if (element.ids == ids) {
        this.tinCheckSerialService.deleteError(element.id).subscribe(
          data=>{
            Swal.fire("Thành công","Bạn đã thực hiện xóa thành công.","warning")
          }
        )
        this.arrErrChild.splice(index, 1);
      }
    });
  }

  totalCheckElement = 0;
  ids?: any;
  open(content: any, idError: any) {
    this.formEx = {}
    this.ids = idError;
    this.formEx.checkTime = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    this.formEx.checkPerson = this.tokenStorage.getUsername();
    this.formErrorChild = [];
    this.start_gia = '';
    this.start_khuay = '';
    this.end_gia = '';
    this.end_khuay = '';
    this.lstSerial = [];
    this.idCheck = '';

    if (idError != null) {
      console.log("abc" + idError)
      this.lstTinCheck?.forEach((element) => {
        if (element.ids == idError) {
          this.arrErrChild = element.errorLists;
          this.totalCheckElement = Number(element.quatity);
          console.log("abc")
          this.dttdCheckId = element.dttdCheckId;
          if (element.dttdCheckId != null) {
            this.tinCheckSerialService
              .getDetail(element.dttdCheckId)
              .subscribe(
                (data) => {
                  this.arrErrChild = data.detail.lstError;
                },
                (err) => { }
              );
          }
        }
      });
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

  openEdit(content: any, id: any) {

    this.formEx = {};
    this.lstTinCheck.forEach(element=>{
      if(element.id == id){
        this.formEx = element;
      }
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

  start_gia?: string;
  end_gia?: string;
  end_khuay?: string;
  start_khuay?: string;
  idCheck?: string;
  datePrint(type: any, action: any) {
    if (type == 'KHUAY') {
      if (action == 'START') {
        this.start_khuay = this.formTincheck.startKhuay = formatDate(
          new Date(),
          'dd/MM/YYYY HH:mm:ss',
          'en_US'
        );
      } else {
        if (this.start_khuay == '') {
          Swal.fire('Lỗi' ,'Bạn chưa bấm thời gian bắt đầu khuấy.', 'warning');
        } else {
          this.end_khuay = this.formTincheck.endKhuay = formatDate(
            new Date(),
            'dd/MM/YYYY HH:mm:ss',
            'en_US'
          );
        }
      }
    }

    if (type == 'GIA') {
      if (action == 'START') {
        this.start_gia = this.formTincheck.startGia = formatDate(
          new Date(),
          'dd/MM/YYYY HH:mm:ss',
          'en_US'
        );
      } else {
        if (this.start_gia == '') {
          Swal.fire('Lỗi' ,'Bạn chưa bấm thời gian bắt đầu giã đông.', 'warning');
        } else {
          this.end_gia = this.formTincheck.endGia = formatDate(
            new Date(),
            'dd/MM/YYYY HH:mm:ss',
            'en_US'
          );
        }
      }
    }
  }

  lstSerial: TinSerial[] = [];
  addInput() {
    var serial = new TinSerial();
    this.lstSerial.push(serial);
  }
  addTinCheck() {
    this.formTincheck.checkTime = formatDate(
      new Date(),
      'dd/MM/YYYY HH:mm',
      'en_US'
    );
    this.formTincheck.checkPerson = this.tokenStorage.getUsername();

    var tin = new PqcTin();
    tin.checkPerson = this.tokenStorage.getUsername();
    tin.checkTime = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    tin.startGia = this.start_gia;
    tin.endGia = this.end_gia;
    tin.startKhuay = this.start_khuay;
    tin.endKhuay = this.end_khuay;
    tin.lstSerial = this.lstSerial;
    tin.ids = Utils.randomString(5);
    tin.serial =
      tin.lstSerial == null
        ? ''
        : tin.lstSerial.map((x) => x.serial).join(', ');
    tin.note = this.formTincheck.note;

    tin.operators = this.formTincheck.operators

    // update db

    this.tinCheckSerialService
      .createUpdateCheckSerial(
        this.idCheck,
        this.tokenStorage.getUsername(),
        this.start_gia,
        this.end_gia,
        this.start_khuay,
        this.end_khuay,
        this.lstSerial,
        Number(this.actRoute.snapshot.params['id']),
        tin.checkTime,
        tin.note, tin.operators
      )
      .toPromise()
      .then(
        (data) => {
          // close popup
          this.getDismissReason('reason');
          if (this.idCheck != null) {
            Swal.fire('Thành công' ,'Cập nhật thông tin kiểm tra thành công', 'success');
            this.lstTin.forEach((element, index) => {
              if (element.id == this.idCheck) {
                console.log('update');
                this.lstTin?.splice(index, 1);
              }
            });
          } else {
            this;
            Swal.fire('Thành công' ,'Thêm mới thông tin kiểm tra thành công', 'success');
          }
          tin.id = data.idCheck;
          this.lstTin?.push(tin);
        },
        (err) => {
          Swal.fire('Lỗi' ,'Có lỗi trong quá trình thực hiện vui lòng thực hiện lại sau ít phút.', 'warning');
        }
      );
  }

  openModalUpdateSerial(content: any, id: any) {
    this.idCheck = id;
    this.lstTin.forEach((element) => {
      if (element.id == id) {
        console.log(element);
        this.formTincheck.startGia = this.start_gia = element.startGia;
        this.formTincheck.endGia = this.end_gia = element.endGia;
        this.formTincheck.startKhuay = this.start_khuay = element.startKhuay;
        this.formTincheck.endKhuay = this.end_khuay = element.endKhuay;
        this.formTincheck.note = element.note;
        this.formTincheck.operators = element.operators;
        this.lstSerial = element.lstSerial;
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
}
