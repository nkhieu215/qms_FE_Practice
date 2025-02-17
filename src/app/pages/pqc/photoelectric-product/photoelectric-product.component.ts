import { KeycloakService } from 'keycloak-angular';
import { formatDate } from '@angular/common';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { PQCPhotoelectricService } from 'src/app/share/_services/pqcPhotoelectric.service';
import { PqcPhotoelectricProduct } from 'src/app/share/_models/pqc_photoelectric_product.model';
import { AuthService } from 'src/app/share/_services/auth.service';
@Component({
  selector: 'app-photoelectric-product',
  templateUrl: './photoelectric-product.component.html',
  styleUrls: ['./photoelectric-product.component.css'],
})
export class PhotoelectricProductComponent implements OnInit {
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
    private exportExelService: ExportExcelService,
    private photoelectricService: PQCPhotoelectricService,
    protected autoLogout: AuthService
  ) { }

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  lstWorkOrder?: PQCWorkOrder[] = [];
  formSearch: any = {
    name: null,
    code: null,
    lot: null,
  };

  minLengthTerm = 3;
  minLengthElectronic = 6;
  selectExamination: any = '';
  selectedElectronic: any = '';
  strSelect: any = '';
  strSelectElec: any = '';
  lstCheck: Array<PqcPhotoelectricProduct> = [];
  form: any = {};

  formEx: any = {
    id: '',
    lotNumber: '',
    checkDate: '',
    ectricMin: '',
    ectricMax: '',
    performanceMin: '',
    performanceMax: '',
    colorTempMin: '',
    colorTempMax: '',
    colorMin: '',
    colorMax: '',
    powSupplyMin: '',
    powSupplyMax: '',
    powMin: '',
    powMax: '',
    wattageMin: '',
    wattageMax: '',
    coefficientWattageMin: '',
    coefficientWattageMax: '',
    quatity: '',
    ratio: '',
    temp: '',
    tbn: '',
    checkPerson: '',
    conclude: '',
    note: '',
  };

  errorMsg!: string;
  isLoading = false;

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.form.checkPerson = this.tokenStorage.getUsername();
    this.getInfo();
  }

  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    var type = this.actRoute.snapshot.params['type'];
    if (id == null && type == null) {
      this.lstview = true;
      this.crud = false;
    }

    if (type == 'add') {
      this.edit = false;
      this.create = true;
      this.lstview = false;
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

    if (type == 'add' || type == 'show' || type == 'edit') {
      this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
        this.form = data.pqcWorkOrder;
        this.lstCheck = data.pqcWorkOrder.lstPhotoelectricsProduct;
      });
    }
  }

  displayWith(value: any) {
    return value?.Title;
  }

  // crud

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
    windowClass: 'modal-xxl',
    backdrop: 'static',
  };

  error = '';
  onSubmit(action: any) {
    this.pqcService
      .addStep(
        this.lstCheck,
        'PHOTOELECTRIC_PRODUCT',
        this.actRoute.snapshot.params['id'],
        action
      )
      .toPromise()
      .then(
        (data) => {
          this.edit = false;
          this.create = false;
          alert('Thêm mới thông tin kiểm tra thành công');
        },
        (err) => { }
      );
  }

  file?: any;
  arrayBuffer?: any;
  filelist?: [];
  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();

      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);

      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];

      worksheet['!cols'];

      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw:true }));
      var arraylist: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // console.log(arraylist);
      // this.lstAuditCriteriaParam.forEach((obj, index) => {
      //   var j = index + 1;
      //   if (arraylist[j] != undefined) {
      //     obj.arrInfo = arraylist[j];
      //     var arr = obj.arrInfo as [];

      //   }
      // })
      // console.log(this.lstAuditCriteriaParam);

      this.filelist = [];
      //autofill
      var filteredData: any[] = [];
      for (let index = 3; index < arraylist.length; index++) {
        if (arraylist[index].length != 0) {
          filteredData.push(arraylist[index]);
        } else break;
      }

      var tmp: any[] = [];
      function autofill(col: number, type: string) {
        var result;
        if (type == 'min') {
          tmp[col] = Infinity;
          result = filteredData.reduce(function (a: any[], b: any[]) {
            var x = isNaN(Number(a[col])) ? Infinity : Number(a[col]);
            var y = isNaN(Number(b[col])) ? Infinity : Number(b[col]);
            tmp[col] = Math.min(x, y);
            return tmp;
          }, tmp)[col];
        }
        if (type == 'max') {
          tmp[col] = -Infinity;
          result = filteredData.reduce(function (a: any[], b: any[]) {
            var x = isNaN(Number(a[col])) ? -Infinity : Number(a[col]);
            var y = isNaN(Number(b[col])) ? -Infinity : Number(b[col]);
            tmp[col] = Math.max(x, y);
            return tmp;
          }, tmp)[col];
        }

        if (type == 'avg') {
          let length = 0;
          result = filteredData.reduce(function (a: any[], b: any[]) {
            var x = isNaN(parseFloat(a[col])) ? 0 : parseFloat(a[col]);
            var y = isNaN(parseFloat(b[col])) ? 0 : parseFloat(b[col]);
            length++;
            tmp[col] = (x + y);

            return tmp;
          }, tmp)[col];

          result = (result / length).toFixed(2);
        }


        if (result == Infinity || result == -Infinity) {
          return '';
        }

        return result;
      }

      this.formEx.sdcmMin = autofill(1, 'min');
      this.formEx.sdcmMax = autofill(1, 'max');
      this.formEx.ectricMin = autofill(2, 'min');
      this.formEx.ectricMax = autofill(2, 'max');

      this.formEx.performanceMin = autofill(3, 'min');
      this.formEx.performanceMax = autofill(3, 'max');

      this.formEx.colorTempMin = autofill(4, 'min');
      this.formEx.colorTempMax = autofill(4, 'max');

      this.formEx.colorMin = autofill(5, 'min');
      this.formEx.colorMax = autofill(5, 'max');

      this.formEx.powSupplyMin = autofill(6, 'min');
      this.formEx.powSupplyMax = autofill(6, 'max');

      this.formEx.powMin = autofill(7, 'min');
      this.formEx.powMax = autofill(7, 'max');

      this.formEx.wattageMin = autofill(8, 'min');
      this.formEx.wattageMax = autofill(8, 'max');

      this.formEx.coefficientWattageMin = autofill(9, 'min');
      this.formEx.coefficientWattageMax = autofill(9, 'max');
      this.formEx.tbn = autofill(10, 'avg');
    };
  }

  open(content: any, id: any) {

    this.formEx = {};
    if (id) {
      this.lstCheck.forEach(element => {
        if (element.id = id) {
          this.formEx = element;
          this.formEx.id = id;
        }
      })
    } else {
      this.formEx.checkTime = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en_US');
      this.formEx.checkPerson = this.tokenStorage.getUsername();
      this.formEx.lotNumber = this.form.lotNumber;
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onCheck() {
    const {
      checkPerson,
      coefficientWattageMax,
      coefficientWattageMin,
      colorMax,
      colorMin,
      colorTempMax,
      colorTempMin,
      conclude,
      ectricMax,
      ectricMin,
      note,
      performanceMax,
      performanceMin,
      powSupplyMax,
      powSupplyMin,
      powMax,
      powMin,
      quatity,
      ratio,
      tbn,
      temp,
      wattageMax,
      wattageMin,
      lotNumber,
      sdcmMin,
      sdcmMax,
      id
    } = this.formEx;

    var check = new PqcPhotoelectricProduct();
    check.id = id;
    check.lotNumber = lotNumber;
    check.checkPerson = checkPerson;
    check.coefficientWattageMax = coefficientWattageMax;
    check.coefficientWattageMin = coefficientWattageMin;
    check.colorMax = colorMax;
    check.colorMin = colorMin;
    check.colorTempMax = colorTempMax;
    check.colorTempMin = colorTempMin;
    check.conclude = conclude;
    check.ectricMax = ectricMax;
    check.ectricMin = ectricMin;
    check.note = note;
    check.performanceMax = performanceMax;
    check.performanceMin = performanceMin;
    check.powSupplyMax = powSupplyMax;
    check.powSupplyMin = powSupplyMin;
    check.powMax = powMax;
    check.powMin = powMin;
    check.quatity = quatity;
    check.ratio = ratio;
    check.tbn = tbn;
    check.temp = temp;
    check.wattageMax = wattageMax;
    check.wattageMin = wattageMin;
    check.sdcmMin = sdcmMin;
    check.sdcmMax = sdcmMax;
    check.workOrderId = this.actRoute.snapshot.params['id'],

      this.photoelectricService.createUpdateProd(check).subscribe(
        data => {
          if (check.id) {
            Swal.fire(
              'Cập nhật thông tin',
              'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
              'success'
            )
          } else {
            Swal.fire(
              'Thêm mới thông tin',
              'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
              'success'
            )
            check.id = data.id;
            this.lstCheck.push(check);
          }
        }
      )
  }

  dataForExcel: any[] = [];

  exportToExcel() {
    console.log(this.formEx);
    this.dataForExcel[0] = (Object.values(this.formEx));
    console.log(this.dataForExcel);
    console.log(Object.keys(this.formEx));
    let reportData = {
      title: 'Thông tin kiểm tra',
      data: this.dataForExcel,
      headers: [
        'Lô sản xuất',
        'Ngày kiểm tra',
        'Quang thông min',
        'Quang thông max',
        'Hiệu suất min',
        'Hiệu suất max',
        'Nhiệt độ màu min',
        'Nhiệt độ màu max',
        'Độ trả màu min',
        'Độ trả màu max',
        'Điện nguồn min',
        'Điện nguồn max',
        'Dòng điện min',
        'Dòng điện max',
        'Công suất min',
        'Công suất max',
        'Hệ số công suất min',
        'Hệ số công suất max',
        'Số lượng kiểm tra',
        'Tỷ lệ đạt',
        'Nhiệt độ TS',
        'TBN(0.5s on/0.5s off)',
        'Người kiểm tra',
        'Kết luận',
        'Ghi chú',
      ],
    };

    this.exportExelService.exportExcel(reportData);
  }

  delete(id: any) {
    this.photoelectricService.deleteProd(id).subscribe(
      data => {
        Swal.fire(
          'Xóa',
          'Bạn đã thực hiện xóa thông tin kiểm tra thành công.',
          'success'
        )
        this.lstCheck?.forEach((element, index) => {
          if (element.id == id) {
            this.lstCheck?.splice(index, 1);
          }
        })
      }
    )
  }
}
