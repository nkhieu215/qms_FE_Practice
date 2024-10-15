
import { FormGroup } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { DatePipe, formatDate } from '@angular/common';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import Utils from 'src/app/share/_utils/utils';
import { UploadFileService } from 'src/app/share/_services/upload-file.service';
import { PQCNVlService } from 'src/app/share/_services/pqc_nvl.service';
import { ExportExcelService } from 'src/app/share/_services/export-excel.service';
import { PqcDataService } from 'src/app/share/_services/pqcDataService.service';
import { PqcDrawNvl } from 'src/app/share/_models/pqc_draw_nvl.model';
import { PqcDrawNvlTest } from 'src/app/share/_models/pqc_draw_nvl_test.model';
type AOA = any[][];

@Component({
  selector: 'app-nvl-production',
  templateUrl: './nvl-production.component.html',
  styleUrls: ['./nvl-production.component.css'],
  providers: [DatePipe],
})

export class NvlProductionComponent implements OnInit {
  // ------------------------------------------------ list item ----------------------------------------------
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'check-nvl-new';
  @Input() show_check = '';
  @Input() woData: any = null;
  //danh sách
  lstError: any;
  idWorkOrder?: string;
  show_work_order = true;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  data: AOA = [];

  searchTerm = '';
  filteredData: any[] = []
  lstbom: PqcDrawNvlTest[] = [];
  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private router: Router,
    private modalService: NgbModal,
    private storeService: KeycloakService,
    private datePipe: DatePipe,
    private uploadFileService: UploadFileService,
    private nvlService: PQCNVlService,
    private _sanitizer: DomSanitizer,
    private exportExelService: ExportExcelService,
    private datapqc: PqcDataService,
    protected http: HttpClient,
  ) {
    this.filteredData = this.lstbom
    console.log('show data', this.lstbom)
  }

  ngOnInit(): void {
    this.getInfo();
    this.filteredData = this.lstbom
  }
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  fileInfos?: any[] = [];

  lstCheck: PqcDrawNvl[] = [];
  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
    windowClass: 'modal-xxl',
    backdrop: 'static',
  };

  onSubmit(action: any) {
    console.log(this.lstCheck);
    this.pqcService.addStep(this.lstCheck, 'NVL', this.actRoute.snapshot.params['id'], action).toPromise().then(
      (data) => {
        if (data.result.responseCode == '00') {
          this.router.navigate(['/check-nvl']);
        }
      },
      (err) => { }
    );
  }
  showTableForm = false;
  showForm() {
    this.showTableForm = true;
  }

  pqcInfo?: PQCWorkOrder;
  error?: string;
  classError?: string;

  form: any = {};
  fromCheck: any = {};
  id = this.actRoute.snapshot.params['id'];
  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.http.get<any>(`${this.address}/${this.path}/get-lst-one/${id}`).subscribe(res => {
      this.lstError = res;
      this.lstbom = res;
      console.log('list lstbom', this.lstbom)
    })
    this.idWorkOrder = id;
    const type = this.actRoute.snapshot.params['type'];

    console.log("*************************");
    console.log(this.woData);
    console.log("*************************");
    if (this.woData) {
      console.log("DATA check", this.woData);
      this.form = this.woData.pqcWorkOrder;
      this.lstbom = this.woData.pqcWorkOrder.lstbom;
      this.lstCheck = this.woData.pqcWorkOrder.lstPqcDrawNvl;
      this.lstCheck.forEach(element => {
        element.ids = Utils.randomString(5);
      });

      console.log(this.lstCheck);

    } else {
      this.pqcService.getDetailPqcWorkOrder(id).subscribe(
        (data) => {
          this.form = data.pqcWorkOrder;
          this.lstbom = data.pqcWorkOrder.lstbom;
          this.lstCheck = data.pqcWorkOrder.lstPqcDrawNvl;
          this.lstCheck.forEach(element => {
            element.ids = Utils.randomString(5);
          });
        },
        (err) => { }
      );
    }

    if (this.show_check == 'SHOW' || type == 'show') {
      this.show_work_order = false;
    }
    this.filteredData = this.lstbom
    console.log("data", this.filteredData)
  }

  myClonedArray: PqcDrawNvlTest[] = [];
  ids?: any;
  idCheckNvl?: any;
  open(content: any, action: any, ids: any, id: any) {
    console.log(ids)
    this.ids = ids;
    this.myClonedArray = [];
    this.ids = null;
    if (action == 'show') {
      this.ids = ids;
      this.lstCheck.forEach((element) => {
        if (element.ids == ids) {
          this.myClonedArray = element.checkNvl;
          this.form.note = element.note;
          this.form.conclude = element.conclude;
        }
      });
      this.nvlService.getCheckNvlDrawTest(id).toPromise().then(
        data => {
          this.myClonedArray = data.lstDraw;
        },
        error => { }
      )

    }

    else if (action == 'show_img') {
      this.idCheckNvl = id;
      this.message = [];
      this.uploadFileService.getFiles(this.idCheckNvl).subscribe((data) => {
        this.fileInfos = data.lstImg;
      });
    }
    else {
      this.lstbom.forEach(element => {
        var bom = new PqcDrawNvlTest();
        bom.itemName = element.itemName;
        bom.itemCode = element.itemCode;
        bom.partNumber = element.partNumber;
        bom.checkDate = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');
        if (action == 'add') {
          bom.allowResult = "0";
          bom.realResult = "0";
        }
        this.myClonedArray.push(bom);
      })
    }


    console.log(this.lstbom);
    console.log(this.myClonedArray);


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

  myDate = new Date();
  onAddListCheck(ids: any) {
    console.log(ids)
    if (this.ids != null) {
      console.log(this.lstCheck);
      this.lstCheck.forEach((element) => {
        if (element.ids == ids) {
          var arr = Object.assign([], this.myClonedArray);
          element.checkNvl = arr;
          element.checkPerson = this.storeService.getUsername();
          element.createdAt = this.datePipe.transform(
            this.myDate,
            'dd/MM/yyyy'
          );
          element.note = this.form.note;
          element.conclude = this.form.conclude;
          this.nvlService.addNewProcuction(element.id, element.note, element.conclude, element.checkPerson, this.id, element.checkNvl).toPromise().then(
            data => {
              Swal.fire(
                'Thành công',
                'Bạn đã thực hiện cập nhật thông tin kiểm tra thành công.',
                'success'
              )
              this.modalService.dismissAll();
            },
            error => {
              alert("Có lỗi xảy ra vui lòng thử lại sau ít phút.");
            }
          )
        }
      });
    } else {
      var check = new PqcDrawNvl();
      check.checkPerson = this.storeService.getUsername();
      check.createdAt = this.datePipe.transform(this.myDate, 'dd/MM/yyyy');
      check.note = this.form.note;
      check.conclude = this.form.conclude;

      var arr = Object.assign([], this.myClonedArray);
      check.checkNvl = arr;
      // this.myClonedArray.forEach(val => check.checkNvl.push(Object.assign({}, val)));
      check.ids = Utils.randomString(5);

      this.nvlService.addNewProcuction('', check.note, check.conclude, check.checkPerson, this.id, check.checkNvl).toPromise().then(
        data => {
          Swal.fire(
            'Thành công',
            'Bạn đã thực hiện thêm mới thông tin kiểm tra thành công.',
            'success'
          )
          this.modalService.dismissAll();
          check.id = data.id;
          check.createdAt = new Date();
          this.lstCheck.push(check);
          this.modalService.dismissAll();
        },
        error => {
          alert("Có lỗi xảy ra vui lòng thử lại sau ít phút.");
        }
      )


    }
  }


  delete(ids: any, id: any) {
    this.lstCheck?.forEach((element, index) => {
      if (element.ids == ids) {
        this.nvlService.removeNvlCheck(element.id).subscribe(
          data => {
            this.lstCheck?.splice(index, 1);
            Swal.fire(
              'Xóa',
              'Bạn đã thực hiện xóa thông tin thành công',
              'warning'
            )
          },
          error => { }
        )



        if (id != '') {
          // remove server
        }
      }
    });
  }

  uploadForm?: FormGroup;
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      this.uploadFileService.upload(file, this.id, this.idCheckNvl).toPromise().then(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Upload file thành công: ' + file.name;
            this.message.push(msg);
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Lỗi upload file: ' + file.name;
          this.message.push(msg);
        });
    }

  }

  async uploadMutiFile() {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  async loadImg() {
    this.uploadFileService.getFiles(this.idCheckNvl).subscribe((data) => {
      this.fileInfos = data.lstImg;
    });

  }

  async uploadFiles() {
    this.message = [];
    await this.uploadMutiFile();

  }


  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  showImg(contentImg: any) {
    let data = "data:image/png;base64,`${contentImg}`";
    const downloadLink = document.createElement('a');
    const fileName = 'thongtinanh.jpg';

    downloadLink.href = data;
    downloadLink.download = fileName;
    downloadLink.click();

  }

  addfile(event: any) {

  }

  exportTemplate() {

    let dataHeader: string[] = [
      "Tên vật tư",
      "Mã", "Partnumber", "Số mẫu thử", "Ngày ktra (DD/MM/YYYY)",
      "Quy định KT", "Kết quả cho phép", "Thực tế", "Thông số min", "Thông số max", "Đơn vị", "Ngày về", "Ghi chú"
    ];

    var dataForExcel: any = [];
    let myDate = new Date();
    this.lstbom.forEach((row: any) => {

      dataForExcel.push([
        row.itemName,
        row.itemCode,
        row.partNumber,
        "",
        formatDate(new Date(), 'dd/MM/yyyy', 'en')
      ])
    })

    let reportData = {
      title: 'Thông tin kiểm tra nguyên vật liệu',
      fileName: 'mau_kiem_tra_thong_so',
      data: dataForExcel,
      headers: dataHeader,

    };
    this.exportExelService.exportTemplatePhotoelectric(reportData);

  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.data);

      /* fill data */
      this.data.forEach(element => {

        this.myClonedArray.forEach(bom => {
          if (element[0] == bom.itemName) {
            console.log(bom.itemName)
            bom.sampleQuantity = element[3]
            bom.regulationCheck = element[5]
            bom.allowResult = element[6]
            bom.realResult = element[7]
            bom.paramMin = element[8]
            bom.paramMax = element[9]
            bom.unit = element[10]

            const [day, month, year] = element[11].split('/');
            console.log(element[11]);
            bom.returnDay = `${year}-${month}-${day}`;
            bom.note = element[12]

          }
        })

      });

      console.log(this.lstbom)


    };
    reader.readAsBinaryString(target.files[0]);
  }

  filterData() {
    this.filteredData = this.lstbom.filter((bom: any) =>
      (bom.itemName && bom.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.itemCode && bom.itemCode.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.uotherNam && bom.uotherNam.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.uctrLevel && bom.uctrLevel.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.partNumber && bom.partNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.ulocation && bom.ulocation.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.quantity && bom.quantity.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.vendor && bom.vendor.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.ualter && bom.ualter.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.version && bom.version.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (bom.uremarks && bom.uremarks.toLowerCase().includes(this.searchTerm.toLowerCase()))
    )
    console.log('tìm kiếm', this.filteredData)
  }
}
