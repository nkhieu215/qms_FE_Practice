import { formatDate } from '@angular/common';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from 'src/app/share/response/pqcResponse/profile';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ViewChild, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { Bom } from 'src/app/share/response/pqcResponse/bom';
import { NVLScan } from 'src/app/share/response/pqcResponse/nvlScan';
import { PartNumberDetail } from 'src/app/share/response/pqcResponse/partnumber_detail';
import { Dnlnvl, MachineDetail } from 'src/app/share/_models/dnl_scan_nvl_100.modal';
import { PQCNVlService } from 'src/app/share/_services/pqc_nvl.service';
import { PQCScan100Service } from 'src/app/share/_services/pqcScan100.service';
@Component({
  selector: 'app-nvl100-production',
  templateUrl: './nvl100-production.component.html',
  styleUrls: ['./nvl100-production.component.css']
})
export class Nvl100ProductionComponent implements OnInit {

  @Input() show_check = '';
  idWorkOrder?:string;
  show_work_order = true;

  feeder = "";
  partnumber = "";
  error = "";
  text = "";
  showTableForm = false;
  showForm() {
    this.showTableForm = true;
  }

  show: boolean = false;
  pqcInfo?: PQCWorkOrder;
  classError?: string;
  lstbom: Bom[] = [];
  lstScan:any[]=[];
  lstScanFail:any[]=[];

  lstbomData: Bom[] = [];
  lstScanView: NVLScan[] = [];
  profile: Profile = new Profile;
  lstPartNumberByProfileDetail: PartNumberDetail[] = [];
  form: any = {};
  strMachine?:string ='';
  strSide?:string ='';
  strFeeder?:string ='';
  strMaterial?:string= '';
  strSerial?:string='';
  lstPartNumber:any[]=[];
  lstMaterial:any[]=[];
  lstFeeder:any[]=[];

  strQr?:string='';
  dnlnvl?:Dnlnvl[]=[]

  machineDetail?:MachineDetail;

  @HostListener('document:keydown', ['$event'])

