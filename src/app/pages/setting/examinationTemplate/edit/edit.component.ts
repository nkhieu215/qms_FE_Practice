
import { KeycloakService } from 'keycloak-angular';

import {
  NgbModalOptions,
  ModalDismissReasons,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExaminationResponse } from 'src/app/share/response/examination/ExaminationResponse';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { AuditCriteria } from 'src/app/share/_models/auditCriteria.model';
import Utils from 'src/app/share/_utils/utils';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class ExaminationEditComponent implements OnInit {
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

  arrayAuditCLSP : Array<AuditCriteriaLKDT2> = []
  arrayAudit: Array<AuditCriteriaNvl> = [];
  form: any = {
  };

  formAudit: any = {
  };

  arrayAuditLKDT2: Array<AuditCriteriaLKDT2> = [];
  formAuditLKDT2: any = {
  };

  arrayAuditParam: Array<AuditCriteriaParam> = [];
  formAuditParam: any = {
  };

  id?:number;

  constructor(
    private actRoute: ActivatedRoute,
    private examinationService: ExaminationService,
    private modalService: NgbModal,
    private tokenStorage: KeycloakService
  ) {
  }

  ngOnInit(): void {
    this.getinfor();
  }

  /**
   * thêm mới thông tin audit
   */
  onSubmit(): any {
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
      .create(auditForm,this.arrayAudit, this.arrayAuditLKDT2,this.arrayAuditParam, this.arrayAuditCLSP,"EDIT")
      .subscribe(
        (data) => {
          console.log(data.result);
          if (data.result.responseCode == '00') {
            this.error = 'Cập nhật mẫu biên bản thành công';
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
      const { auditContent, regulationLevel, technicalRequirement, id } =
        this.formAuditLKDT2;
      var lkdt = new AuditCriteriaLKDT2();
      lkdt.auditContent = auditContent;
      lkdt.regulationLevel = regulationLevel;
      lkdt.technicalRequirement = technicalRequirement;
      lkdt.ids = Utils.randomString(5);
      lkdt.templateId= this.id;
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

          Swal.fire(
            'Cập nhật thông tin',
            'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            'success'
          )
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => {}
      );
    } else if (type == 'LKDT2') {
      const { parameterName, conditions, min, max, unit, id } =
        this.formAuditParam;
      var lkdt2 = new AuditCriteriaParam();
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

          Swal.fire(
            'Cập nhật thông tin',
            'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            'success'
          )
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => {}
      );
    } else if (type == 'NVL') {
      const { criteriaName, regulationLevel, min, max, unit, note, id } =
        this.formAudit;
      const audit: AuditCriteriaNvl = new AuditCriteriaNvl();
      audit.criteriaName = criteriaName;
      audit.regulationLevel = regulationLevel;
      audit.min = min;
      audit.max = max;
      audit.unit = unit;
      audit.note = note;
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
          Swal.fire(
            'Cập nhật thông tin',
            'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            'success'
          )
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => {}
      );
    }
    else if(type == 'CLSP'){
      const { auditContent, regulationLevel, technicalRequirement, id} = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2 ();
      lkdt1.auditContent =  auditContent;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.ids = Utils.randomString(5);
      lkdt1.templateId = this.id;
      lkdt1.id = id;
      this.examinationService.updateParam(null, null, null, even, lkdt1).subscribe(
        (data) => {
          Swal.fire(
            'Cập nhật thông tin',
            'Bạn đã thực hiện thêm mới / cập nhật thông tin kiểm tra thành công.',
            'success'
          )
          this.getinfor();
          this.modalService.dismissAll();
        },
        (err) => {}
      );
      this.arrayAuditCLSP.push(lkdt1) ;
    }
  }

  deleteAuditRow(ids: any, type: any) {
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
              (data) => {},
              (err) => {}
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
            .updateParam(null, lkdt, null, 'DELETE',null)
            .subscribe(
              (data) => {},
              (err) => {}
            );
        }
      });
    }
    else if(type == 'CLSP'){
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
                Swal.fire(
                  'Xóa',
                  'Bạn đã thực hiện xóa thông tin kiểm tra thành công.',
                  'success'
                )
              },
              (err) => {}
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
              (data) => {},
              (err) => {}
            );
        }
      });
    }
  }

  open(content: any, id: any, type: any) {
    console.log(id);
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    if (type == 'NVL') {
      this.arrayAudit.forEach((element, index) => {
        if (element.id == id) {
          this.formAudit = element;
        }
      });
    } else if (type == 'LKDT2') {

      this.arrayAuditParam.forEach((element, index) => {
        if (element.id == id) {
          this.formAuditParam = element;
        }
      });

    } else if (type == 'LKDT1') {
      this.arrayAuditLKDT2.forEach((element, index) => {
        if (element.id == id) {
          this.formAuditLKDT2 = element;
        }
      });
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
      this.formAuditLKDT2 ={};
      this.formAuditParam = {};
      this.formAuditLKDT2 = {};
      console.log(this.formAudit);
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
    console.log(type);
    if (type == '1') {
      this.examinationTypeNvl = true;
    } else {
      this.examinationTypeNvl = false;
    }
    this.examinationType = type;
  }

  getinfor() {
    const id = this.actRoute.snapshot.params['id'];
    this.id = id;
    this.examinationService.detail(id).subscribe(
      (data) => {
        this.examiantionRes = data;
        this.form = this.examiantionRes?.examinationType;
        this.arrayAudit =
          this.examiantionRes?.examinationType?.lstAuditCriteriaNvl || [];
          this.arrayAudit.forEach(element=>{
            element.ids = Utils.randomString(5);
          })
        this.arrayAuditParam =
          data.examinationType.iqcAuditCriteriaParameters || [];
          this.arrayAuditParam.forEach(element=>{
            element.ids = Utils.randomString(5);
          })

        this.arrayAuditLKDT2 = data.examinationType.lstAuditCriteriaLkdt;
        this.arrayAuditLKDT2.forEach(element=>{
          element.ids = Utils.randomString(5);
        })

        this.arrayAuditCLSP =  data.examinationType.lstPqcCriteriaQualities;
        this.arrayAuditCLSP.forEach(element=>{
          element.ids = Utils.randomString(5);
        })
        this.onChangeType(this.examiantionRes?.examinationType?.type + '');
      },
      (err) => {}
    );
  }
}
