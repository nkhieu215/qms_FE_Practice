
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { Profile } from 'src/app/share/response/pqcResponse/profile';

@Component({
  selector: 'app-checklist-production',
  templateUrl: './checklist-production.component.html',
  styleUrls: ['./checklist-production.component.css']
})
export class ChecklistProductionComponent implements OnInit {

  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getInfo();
    // this.getProfileList();
  }

  onSubmit(event:any){
    this.pqcService.nextStep(this.form,this.profile,"CHECK_LIST").subscribe(
      data => {
        if(data.result.responseCode == '00'){
          this.router.navigate(['/checklist-production'])
        }
      },
      err => {
      }
    );
  }

  show: boolean = false;
  pqcInfo ?: PQCWorkOrder;
  error?: string;
  classError?: string;
  lstbom?:any =[];
  lstProfile :Profile [] =[];
  profile ?:any;

  form: any = {
    productionName : null,
    productionCode : null,
    bomVersion: null,
    noteVersion: null,
    specificationVersion: null,
    branchName: null, // ngành
    groupName: null , // tổ
    workOrderId: null,
    quantityPlan: null,
    startDate: null,
    endDate: null,
    planingWorkOrderCode: null , // ma don hang
    note: null,
    lotNumber: null,
    id: null,

    profileCode:null,
    profileName:null,
    profileId:null,

  };

  getInfo(){
    const id = this.actRoute.snapshot.params['id'];
    const type = this.actRoute.snapshot.params['type'];
    this.pqcService.getDetailPqcWorkOrder(id).subscribe(
      data => {
        this.form = data.pqcWorkOrder;
        this.lstbom = data.pqcWorkOrder.lstbom;
        console.log(  this.form);
        if(this.form.status =='CREATE'){
          this.show =  false;
        }else{
          this.show  = true;
        }
      },
      err => {

      }
    );
  }


  // getProfileList(){
  //   this.pqcService.getAllProfile().subscribe(
  //     data => {
  //      this.lstProfile = data.lstProfile;
  //     },
  //     err => {

  //     }
  //   );
  // }

  // onChangeType(id:any){
  //   this.lstProfile.forEach(element => {
  //     if(element.id == id){
  //       this.form.profileCode = element.profileCode;
  //       this.form.profileName = element.name;
  //       this.form.profileId = element.id;
  //       this.profile = element;
  //     }
  //   });
  // }

}