  clickout(event: any) {
    if (event.code == 'Enter') {
      this.text = this.replaceAll(this.text, 'Shift', '');
      this.text = this.replaceAll(this.text, 'Backspace', '');
      this.text = this.replaceAll(this.text,'CapsLock','');
      this.text = this.replaceAll(this.text,'Control','')
      this.text = this.replaceAll(this.text,'Alt','')

      console.log(this.text);

      if(!this.strMachine){
        this.strMachine = this.text;
        this.form.machineCode = this.strMachine;
        this.text = "";
        // check machine
        return;
      }

      let side = this.form.side ?? '';
      // if(!side){
      //   Swal.fire({
      //     title: 'Lỗi',
      //     text: 'Bạn chưa thực hiện chọn thông tin mặt máy. Vui lòng lựa chọn mặt máy và scan lại.',
      //     allowEnterKey: false,
      //     icon: 'warning',
      //   })

      //   this.text = "";
      //   return;
      // }

      // get machine detail
      this.checkMachine();

      if(!this.strFeeder){
        this.strFeeder = this.text;
        this.form.feeder = this.strFeeder;
        this.text = "";
        return;
      }

      if(!this.strMaterial ){
        this.strMaterial = this.text;
        this.strQr = this.text;
        let materialArr =  this.strMaterial.split("#");
        this.strMaterial = materialArr[0];
        this.partnumber = materialArr[1];
        this.form.material = this.strMaterial;
        this.text = "";
      }

      this.checkFeeder();

    }
    if (event.code != 'Shift' && event.code != 'Enter') {
      this.text += event.key;
    }
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }


  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private nvlService: PQCNVlService,
    private scan100: PQCScan100Service,
    private modalService: NgbModal,) { }

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };

  lstScanDto:any [] =[]

  ngOnInit(): void {
    if (this.show_check == 'SHOW') {
      this.show_work_order = false;
    }

    this.getInfo();
  }

  onSubmit(event: any) {
    this.pqcService.nextStep(this.form, null, "CHECK_NVL").subscribe(
      data => {

      },
      err => {
      }
    );
  }



  getInfo() {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    const type = this.actRoute.snapshot.params['type'];
    this.pqcService.getDetailPqcWorkOrder(id).subscribe(
      data => {
        this.form = data.pqcWorkOrder;
        console.log(this.form);
        this.lstScanDto = data.pqcWorkOrder.lstPqcScan100;
        if(this.lstScanDto && this.lstScanDto.length >0){
          this.lstScanDto.forEach(element => {
            let data ={
              workOrderId :element.workOrderId,
              machine:element.machine,
              side:element.side,
              feeder:element.feeder,
              material:element.material,
              qr:element.qr,
              date: element.date
            };

            if(element.status ==1){
              this.lstScan.push(data);
            }else{
              this.lstScanFail.push(data);
            }
          });
        }
        if (this.form.status == 'CREATE') {
          this.show = false;
        } else {
          this.show = true;
        }
        this.getProfileDetail();
      },
      err => {

      }
    );
  }

  checkMachine(){
    let machineCode = this.strMachine;
    let checkMachine = false;
    let checkSide = false;
    let side = this.form.side;
    this.lstPartNumber = [];
    this.lstFeeder = [];

    // tìm máy trong nhóm
    this.dnlnvl?.forEach(element=>{
      element.machine.forEach(machine=>{
        console.log("machineName :: " + machine.machineName + " | machineCode::" + machineCode)
        if(machine.machineName == machineCode){
          checkMachine = true;
          this.lstPartNumber = machine.partNumber;
          this.lstFeeder = machine.feeders;
          // machine.machineDetails.forEach(machineDetail=>{
          //   console.log("machineDetail.side :: " + machineDetail.side + " | side::" + side)
          //   if(machineDetail.side == side ){
          //     console.log(machineDetail)
          //     checkSide = true;
          //     this.machineDetail = machineDetail;
          //     return;
          //   }

          // })
        }

      })

    })

    if(!checkMachine){
      Swal.fire({
        title: 'Lỗi',
        text: 'Không tìm thấy thông tin máy.',
        allowEnterKey: false,
        icon: 'warning',
      })
      this.text = ""
      this.strFeeder = "";
      this.strMaterial = "";
      this.form.feeder = "";
      this.form.material="";
    }
  }

  checkFeeder(){
    let checkMaterial = false;
    let checkFeeder = false;
    let checkPartNumber = false;

    console.log("Check feeder :: ")
    this.lstFeeder.forEach(e =>{
      if(this.strFeeder == e.qrFeederCode ){
        console.log("feeder:: "+ this.strFeeder + " | "+  e.qrFeederCode)
        checkFeeder = true;
        return;
      }
    })

    if(!checkFeeder){
      Swal.fire({
        title: 'Lỗi',
        text: 'Không tìm thấy thông tin feeder.',
        allowEnterKey: false,
        icon: 'warning',
      })
      return;
    }


    this.lstPartNumber.forEach(e=>{
      console.log("name : " + e.name + " | " +  this.partnumber)
      if(e.name == this.partnumber){
        checkPartNumber = true;
        this.lstMaterial = [];
        this.lstMaterial = e.materials;

        this.lstMaterial.forEach(mate => {
          if(mate.materialId == this.strMaterial ){
            checkMaterial = true;
          }
        });

      }
    })
    console.log("Check parnumber and material:: " + checkMaterial +" | checkPartNumber:: "+ checkPartNumber)

    let data;
    if(!checkPartNumber || !checkMaterial){
      data = {workOrderId:this.actRoute.snapshot.params['id'] ,machine:this.strMachine, side:this.form.side,feeder:this.strFeeder,material:this.strMaterial,qr:this.strQr, status:false,date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US')};
      this.lstScanFail.push(data)
    }else{
      data ={workOrderId :this.actRoute.snapshot.params['id'],machine:this.strMachine, side:this.form.side,feeder:this.strFeeder,material:this.strMaterial,qr:this.strQr, status:true,date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US')};
     this.lstScan.push(data);
   }

   this.scan100.createUpdate(data).subscribe(
      data=>{
        if(!checkPartNumber || !checkMaterial){

          Swal.fire({
            title: 'Lỗi',
            text: 'Thông tin Partnumber/Material không hợp lệ.',
            allowEnterKey: false,
            icon: 'warning',
          })


        }else{
          Swal.fire({
            title: 'Thông báo',
            text: 'Bạn đã thực hiện thêm mới thông tin scan thành công.',
            allowEnterKey: false,
            icon: 'success',
          })
        }
      },
      error=>{
        Swal.fire({
          title: 'Lỗi',
          text: '"Có lỗi xảy ra vui lòng thử lại sau.',
          allowEnterKey: false,
          icon: 'warning',
        })
      }
    )

    this.form.feeder = "";
    this.form.material="";
    this.strFeeder = "";
    this.strMaterial ="";
    this.partnumber = ""

    // this.machineDetail?.feedersPrograming.forEach(feederDetail=>{
    //   console.log("feeder :: " +  feeder + " | feederDetail.qrFeederCode :: " + feederDetail.qrFeederCode)

    //   if(feeder ==feederDetail.qrFeederCode ){
    //     checkFeeder = true;
    //     console.log("feederDetail :: " +feederDetail)
    //     console.log("feeder :: " + feeder)
    //     console.log("dnlnvlDetailOfMaterial :: " + feederDetail.dnlnvlDetailOfMaterial);

    //     feederDetail.dnlnvlDetailOfMaterial.forEach(materialDetail=>{
    //       console.log("materialDetail: " + materialDetail.materialId + "  | material: " + material)
    //       if(material == materialDetail.materialId){
    //         checkMaterial = true;
    //       }
    //     })
    //   }
    // })


    // let data;
    // if(!checkMaterial){
    //   Swal.fire("Lỗi","Không tìm thấy thông tin material tương ứng với feeder", "error")
    //    data = {workOrderId:this.actRoute.snapshot.params['id'] ,machine:this.strMachine, side:this.form.side,feeder:this.strFeeder,material:this.strMaterial,qr:this.strQr, status:false,date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US')};
    //   this.lstScanFail.push(data);
    // }else{
    //    data ={workOrderId :this.actRoute.snapshot.params['id'],machine:this.strMachine, side:this.form.side,feeder:this.strFeeder,material:this.strMaterial,qr:this.strQr, status:true,date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US')};
    //   this.lstScan.push(data);
    // }


  }

  getProfileDetail() {
    this.nvlService.getProfileDetail(this.form.workOrderId).subscribe(
      data => {
        this.dnlnvl = data.dnlnvl ?? [];
      },
      err => {

      }
    );
  }
  open(content: any, idBom: any) {
    console.log(idBom , this.lstbom);
    this.lstScanView = [];
    this.lstbom.forEach(element => {
      if (element.id == idBom) {
          this.lstScanView= element.lstScanNVL;

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

}
