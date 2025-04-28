
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
import { ErrorList } from 'src/app/share/_models/errorList.model';
import { ErrorListResponse } from 'src/app/share/response/errorList/ExaminationResponse';
import { ErrorListService } from 'src/app/share/_services/errorlist.service';
import { AuthService } from 'src/app/share/_services/auth.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  address = environment.api_end_point;
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  path = 'check-nvl-new';
  @Input() show_check = '';
  @Input() woData: any = null;
  //danh sách khai báo lỗi
  lstErrorGr?: ErrorList[];
  lstErrorRes?: ErrorListResponse;
  itemId = 0;
  quantityId = 0;
  quantityValue = 0;
  insertItemName = '';
  insertItemCode = '';
  lstError: any;
  lstErrorByItem: any;
  lstQuantityByItem: any;
  idWorkOrder?: string;
  show_work_order = true;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  data: AOA = [];
  showBtn = false;
  confirmChange = false;
  itemName = '';
  itemCode = '';
  uotherNam = '';
  partNumber = '';
  vendor = '';
  ualter = '';
  version = '';
  filteredData: any[] = []
  lstbom: any[] = [];
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
    protected errorService: ErrorListService,
    protected autoLogout: AuthService
  ) {
  }

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.getInfo();
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
      // Sử dụng forkJoin để thực hiện các yêu cầu song song
      forkJoin({
        lstbom: this.http.get<any>(`${this.address}/pqc-nvl/list-bom/${id}`),
        lstPqcDrawNvl: this.http.get<any>(`${this.address}/pqc-nvl/draw-nvl/${id}`)
      }).subscribe(
        ({ lstbom, lstPqcDrawNvl }) => {
          console.log('check new api lst bom :: ', lstbom);
          console.log('check new api lst draw nvl :: ', lstPqcDrawNvl);

          const check: any[] = [{ id: 0 }];
          this.filteredData = this.lstbom = lstbom;
          this.lstCheck = lstPqcDrawNvl.sort((a: any, b: any) => a.checkTime - b.checkTime);

          this.lstCheck.forEach(element => {
            element.ids = Utils.randomString(5);
          });

          console.log('list lstbom', this.lstError, this.lstbom);

          this.filteredData.forEach(item => {
            item.sumQuantity = 0;
            item.sumError = 0;

            this.lstError.forEach((error: any) => {
              if (error.pqcBomWorkOrderId == item.id) {
                item.sumError += error.quantity;
                const result = check.find((x: any) => x.id == error.pqcBomQuantityId);
                if (!result) {
                  const data = { id: error.pqcBomQuantityId };
                  check.push(data);
                  item.sumQuantity += error.quantity2;
                }
              }
            });
          });
        },
        error => {
          console.error('Error occurred while fetching data:', error);
        }
      );
    }

    if (this.show_check == 'SHOW' || type == 'show') {
      this.show_work_order = false;
    }
  }

  myClonedArray: PqcDrawNvlTest[] = [];
  ids?: any;
  idCheckNvl?: any;
  open(content: any, action: any, ids: any, id: any, itemName: any, itemCode: any) {
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
    else if (action == 'quantity') {
      this.insertItemName = itemName;
      this.insertItemCode = itemCode;
      this.itemId = id;
      this.errorService.getAllCategories().subscribe(
        (data) => {
          this.lstErrorRes = data;
          this.lstErrorGr = data.lstError;
          console.log(this.lstErrorRes);
        },
        (err) => { }
      );
      this.http.get<any>(`${this.address}/${this.path}/get-lst-quantity/${id}`).subscribe(res => {
        this.lstQuantityByItem = res;
      })
      this.http.get<any>(`${this.address}/${this.path}/get-lst-two/${id}`).subscribe(res => {
        this.lstErrorByItem = res;
      })
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
        setTimeout(() => {
          this.http.get<any>(`${this.address}/${this.path}/get-lst-one/${this.id}`).subscribe(res => {
            this.lstError = res;
            const check: any[] = [{ id: 0 }];
            setTimeout(() => {
              this.filteredData.forEach(item => {
                item.sumQuantity = 0;
                item.sumError = 0;
                this.lstError.forEach((error: any) => {
                  if (error.pqcBomWorkOrderId == item.id) {
                    item.sumError += error.quantity;
                    var result = check.find((x: any) => x.id == error.pqcBomQuantityId);
                    if (!result) {
                      const data = { id: error.pqcBomQuantityId };
                      check.push(data);
                      item.sumQuantity += error.quantity2;
                    }
                  }
                })
              })
            }, 50);
          })
        }, 50);
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
      "Mã", "Partnumber", "Số mẫu kiểm tra", "Ngày ktra (DD/MM/YYYY)",
      "Quy định KT", "Số lỗi cho phép", "Số lỗi thực tế", "Thông số min", "Thông số max", "Đơn vị", "Ngày về", "Ghi chú"
    ];

    var dataForExcel: any = [];
    let myDate = new Date();
    this.lstbom.forEach((row: any) => {

      dataForExcel.push([
        row.itemName,
        row.itemCode,
        row.partNumber,
        5,
        formatDate(new Date(), 'dd/MM/yyyy', 'en'),
        5,
        0,
        0
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

            const [day, month, year] = element[11] == undefined ? '00/00/0000'.split('/') : element[11].split('/');
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
    this.lstbom = this.filteredData.filter((bom: any) =>
      (bom.itemName && bom.itemName.toLowerCase().includes(this.itemName.toLowerCase())) &&
      (bom.itemCode && bom.itemCode.toLowerCase().includes(this.itemCode.toLowerCase()))
      // (bom.partNumber && bom.partNumber.includes(this.partNumber)) &&
      // (bom.vendor && bom.vendor.includes(this.vendor)) &&
      // (bom.version && bom.version.includes(this.version))
    )
    console.log('check')
  }
  //------------------------------- Khai báo lỗi
  fixQuantity(id: any, bomId: any, quantity: any) {
    if (id === null) {
      document.getElementById(`null-input-bom-quantity`)!.hidden = false;;
      document.getElementById(`null-button`)!.hidden = false;
      document.getElementById(`null-span-bom-quantity`)!.hidden = true;
      this.lstErrorByItem = [];
      this.showBtn = true;
      this.quantityId = id;
      this.quantityValue = quantity;
    } else {
      this.quantityId = id;
      this.quantityValue = quantity;
      if (document.getElementById(`${id.toString()}-input-bom-quantity`)!.hidden == true) {
        this.http.get<any>(`${this.address}/${this.path}/get-lst-three/${id}`).subscribe(res => {
          this.lstErrorByItem = res;
        })
        this.showBtn = true;
        document.getElementById(`${id.toString()}-input-bom-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-button`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-bom-quantity`)!.hidden = true;
        this.lstQuantityByItem.forEach((x: any) => {
          if (x.id != id) {
            document.getElementById(`${x.id.toString()}-fix-button`)!.hidden = true;
            document.getElementById(`${x.id.toString()}-del-button`)!.hidden = true;
          }
        })
      } else {
        this.http.get<any>(`${this.address}/${this.path}/get-lst-two/${bomId}`).subscribe(res => {
          this.lstErrorByItem = res;
        })
        this.showBtn = false;
        document.getElementById(`${id.toString()}-input-bom-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-button`)!.hidden = true;
        this.lstQuantityByItem.forEach((x: any) => {
          if (x.id != id) {
            document.getElementById(`${x.id.toString()}-fix-button`)!.hidden = false;
            document.getElementById(`${x.id.toString()}-del-button`)!.hidden = false;
          }
        })
        document.getElementById(`${id.toString()}-span-bom-quantity`)!.hidden = false;
      }
    }
  }
  showQuantity(id: any) {
    this.http.get<any>(`${this.address}/${this.path}/get-lst-three/${id}`).subscribe(res => {
      this.lstErrorByItem = res;
    })

  }
  updateQuantity(item: any) {
    item.updatedAt = new Date;
    this.http.post<any>(`${this.address}/${this.path}/update-bom-quantity`, item).subscribe((res) => {
      if (item.id == null) {
        Swal.fire({
          title: 'Thêm mới',
          text: 'Thêm mới thông tin nhập thành công! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
        this.confirmChange = true;
        item.id = res;
        this.quantityId = res;
        setTimeout(() => {
          this.fixQuantity(item.id, this.itemId, item.quantity);
        }, 50);
      } else {
        Swal.fire({
          title: 'Cập nhật',
          text: 'Cập nhật thông tin nhập thành công! ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        })
        this.confirmChange = true;
        this.showBtn = false;
        this.fixQuantity(item.id, this.itemId, item.quantity);
      }
    })
  }
  addNewQuantity() {
    this.quantityValue = 0;
    this.quantityId = 0;
    const item = {
      id: null,
      quantity: 0,
      totalError: 0,
      createdAt: new Date,
      updatedAt: new Date,
      pqcWorkOrderId: this.id,
      pqcBomWorkOrderId: this.itemId,
    }
    this.lstQuantityByItem = [item, ...this.lstQuantityByItem]
    setTimeout(() => {
      this.fixQuantity(null, null, 0)
    }, 50);
  }
  deleteQuantityItem(id: any) {
    Swal.fire({
      title: '',
      text: "Xác nhận xóa",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý'
    }).then((result) => {
      if (result.isConfirmed) {
        if (id == null) {
          this.lstQuantityByItem = this.lstQuantityByItem.filter((x: any) => x.id != id);
        } else {
          this.http.delete<any>(`${this.address}/${this.path}/delete-bom-quantity/${id}`).subscribe(() => {
            Swal.fire({
              title: 'Xóa',
              text: 'Xóa thông tin nhập thành công! ',
              icon: 'success',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 1000
            })
            this.showBtn = false;
            this.confirmChange = true;
            this.http.get<any>(`${this.address}/${this.path}/get-lst-two/${this.itemId}`).subscribe(res => {
              this.lstErrorByItem = res;
            })
            this.lstQuantityByItem = this.lstQuantityByItem.filter((x: any) => x.id != id);
            this.lstQuantityByItem.forEach((x: any) => {
              document.getElementById(`${x.id.toString()}-fix-button`)!.hidden = false;
              document.getElementById(`${x.id.toString()}-del-button`)!.hidden = false;
            })
          })
        }
      }
    })
  }
  saveQuantityInfo(quantity: any) {
    this.quantityValue = quantity;
  }
  addNewError() {
    const item = {
      id: null,
      itemName: this.insertItemName,
      itemCode: this.insertItemCode,
      errCode: '',
      errName: '',
      quantity: 0,
      quantity2: this.quantityValue,
      createdAt: new Date,
      updatedAt: new Date,
      note: '',
      pqcBomQuantityId: this.quantityId,
      pqcWorkOrderId: this.id,
      pqcBomWorkOrderId: this.itemId
    }
    this.lstErrorByItem = [item, ...this.lstErrorByItem];
    setTimeout(() => {
      this.fixError(null, '');
    }, 50);
  }
  fixError(id: any, errGroup: any) {
    if (id === null) {
      document.getElementById(`null-input-error-errorCode`)!.hidden = false;
      document.getElementById(`null-input-error-errorName`)!.hidden = false;
      document.getElementById(`null-input-error-quantity`)!.hidden = false;
      document.getElementById(`null-input-error-note`)!.hidden = false;
      // document.getElementById(`null-error-button`)!.hidden = false;
      document.getElementById(`null-span-error-errorCode`)!.hidden = true;
      document.getElementById(`null-span-error-errorName`)!.hidden = true;
      document.getElementById(`null-span-error-quantity`)!.hidden = true;
      document.getElementById(`null-span-error-note`)!.hidden = true;
    } else {
      if (document.getElementById(`${id.toString()}-input-error-errorCode`)!.hidden == true) {
        this.onChangeErrorGroup(errGroup);
        document.getElementById(`${id.toString()}-input-error-errorCode`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-error-errorName`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-error-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-input-error-note`)!.hidden = false;
        // document.getElementById(`${id.toString()}-error-button`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-errorCode`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-errorName`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-note`)!.hidden = true;
      } else {
        document.getElementById(`${id.toString()}-input-error-errorCode`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-error-errorName`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-error-quantity`)!.hidden = true;
        document.getElementById(`${id.toString()}-input-error-note`)!.hidden = true;
        // document.getElementById(`${id.toString()}-error-button`)!.hidden = true;
        document.getElementById(`${id.toString()}-span-error-errorCode`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-errorName`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-quantity`)!.hidden = false;
        document.getElementById(`${id.toString()}-span-error-note`)!.hidden = false;
      }
    }
  }
  updateError(index: any) {
    var check = false;
    this.lstErrorByItem.forEach((x: any) => {
      if (x.quantity == 0) {
        check = true;
        return;
      }
    })
    setTimeout(() => {
      if (check == true) {
        Swal.fire(
          'Lỗi',
          'Số lượng lỗi cần lớn hơn 0 !',
          'warning'
        )
        return;
      } else {
        var result = this.lstQuantityByItem.find((x: any) => x.id == null)
        console.log(result)
        if (result) {
          this.updateQuantity(result);
          setTimeout(() => {
            this.lstErrorByItem.forEach((x: any) => {
              x.pqcBomQuantityId = this.quantityId;
            })
            this.http.post<any>(`${this.address}/${this.path}/update-errors`, this.lstErrorByItem).subscribe(() => {
              Swal.fire({
                title: 'Thêm mới',
                text: 'Thêm mới danh sách lỗi thành công! ',
                icon: 'success',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1000
              })
              this.confirmChange = true;
              this.showBtn = false;
            })
          }, 100);
        } else {
          this.updateQuantity(this.lstQuantityByItem[Number(index)]);
          if (index == null) {
            this.http.post<any>(`${this.address}/${this.path}/update-errors`, this.lstErrorByItem).subscribe(() => {
              Swal.fire({
                title: 'Cập nhật',
                text: 'Cập nhật danh sách lỗi thành công! ',
                icon: 'success',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1000
              })
              this.http.get<any>(`${this.address}/${this.path}/get-lst-quantity/${this.itemId}`).subscribe(res => {
                this.lstQuantityByItem = res;
              })
              this.http.get<any>(`${this.address}/${this.path}/get-lst-two/${this.itemId}`).subscribe(res => {
                this.lstErrorByItem = res;
              })
              this.confirmChange = true;
              this.showBtn = false;
            })
          } else {
            this.lstErrorByItem[Number(index)].updatedAt = new Date;
            const data = [this.lstErrorByItem[Number(index)]];
            this.http.post<any>(`${this.address}/${this.path}/update-errors`, data).subscribe(() => {
              Swal.fire({
                title: 'Cập nhật',
                text: 'Cập nhật thông tin lỗi thành công! ',
                icon: 'success',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1000
              })
              this.confirmChange = true;
            })
          }
        }
      }
    }, 1000);
  }
  deleteError(id: any, quantityId: any, quantity: any) {
    Swal.fire({
      title: '',
      text: "Xác nhận xóa",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý'
    }).then((result) => {
      if (result.isConfirmed) {
        if (id == null) {
          this.lstErrorByItem = this.lstErrorByItem.filter((x: any) => x.id != id);
        } else {
          this.http.delete(`${this.address}/${this.path}/delete-bom-error/${id}`).subscribe(() => {
            this.lstQuantityByItem.forEach((x: any) => {
              if (x.id == quantityId) {
                x.totalError = x.totalError - Number(quantity);
                setTimeout(() => {
                  this.http.post<any>(`${this.address}/${this.path}/update-bom-quantity`, x).subscribe()
                }, 50);
              }
            })
            Swal.fire({
              title: 'Xóa',
              text: 'Xóa thông tin lỗi thành công! ',
              icon: 'success',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 1000
            })
          })
        }
        this.lstErrorByItem = this.lstErrorByItem.filter((x: any) => x.id != id);
      }
    })
  }
  onChangeErrorGroup(idx: any) {
    this.lstErrorGr?.forEach((element) => {
      if (element.name == idx) {
        this.lstError = element.errChild;
        // this.formErrorChild.errGroup = element.name;
      }
    });
  }
  sumQuantity() {
    var sum = 0;
    this.lstErrorByItem.forEach((element: any) => {
      sum += Number(element.quantity);
    });
    setTimeout(() => {
      this.lstQuantityByItem.forEach((element: any) => {
        if (element.id == this.quantityId) {
          element.totalError = sum;
        }
      });
    }, 50);
  }
  mappingErrorName(index: any, errorName: any) {
    const name = errorName;
    this.lstErrorByItem[index].errorName = name;
  }
}
