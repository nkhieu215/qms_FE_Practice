import { formatDate } from '@angular/common';

import { Component,  OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuditCriteria } from 'src/app/share/_models/auditCriteria.model';
import { AuditCriteriaLKDT2 } from 'src/app/share/_models/auditCriteriaLkdt2.model';
import { AuditCriteriaNvl } from 'src/app/share/_models/auditCriteriaNvl.model';
import { AuditCriteriaParam } from 'src/app/share/_models/auditCriteriaParam.model';
import { ExaminationService } from 'src/app/share/_services/examination.service';
import { TokenStorageService } from 'src/app/share/_services/token-storage.service';
import Utils from 'src/app/share/_utils/utils';
@Component({
  selector: 'app-examination-add',
  templateUrl: './examination-add.component.html',
  styleUrls: ['./examination-add.component.css'],
})
export class ExaminationAddComponent implements OnInit {
  title = 'Thêm mới mẫu biên bản';
  error?:string;
  classError?:string;

  examinationTypeNvl = 1;
  examinationType = '1';

  closeResult: string = '';
  modalOptions:NgbModalOptions= {
    size: 'lg'
  };

  arrayAudit : Array<AuditCriteriaNvl> = []
  arrayAuditCLSP : Array<AuditCriteriaLKDT2> = []
  form: any = { };

  formAudit: any ={}

  arrayAuditParam :Array<AuditCriteriaParam> =  [];
  formAuditParam: any ={}

  arrayAuditLKDT2 :Array<AuditCriteriaLKDT2> =  [];
  formAuditLKDT2: any ={
    auditContent: null,
    regulationLevel: null,
    technicalRequirement: null
  }

  constructor(private examinationService: ExaminationService, private modalService: NgbModal,private tokenStorage: TokenStorageService) {

  }

  ngOnInit(): void {
    this.form.code = 'RDQC' + formatDate(new Date(), 'yyMMdd_HHmm', 'en_US')
  }

  /**
   * thêm mới thông tin audit
   */
  onSubmit(): any {
    const { name, status, description, code } = this.form;
    const auditForm = new AuditCriteria(name, this.examinationType, code,  description, status,0);
    this.examinationService.create(auditForm,this.arrayAudit, this.arrayAuditLKDT2,this.arrayAuditParam, this.arrayAuditCLSP,"ADD").subscribe(
      data => {
        console.log(data.result);
        if(data.result.responseCode == '00'){
          this.error = "Thêm mới mẫu biên bản thành công";
          this.classError = "alert alert-success alert-dismissible fade show";
        }else{
          this.error = data.result.message;
          this.classError = "alert alert-danger alert-dismissible fade show";
        }
      },
      err => {
        console.log(JSON.parse(err.error).message)
      }
    );
  }

  /**
   * thêm mới thông tin kiểm tra
   */
  onAddAudit(type:any,action:any) {

    console.log(type);
    if(type == 'LKDT1'){
      const { auditContent,regulationLevel,technicalRequirement} = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2 ();
      lkdt1.auditContent =  auditContent;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.ids = Utils.randomString(5);
      if(action  =='ADD'){
        this.arrayAuditLKDT2.push(lkdt1);
      }
    }
    else if(type == 'LKDT2'){
      const { parameterName, conditions, min, max, unit } = this.formAuditParam;
      var lkdt2 = new AuditCriteriaParam ();
      lkdt2.parameterName = parameterName;
      lkdt2.conditions=  conditions;
      lkdt2.min =  min;
      lkdt2.max =  max;
      lkdt2.unit =  unit;
      if(action  =='ADD'){
        this.arrayAuditParam.push(lkdt2);
      }
    }
    else if(type == 'CLSP'){
      const { auditContent, regulationLevel, technicalRequirement} = this.formAuditLKDT2;
      var lkdt1 = new AuditCriteriaLKDT2 ();
      lkdt1.auditContent =  auditContent;
      lkdt1.regulationLevel = regulationLevel;
      lkdt1.technicalRequirement = technicalRequirement;
      lkdt1.ids = Utils.randomString(5);
      if(action  =='ADD'){
        this.arrayAuditCLSP.push(lkdt1) ;
      }
    }

    else if(type == 'NVL'){
      const { criteriaName, regulationLevel, min, max, unit ,note} = this.formAudit;
      const audit: AuditCriteriaNvl = new AuditCriteriaNvl();
      audit.criteriaName = criteriaName;
      audit.regulationLevel = regulationLevel;
      audit.min = min;
      audit.max = max;
      audit.unit = unit;
      audit.note= note;
      audit.ids = Utils.randomString(5);
      if(action  =='ADD'){
        this.arrayAudit.push(audit) ;
      }
    }

    this.modalService.dismissAll();
  }

  deleteAuditRow(ids:any, type:any){
    if(type == 'LKDT1'){
      this.arrayAuditLKDT2.forEach((element,index)=>{
        if(element.ids == ids){
          this.arrayAuditLKDT2.splice(index, 1);
        }
      });
    }else if(type == 'LKDT2'){
      this.arrayAuditParam.forEach((element,index)=>{
        if(element.ids == ids){
          this.arrayAuditParam.splice(index, 1);
        }
      });
    }
    else if(type == 'CLSP'){
      this.arrayAuditCLSP.forEach((element,index)=>{
        if(element.ids == ids){
          this.arrayAuditCLSP.splice(index, 1);
        }
      });
    }
    else{
      this.arrayAudit.forEach((element,index)=>{
        if(element.ids == ids){
          this.arrayAudit.splice(index, 1);
        }
      });
    }
  }

  open(content:any, ids:any, type:string) {

    this.formAudit = {};
    this.formAuditLKDT2 = {};
    this.formAuditParam = {};



    if(type == 'NVL' && ids != ''){
        this.arrayAudit.forEach(element=>{
          if(ids == element.ids){
            this.formAudit = element;
          }
        })
    }


    if(type == 'LKDT1' && ids != ''){
        this.arrayAuditLKDT2.forEach(element=>{
          if(ids == element.ids){
            this.formAuditLKDT2 = element;
          }
        })
    }

    if(type == 'LKDT2' && ids != ''){
        this.arrayAuditParam.forEach(element=>{
          if(ids == element.ids){
            this.formAuditParam = element;
          }
        })
    }


    if(type == 'CLSP'&&  ids != '' ){
        this.arrayAuditCLSP.forEach(element=>{
          if(ids == element.ids){
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
      return  `with: ${reason}`;
    }
  }


  onChangeType(type:any){
    this.examinationType = type;
  }
}
