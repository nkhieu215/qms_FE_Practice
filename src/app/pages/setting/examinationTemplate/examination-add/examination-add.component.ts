import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuditCriteria } from 'src/app/share/_models/auditCriteria.model';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { TokenStorageService } from 'src/app/share/_services/token-storage.service';
import Utils from 'src/app/share/_utils/utils';
import { timer } from 'rxjs';
@Component({
  selector: 'app-examination-add',
  templateUrl: './examination-add.component.html',
  styleUrls: ['./examination-add.component.css'],
})
export class ExaminationAddComponent implements OnInit {

  // bản test
  //address = 'http://localhost:8449';
  // hệ thống
  address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  //list item
  listOfItem: any[] = [];
  //list sp
  listOfItems: any;
  //list tieu chi
  listOfCriticalName: any;
  listOfParameters: any;
  listOfCriticalGroup: any;
  //Biến hiển thị cho NVL
  @Input() testingName = '';
  //search
  @Input() itemResult: any;
  @Input() testingCriticalGroup = '';
  id = 0;
  title = 'Thêm mới mẫu biên bản';
  error?: string;
  classError?: string;

  examinationTypeNvl = 1;
  examinationType = '1';

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg'
  };

  arrayAudit: Array<AuditCriteriaNvl> = []
  arrayAuditCLSP: Array<AuditCriteriaLKDT2> = []
  form: any = {};

  formAudit: any = {}

  arrayAuditParam: Array<AuditCriteriaParam> = [];
  formAuditParam: any = {}

  arrayAuditLKDT2: Array<AuditCriteriaLKDT2> = [];
  formAuditLKDT2: any = {
    auditContent: null,
    regulationLevel: null,
    technicalRequirement: null
  }

  constructor(private examinationService: ExaminationService, private modalService: NgbModal, private tokenStorage: TokenStorageService, private oitmService: OitmService,
    protected http: HttpClient) {

  }
  // ----------------------------------------------------------- Danh sách sản phẩm áp dụng mẫu biên bản --------------------------------------------
  getListOfItems(value: any) {
    if (value.length > 3) {
      this.oitmService.searchBycode(value).subscribe((data: any) => {
        this.listOfItems = data.lstOitm;
        console.log('hello', this.listOfItems);
      });
    }
  }
  onSelectedElectronic(index: any, itemCode: any) {
    if (this.id === 0) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng tạo trước mẫu biên bản',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 5000
      })
      this.listOfItem[index].itemCode = '';
      this.listOfItem[index].itemName = '';
      this.listOfItems = [];
    } else {
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
            timer: 5000
          })
        }
      }
      setTimeout(() => {
        if (check === false) {
          this.listOfItem[index].itemCode = this.itemResult.itemCode;
          this.listOfItem[index].itemName = this.itemResult.itemName;
          setTimeout(() => {
            this.submitItem(index);
          }, 10);
        } else {
          this.listOfItem[index].itemCode = '';
          this.listOfItem[index].itemName = '';
          this.listOfItems = [];

        }
      }, 50);
    }
  }
  deleteById(index: any) {
    if (this.listOfItem[index].id === null) {
      this.listOfItem = this.listOfItem.filter((item: any) => item.itemCode !== this.listOfItem[index].itemCode);
    } else {
      this.http.delete<any>(`${this.address}/${this.path}/examinations/delete/${this.listOfItem[index].id}`).subscribe(() => {
        this.listOfItem = this.listOfItem.filter((item: any) => item.itemCode !== this.listOfItem[index].itemCode);
        if (this.listOfItem.length > 5) {
          document.getElementById('table-body')!.style.width = '99.2%';
        } else {
          document.getElementById('table-body')!.style.width = '98%';
        }
        Swal.fire({
          title: 'Xóa',
          text: 'Bạn đã xóa thông tin sản phẩm thành công. ',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      })
    }
  }
  updateItem(id: any) {
    if (id === null) {
      document.getElementById(`null-input`)!.hidden = false;
      document.getElementById(`null-button`)!.hidden = false;
      document.getElementById(`null-span`)!.hidden = true;

    } else {
      if (document.getElementById(`${id.toString()}-input`)!.hidden == true) {
        document.getElementById(`${id.toString()}-input`)!.hidden = false;
        document.getElementById(`${id.toString()}-button`)!.hidden = false;
        document.getElementById(`${id.toString()}-span`)!.hidden = true;
      } else {
        document.getElementById(`${id.toString()}-input`)!.hidden = true;
        document.getElementById(`${id.toString()}-button`)!.hidden = true;
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
      iqcExamId: this.id,
    }
    this.listOfItem = [item, ... this.listOfItem];

    setTimeout(() => {
      //document.getElementById(`btn-save-item`)!.hidden = false;
      if (this.listOfItem.length > 5) {
        document.getElementById('table-body')!.style.width = '99.2%';
      } else {
        document.getElementById('table-body')!.style.width = '98%';
      }
      this.updateItem(null);
    }, 50)
  }
  submitItems() {
    console.log(this.listOfItem)
    if (this.id === 0) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng tạo trước mẫu biên bản',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 5000
      })
    } else {
      var nullName = this.listOfItem.find(item => item.itemCode === '');
      if (nullName) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Thông tin sản phẩm bị trống! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      } else {
        this.http.post<any>(`${this.address}/${this.path}/examinations/submits`, this.listOfItem).subscribe(() => {
          Swal.fire({
            title: 'Thêm mới',
            text: 'Bạn đã thêm mới thông tin sản phẩm thành công.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          document.getElementById(`btn-save-item`)!.hidden = true;
          window.history.back();
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
      this.http.post<any>(`${this.address}/${this.path}/examinations/submit`, this.listOfItem[index]).subscribe((res) => {
        this.listOfItem[index].id = res.id;
        setTimeout(() => {
          this.updateItem(this.listOfItem[index].id);
        }, 50)
        this.listOfItems = [];
        Swal.fire({
          title: 'Cập nhật',
          text: 'Bạn đã cập nhật thông tin sản phẩm thành công.',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      })
    }
  }
  checkDublicateByCode(code: any) {
    const data = { code: code, type: this.examinationType }
    this.http.post<any>(`${this.address}/${this.path}/examinations/check/code`, data).subscribe(res => {
      if (res.length > 0) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại mã biên bản ! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      }
    })
  }
  checkDublicateByName(name: any) {
    const data = { name: name, type: this.examinationType }
    this.http.post<any>(`${this.address}/${this.path}/examinations/check/name`, data).subscribe(res => {
      if (res.length > 0) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại tên biên bản! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      }
    })
  }
  findByCritiCalGroup() {
    this.listOfCriticalName = [];
    if (this.examinationType === '1') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'NVL' }
      this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
        this.listOfCriticalName = res;
        console.log(this.listOfCriticalName)
      })
    } else if (this.examinationType === '2') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'LKDT' }
      this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
        this.listOfCriticalName = res;
        console.log(this.listOfCriticalName)

      })
    } else if (this.examinationType === '3') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'Đánh giá CL SP' }
      this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data).subscribe(res => {
        this.listOfCriticalName = res;
        console.log(this.listOfCriticalName)

      })
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.form.code = 'RDQC' + formatDate(new Date(), 'yyMMdd_HHmm', 'en_US')
    this.getListTestingGroupByType();
  }

  /**
   * thêm mới thông tin audit
   */
  onSubmit(): any {
    const data = { name: this.form.name, type: this.examinationType, code: this.form.code }
    this.http.post<any>(`${this.address}/${this.path}/examinations/check/name`, data).subscribe(res => {
      if (res.length > 0) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại tên biên bản ! ',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 5000
        })
      } else {
        this.http.post<any>(`${this.address}/${this.path}/examinations/check/code`, data).subscribe(res => {
          if (res.length > 0) {
            Swal.fire({
              title: 'Lỗi',
              text: 'Đã tồn tại mã biên bản ! ',
              icon: 'warning',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 5000
            })
          } else {
            const examinationType = this.examinationType === '1' ? 1 : 0;
            const { name, status, description, code } = this.form;
            const auditForm = new AuditCriteria(name, this.examinationType, code, description, status, 0);
            console.log("thêm mới: ", this.arrayAudit)
            this.examinationService.create(auditForm, this.arrayAudit, this.arrayAuditLKDT2, this.arrayAuditParam, this.arrayAuditCLSP, "ADD").subscribe(
              data => {
                console.log("result", name, this.examinationType);
                if (data.result.responseCode == '00') {
                  this.error = "Thêm mới mẫu biên bản thành công";
                  Swal.fire({
                    title: 'Thêm mới',
                    text: 'Thêm mới mẫu biên bản thành công',
                    icon: 'success',
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 5000
                  })
                  const data1 = { code: code, type: examinationType }
                  this.http.post<any>(`${this.address}/${this.path}/examinations/check/code`, data1).subscribe(res => {
                    this.id = res[0].id;
                    this.listOfItem.forEach((item: any) => {
                      item.iqcExamId = res[0].id;
                    })
                    console.log('list item;', this.listOfItem);
                  })
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
        })
      }
    })
  }

  /**
   * thêm mới thông tin kiểm tra
   */
  onAddAudit(type: any, action: any) {

    console.log(type);
    if (type == 'LKDT1') {
      const { auditContent, regulationLevel, technicalRequirement, acceptanceLevel } = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2();
      lkdt1.auditContent = this.testingName;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.acceptanceLevel = acceptanceLevel;
      lkdt1.ids = Utils.randomString(5);
      if (action == 'ADD') {
        this.arrayAuditLKDT2.push(lkdt1);
      }
    }
    else if (type == 'LKDT2') {
      const { parameterName, conditions, min, max, unit } = this.formAuditParam;
      var lkdt2 = new AuditCriteriaParam();
      lkdt2.parameterName = parameterName;
      lkdt2.conditions = conditions;
      lkdt2.min = min;
      lkdt2.max = max;
      lkdt2.unit = unit;
      if (action == 'ADD') {
        this.arrayAuditParam.push(lkdt2);
      }
    }
    else if (type == 'CLSP') {
      const { auditContent, regulationLevel, technicalRequirement, acceptanceLevel } = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2();
      lkdt1.auditContent = this.testingName;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.acceptanceLevel = acceptanceLevel;
      lkdt1.ids = Utils.randomString(5);
      if (action == 'ADD') {
        this.arrayAuditCLSP.push(lkdt1);
      }
    }

    else if (type == 'NVL') {
      //const testingName = this.testingName;
      const { regulationLevel, min, max, unit, note, acceptanceLevel } = this.formAudit;
      const criteriaName = this.testingName
      const audit: AuditCriteriaNvl = new AuditCriteriaNvl();
      audit.criteriaName = criteriaName;
      audit.regulationLevel = regulationLevel;
      audit.min = min;
      audit.max = max;
      audit.unit = unit;
      audit.note = note;
      audit.acceptanceLevel = acceptanceLevel;
      audit.ids = Utils.randomString(5);
      if (action == 'ADD') {
        this.arrayAudit.push(audit);
      }
    }

    this.modalService.dismissAll();
  }

  deleteAuditRow(ids: any, type: any) {
    if (type == 'LKDT1') {
      this.arrayAuditLKDT2.forEach((element, index) => {
        if (element.ids == ids) {
          this.arrayAuditLKDT2.splice(index, 1);
        }
      });
    } else if (type == 'LKDT2') {
      this.arrayAuditParam.forEach((element, index) => {
        if (element.ids == ids) {
          this.arrayAuditParam.splice(index, 1);
        }
      });
    }
    else if (type == 'CLSP') {
      this.arrayAuditCLSP.forEach((element, index) => {
        if (element.ids == ids) {
          this.arrayAuditCLSP.splice(index, 1);
        }
      });
    }
    else {
      this.arrayAudit.forEach((element, index) => {
        if (element.ids == ids) {
          this.arrayAudit.splice(index, 1);
        }
      });
    }
  }

  open(content: any, ids: any, type: string, testingName: any) {
    this.testingCriticalGroup = '';
    this.testingName = '';
    if (testingName !== null) {
      this.testingName = testingName;
      var data = { testingName: testingName }
      this.http.post<any>(`${this.address}/${this.path}/get-group-name`, data).subscribe(res => {
        this.testingCriticalGroup = res.testingCriticalGroup;
        console.log("group name: ", res)
      })
    }
    if (!this.listOfParameters) {
      var data1 = { testingCriticalGroup: 'Thông số điện', type: 'LKDT' }
      this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data1).subscribe(res => {
        this.listOfParameters = res;
        console.log(this.listOfParameters)
      })
    }
    this.formAudit = {};
    this.formAuditLKDT2 = {};
    this.formAuditParam = {};



    if (type == 'NVL' && ids != '') {
      this.arrayAudit.forEach(element => {
        if (ids == element.ids) {
          this.formAudit = element;
        }
      })
    }


    if (type == 'LKDT1' && ids != '') {
      this.arrayAuditLKDT2.forEach(element => {
        if (ids == element.ids) {
          this.formAuditLKDT2 = element;
        }
      })
    }

    if (type == 'LKDT2' && ids != '') {
      this.arrayAuditParam.forEach(element => {
        if (ids == element.ids) {
          this.formAuditParam = element;
        }
      })
    }


    if (type == 'CLSP' && ids != '') {
      this.arrayAuditCLSP.forEach(element => {
        if (ids == element.ids) {
          this.formAuditLKDT2 = element;
        }
      })
    }



    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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


  onChangeType(type: any) {
    this.examinationType = type;
    this.getListTestingGroupByType();
  }
  getListTestingGroupByType() {
    this.listOfCriticalGroup = [];
    if (this.examinationType === '1') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'NVL' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
      })
    } else if (this.examinationType === '2') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'LKDT' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
      })
    } else if (this.examinationType === '3') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'Đánh giá CL SP' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
      })
    }
  }

}
