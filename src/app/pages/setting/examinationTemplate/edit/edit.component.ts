
import { KeycloakService } from 'keycloak-angular';

import {
  NgbModalOptions,
  ModalDismissReasons,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { AuditCriteria } from 'src/app/share/_models/auditCriteria.model';
import Utils from 'src/app/share/_utils/utils';
import { HttpClient } from '@angular/common/http';
import { OitmService } from 'src/app/share/_services/oitmservice';
import { AuthService } from 'src/app/share/_services/auth.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class ExaminationEditComponent implements OnInit {
  // bản test
  //address = 'http://localhost:8449';
  // hệ thống
  address = 'http://192.168.68.92/qms';
  path = 'api/testing-critical';
  //list tieu chi
  listOfCriticalName: any;
  listOfParameters: any;
  listOfCriticalGroup: any[] = [];
  //Biến hiển thị cho NVL
  @Input() testingName = '';
  //list item
  listOfItem: any[] = [];
  //list sp
  listOfItems: any;
  //search
  @Input() itemResult: any;
  @Input() testingCriticalGroup = '';
  //Biến check thay đổi tên và mã biên bản
  name = '';
  code = '';
  examiantionRes?: ExaminationResponse;
  title = 'Cập nhật thông tin biên bản';
  error?: string;
  classError?: string;

  examinationTypeNvl = true;
  examinationType = '1';

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  arrayAuditCLSP: Array<AuditCriteriaLKDT2> = []
  arrayAudit: Array<AuditCriteriaNvl> = [];
  form: any = {
  };

  formAudit: any = {
  };
  arrayAuditCheckDup: Array<AuditCriteriaNvl> = []
  arrayAuditLKDT2CheckDup: Array<AuditCriteriaLKDT2> = [];

  arrayAuditLKDT2: Array<AuditCriteriaLKDT2> = [];
  formAuditLKDT2: any = {
  };

  arrayAuditParam: Array<AuditCriteriaParam> = [];
  arrayAuditParamCheckDup: Array<AuditCriteriaParam> = [];
  formAuditParam: any = {
  };

  id?: number;

  constructor(
    private actRoute: ActivatedRoute,
    private examinationService: ExaminationService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService,
    private oitmService: OitmService,
    protected http: HttpClient,
    protected autoLogout: AuthService
  ) {
  }
  sortList(type: any) {
    if (type == 'NVL') {
      this.arrayAudit = this.arrayAudit.sort((a: any, b: any) => a.positionNumber - b.positionNumber);
    } else if (type == 'LKDT1') {
      this.arrayAuditLKDT2 = this.arrayAuditLKDT2.sort((a: any, b: any) => a.positionNumber - b.positionNumber);
    } else if (type == 'LKDT2') {
      this.arrayAuditParam = this.arrayAuditParam.sort((a: any, b: any) => a.positionNumber - b.positionNumber);
    }
  }
  checkDuplicateNumber(type: any) {
    if (type == 'NVL') {
      var result = this.arrayAuditCheckDup.find(x => x.positionNumber == this.formAudit.positionNumber);
      if (result) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lặp số thứ tự',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: true,
        })
        if (this.arrayAudit.length == 0) {
          this.formAudit.positionNumber = 1;
        } else {
          this.formAudit.positionNumber = 0;
          this.arrayAudit.forEach(x => {
            if (x.positionNumber! >= this.formAudit.positionNumber) {
              const i = x.positionNumber!
              this.formAudit.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    } else if (type == 'LKDT1') {
      var result1 = this.arrayAuditLKDT2CheckDup.find(x => x.positionNumber == this.formAuditLKDT2.positionNumber);
      if (result1) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lặp số thứ tự',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: true,
        })
        if (this.arrayAuditLKDT2.length == 0) {
          this.formAuditLKDT2.positionNumber = 1;
        } else {
          this.formAuditLKDT2.positionNumber = 0;
          this.arrayAuditLKDT2.forEach(x => {
            if (x.positionNumber! >= this.formAuditLKDT2.positionNumber) {
              const i = x.positionNumber!
              this.formAuditLKDT2.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    } else if (type == 'LKDT2') {
      var result2 = this.arrayAuditParamCheckDup.find(x => x.positionNumber == this.formAuditParam.positionNumber);
      if (result2) {
        Swal.fire({
          title: 'Lỗi',
          text: 'Lặp số thứ tự',
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: true,
        })
        if (this.arrayAuditParam.length == 0) {
          this.formAuditParam.positionNumber = 1;
        } else {
          this.formAuditParam.positionNumber = 0;
          this.arrayAuditParam.forEach(x => {
            if (x.positionNumber! >= this.formAuditParam.positionNumber) {
              const i = x.positionNumber!
              this.formAuditParam.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    }
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
    this.itemResult = itemCode;
    var check = false;
    for (let i = 0; i < this.listOfItem.length; i++) {
      if (this.listOfItem[i].itemCode === this.itemResult.itemCode) {
        check = true;
        Swal.fire({
          title: 'Lỗi',
          text: 'Đã tồn tại mã sản phẩm !',
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
          text: 'Bạn đã xóa thông tin sản phẩm thành công.',
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
      if (this.listOfItem.length > 5) {
        document.getElementById('table-body')!.style.width = '99.2%';
      } else {
        document.getElementById('table-body')!.style.width = '98%';
      }
      this.updateItem(null);
    }, 50)
  }
  submitItem(index: any) {
    if (this.listOfItem[index].itemCode === '') {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng điền mã sản phẩm !',
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
  // ----------------------------------------------------------- --------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
    this.getinfor();
    console.log("checsk type:", this.examinationType, this.form.type)
    this.getListTestingGroupByType();
  }

  /**
   * thêm mới thông tin audit
   */
  onSubmit(): any {
    if (this.form.name === this.name && this.form.code === this.code) {
      this.updateBienBan()
    } else {
      const data = { name: this.form.name, type: this.examinationType, code: this.form.code }
      this.http.post<any>(`${this.address}/${this.path}/examinations/check/name`, data).subscribe(res => {
        if (res.length > 0) {
          Swal.fire({
            title: 'Lỗi',
            text: 'Đã tồn tại tên biên bản',
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
                text: 'Đã tồn tại mã biên bản',
                icon: 'warning',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 5000
              })
            } else {
              this.updateBienBan();
            }
          })
        }
      })
    }
  }
  updateBienBan() {
    const { name, status, description, code } = this.form;
    const auditForm = new AuditCriteria(
      name,
      this.examinationType,
      code,
      description,
      status == 1 ? true : false,
      this.id
    );
    this.examinationService
      .create(auditForm, this.arrayAudit, this.arrayAuditLKDT2, this.arrayAuditParam, this.arrayAuditCLSP, "EDIT")
      .subscribe(
        (data) => {
          console.log(data.result);
          if (data.result.responseCode == '00') {
            // this.error = 'Cập nhật mẫu biên bản thành công';
            Swal.fire({
              title: 'Cập nhật',
              text: 'Cập nhật mẫu biên bản thành công',
              icon: 'success',
              showCancelButton: false,
              showConfirmButton: false,
              timer: 5000
            })
            this.classError = 'alert alert-success alert-dismissible fade show';
          } else {
            this.error = data.result.message;
            this.classError = 'alert alert-danger alert-dismissible fade show';
          }
        },
        (err) => {
          console.log(JSON.parse(err.error).message);
        }
      );
  }
  /**
   * thêm mới thông tin kiểm tra
   */
  onAddAudit(type: any, even: any) {
    console.log(type);
    if (type == 'LKDT1') {
      const { auditContent, regulationLevel, technicalRequirement, id, acceptanceLevel, min, max, unit, positionNumber } =
        this.formAuditLKDT2;
      var lkdt = new AuditCriteriaLKDT2();
      lkdt.auditContent = auditContent;
      lkdt.regulationLevel = regulationLevel;
      lkdt.technicalRequirement = technicalRequirement;
      lkdt.acceptanceLevel = acceptanceLevel;
      lkdt.min = min;
      lkdt.max = max;
      lkdt.unit = unit;
      lkdt.positionNumber = positionNumber;
      lkdt.ids = Utils.randomString(5);
      lkdt.templateId = this.id;
      if (even == 'EDIT') {
        (type = 'EDIT'),
          this.arrayAuditLKDT2.forEach((element, index) => {
            if (element.id == id) {
              lkdt.id = id;
              lkdt.templateId = element.templateId;
              this.arrayAuditLKDT2[index] = lkdt;
            }
          });
      } else {
        type = 'ADD';
        this.arrayAuditLKDT2.push(lkdt);
      }

      console.log(lkdt);
      this.examinationService.updateParam(null, lkdt, null, even, null).subscribe(
        (data) => {
          Swal.fire({
            title: 'Cập nhật',
            text: 'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => { }
      );
    } else if (type == 'LKDT2') {
      const { parameterName, conditions, min, max, unit, id, positionNumber } =
        this.formAuditParam;
      var lkdt2 = new AuditCriteriaParam();
      lkdt2.positionNumber = positionNumber;
      lkdt2.parameterName = parameterName;
      lkdt2.conditions = conditions;
      lkdt2.min = min;
      lkdt2.max = max;
      lkdt2.unit = unit;
      lkdt2.templateId = this.id;

      if (even == 'EDIT') {
        type = 'EDIT';
        this.arrayAuditParam.forEach((element, index) => {
          if (element.id == id) {
            lkdt2.id = id;
            lkdt2.templateId = element.templateId;
            this.arrayAuditParam[index] = lkdt2;
          }
        });
      } else {
        type = 'ADD';
        this.arrayAuditParam.push(lkdt2);
      }
      console.log(lkdt2);
      this.examinationService.updateParam(null, null, lkdt2, even, null).subscribe(
        (data) => {
          Swal.fire({
            title: 'Cập nhật',
            text: 'Bạn đã thực hiện thêm mới / cập nhật thông số kiểm tra thành công.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => { }
      );
    } else if (type == 'NVL') {
      const { criteriaName, regulationLevel, min, max, unit, note, id, acceptanceLevel, positionNumber, testingName } =
        this.formAudit;
      const audit: AuditCriteriaNvl = new AuditCriteriaNvl();
      audit.criteriaName = testingName;
      audit.regulationLevel = regulationLevel;
      audit.min = min;
      audit.max = max;
      audit.unit = unit;
      audit.note = note;
      audit.acceptanceLevel = acceptanceLevel;
      audit.positionNumber = positionNumber;
      audit.ids = Utils.randomString(5);
      audit.templateId = this.actRoute.snapshot.params['id'];
      audit.id = id;
      if (even == 'EDIT') {
        (type = 'EDIT'),
          this.arrayAudit.forEach((element, index) => {
            if (element.id == id) {
              this.arrayAudit[index] = audit;
            }
          });
      } else {
        this.arrayAudit.push(audit);
      }

      this.examinationService.updateParam(audit, null, null, even, null).subscribe(
        (data) => {
          Swal.fire({
            title: 'Cập nhật',
            text: 'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => { }
      );
    }
    else if (type == 'CLSP') {
      const { auditContent, regulationLevel, technicalRequirement, id, acceptanceLevel } = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2();
      lkdt1.auditContent = auditContent;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.acceptanceLevel = acceptanceLevel;
      lkdt1.ids = Utils.randomString(5);
      lkdt1.templateId = this.id;
      lkdt1.id = id;
      this.examinationService.updateParam(null, null, null, even, lkdt1).subscribe(
        (data) => {
          Swal.fire({
            title: 'Cập nhật',
            text: 'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 5000
          })
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => { }
      );
      this.arrayAuditCLSP.push(lkdt1);
    }
  }

  deleteAuditRow(ids: any, type: any) {
    Swal.fire({
      title: 'Cảnh báo',
      text: 'Bạn có muốn tiếp tục thực hiện xóa tiêu chí này không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.value) {
        if (type == 'LKDT2') {
          this.arrayAuditParam.forEach((element, index) => {
            if (element.id == ids) {
              this.arrayAuditParam.splice(index, 1);
              var lkdt2 = new AuditCriteriaParam();
              lkdt2.parameterName = element.parameterName;
              lkdt2.conditions = element.conditions;
              lkdt2.min = element.min;
              lkdt2.max = element.max;
              lkdt2.unit = element.unit;
              lkdt2.id = element.id;
              this.examinationService
                .updateParam(null, null, lkdt2, 'DELETE', null)
                .subscribe(
                  (data) => {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top-end",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                      }
                    });
                    Toast.fire({
                      icon: "success",
                      title: "Đã xoá thông tin thành công"
                    });
                  },
                  (err) => { }
                );
            }
          });
        } else if (type == 'LKDT1') {
          this.arrayAuditLKDT2.forEach((element, index) => {
            if (element.ids == ids) {
              this.arrayAuditLKDT2.splice(index, 1);

              var lkdt = new AuditCriteriaLKDT2();
              lkdt.auditContent = element.auditContent;
              lkdt.regulationLevel = element.regulationLevel;
              lkdt.technicalRequirement = element.technicalRequirement;
              lkdt.id = element.id;
              this.examinationService
                .updateParam(null, lkdt, null, 'DELETE', null)
                .subscribe(
                  (data) => {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top-end",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                      }
                    });
                    Toast.fire({
                      icon: "success",
                      title: "Đã xoá thông tin thành công"
                    });
                  },
                  (err) => { }
                );
            }
          });
        }
        else if (type == 'CLSP') {
          this.arrayAuditCLSP.forEach((element, index) => {
            if (element.id == ids) {
              this.arrayAuditCLSP.splice(index, 1);

              var lkdt = new AuditCriteriaLKDT2();
              lkdt.auditContent = element.auditContent;
              lkdt.regulationLevel = element.regulationLevel;
              lkdt.technicalRequirement = element.technicalRequirement;
              lkdt.id = element.id;
              this.examinationService
                .updateParam(null, null, null, 'DELETE', lkdt)
                .subscribe(
                  (data) => {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top-end",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                      }
                    });
                    Toast.fire({
                      icon: "success",
                      title: "Đã xoá thông tin thành công"
                    });
                  },
                  (err) => { }
                );
            }
          });
        }
        else {
          this.arrayAudit.forEach((element, index) => {
            if (element.id == ids) {
              this.arrayAudit.splice(index, 1);
              //delete sẻver
              this.examinationService
                .updateParam(element, null, null, 'DELETE', null)
                .subscribe(
                  (data) => {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top-end",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                      }
                    });
                    Toast.fire({
                      icon: "success",
                      title: "Đã xoá thông tin thành công"
                    });
                  },
                  (err) => { }
                );
            }
          });
        }
      }
    })
  }

  open(content: any, id: any, type: any, testingName: any, index: any) {
    // console.log('group:::::::::', this.listOfCriticalGroup)
    this.testingCriticalGroup = '';
    this.testingName = '';

    if (type == 'NVL') {
      this.formAudit = {};
      console.log("update-NVL");
      this.arrayAudit.forEach((element, index) => {
        if (element.id == id) {
          this.formAudit = element;
        }
      });
      if (this.arrayAudit.length == 0) {
        this.formAudit.positionNumber = 1;
      } else {
        console.log("update-check");
        this.arrayAuditCheckDup = [];
        if (index != null) {
          const list = this.arrayAudit;
          console.log("update", this.arrayAuditCheckDup);
          this.arrayAuditCheckDup = list.filter(x => x.positionNumber != list[index].positionNumber);
        } else {
          console.log("insert", this.arrayAuditCheckDup);
          const list1 = this.arrayAudit;
          this.arrayAuditCheckDup = list1;
          this.formAudit.positionNumber = 0;
          this.arrayAudit.forEach(x => {
            if (x.positionNumber! >= this.formAudit.positionNumber) {
              const i = x.positionNumber!
              this.formAudit.positionNumber = Number(i) + 1;

            }
          })
        }
      }
    } else if (type == 'LKDT2') {

      this.arrayAuditParam.forEach((element, index) => {
        if (element.id == id) {
          this.formAuditParam = element;
        }
      });
      if (this.arrayAuditParam.length == 0) {
        this.formAuditParam.positionNumber = 1;
      } else {
        if (index != null) {
          const list5 = this.arrayAuditParam;
          this.arrayAuditParamCheckDup = list5.filter(x => x.positionNumber != list5[index].positionNumber);
        } else {
          const list6 = this.arrayAuditParam
          this.arrayAuditParamCheckDup = list6;
          this.formAuditParam.positionNumber = 0;
          this.arrayAuditParam.forEach(x => {
            if (x.positionNumber! >= this.formAuditParam.positionNumber) {
              const i = x.positionNumber!
              this.formAuditParam.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    } else if (type == 'LKDT1') {
      this.formAuditLKDT2 = {};
      this.arrayAuditLKDT2.forEach((element, index) => {
        if (element.id == id) {
          this.formAuditLKDT2 = element;
        }
      });
      if (this.arrayAuditLKDT2.length == 0) {
        this.formAuditLKDT2.positionNumber = 1;
      } else {
        if (index != null) {
          const list2 = this.arrayAuditLKDT2;
          this.arrayAuditLKDT2CheckDup = list2.filter(x => x.positionNumber != list2[index].positionNumber);
        } else {
          const list3 = this.arrayAuditLKDT2
          this.arrayAuditLKDT2CheckDup = list3;
          this.formAuditLKDT2.positionNumber = 0;
          this.arrayAuditLKDT2.forEach(x => {
            if (x.positionNumber! >= this.formAuditLKDT2.positionNumber) {
              const i = x.positionNumber!
              this.formAuditLKDT2.positionNumber = Number(i) + 1;
            }
          })
        }
      }
    }
    else if (type == 'CLSP') {
      this.arrayAuditCLSP.forEach((element, index) => {
        if (element.id == id) {
          this.formAuditLKDT2 = element;
        }
      });
    }
    else {
      this.formAudit = {};
      this.formAuditLKDT2 = {};
      this.formAuditParam = {};
      // console.log(this.formAudit);
    }
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (testingName !== null) {
      this.formAuditLKDT2.testingName = testingName;
      this.formAudit.testingName = testingName;
      var data = { testingName: testingName }
      // this.http.post<any>(`${this.address}/${this.path}/get-group-name`, data).subscribe(res => {
      //   this.testingCriticalGroup = res.testingCriticalGroup;
      //   console.log("group name: ", res)
      // })
    }
    if (!this.listOfParameters) {
      var data1 = { testingCriticalGroup: 'Thông số điện', type: 'LKDT' }
      this.http.post<any>(`${this.address}/${this.path}/get-list-guide`, data1).subscribe(res => {
        this.listOfParameters = res;
        console.log(this.listOfParameters)
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

  onChangeType(type: any) {
    if (type == '1') {
      this.examinationTypeNvl = true;
    } else {
      this.examinationTypeNvl = false;
    }
    this.examinationType = type;
    setTimeout(() => {
      this.getListTestingGroupByType();
    }, 100);
    console.log("check type", type, this.listOfCriticalGroup);
  }

  getinfor() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;
    this.examinationService.detail(id).subscribe(
      (data) => {
        console.log(data)
        this.name = data.examinationType.name;
        this.code = data.examinationType.code;
        this.examiantionRes = data;
        this.form = this.examiantionRes?.examinationType;
        this.arrayAudit =
          this.examiantionRes?.examinationType?.lstAuditCriteriaNvl || [];
        this.arrayAudit.forEach(element => {
          element.ids = Utils.randomString(5);
        })
        this.sortList('NVL');
        this.arrayAuditParam =
          data.examinationType.iqcAuditCriteriaParameters || [];
        this.arrayAuditParam.forEach(element => {
          element.ids = Utils.randomString(5);
        })
        this.sortList('LKDT2');

        this.arrayAuditLKDT2 = data.examinationType.lstAuditCriteriaLkdt;
        this.arrayAuditLKDT2.forEach(element => {
          element.ids = Utils.randomString(5);
        })
        this.sortList('LKDT1');
        this.arrayAuditCLSP = data.examinationType.lstPqcCriteriaQualities;
        this.arrayAuditCLSP.forEach(element => {
          element.ids = Utils.randomString(5);
        })
        this.onChangeType(this.examiantionRes?.examinationType?.type + '');
      },
      (err) => { }
    );
    this.http.get<any>(`${this.address}/${this.path}/examinations/get-all/${id}`).subscribe(res => {
      this.listOfItem = res;
      console.log("list item", this.listOfItem);
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
  getListTestingGroupByType() {
    this.listOfCriticalGroup = [];
    if (this.examinationType === '1') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'NVL' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
        console.log("check nhom tieu chi 1", this.listOfCriticalGroup);
      })
    } else if (this.examinationType === '2') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'LKDT' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
        console.log("check nhom tieu chi 2", this.listOfCriticalGroup);
      })
    } else if (this.examinationType === '3') {
      var data = { testingCriticalGroup: this.testingCriticalGroup, type: 'Đánh giá CL SP' }
      this.http.post<any>(`${this.address}/${this.path}/group/type/get-all`, data).subscribe(res => {
        this.listOfCriticalGroup = res;
        console.log("check nhom tieu chi 3", this.listOfCriticalGroup);
      })
    }
  }
}
