import { formatDate } from '@angular/common';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from 'src/app/share/response/pqcResponse/profile';
import { PQCWorkOrder } from 'src/app/share/response/pqcResponse/pqcWorkOrder';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ViewChild, OnInit, HostListener, ElementRef, Input, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Bom } from 'src/app/share/response/pqcResponse/bom';
import { NVLScan } from 'src/app/share/response/pqcResponse/nvlScan';
import { PartNumberDetail } from 'src/app/share/response/pqcResponse/partnumber_detail';
import { Dnlnvl, MachineDetail } from 'src/app/share/_models/dnl_scan_nvl_100.modal';
import { PQCNVlService } from 'src/app/share/_services/pqc_nvl.service';
import { PQCScan100Service } from 'src/app/share/_services/pqcScan100.service';
import { HttpClient } from '@angular/common/http';
import { ShowComponent } from '../show/show.component';
import { async } from 'rxjs/internal/scheduler/async';
@Component({
  selector: 'app-nvl100-production',
  templateUrl: './nvl100-production.component.html',
  styleUrls: ['./nvl100-production.component.css'],
  styles: [`
    .greenClass{
      background-color:#0AE40A;width: 75px;
      border-radius: 10px;
      margin: auto;
      color:#ffffff;
      border:#0AE40A;
      text-align:center;
    }
    .redClass{
      background-color:#FF0000;width: 100px;
      border-radius: 10px;
      margin: auto;
      color:#ffffff;
      border:#FF0000;
      text-align:center;
    }
    `]
})
export class Nvl100ProductionComponent implements OnInit {
  // bản test
  address = 'http://localhost:8449';
  // hệ thống
  //address = 'http://192.168.68.92/qms';
  //Điều kiện triển khai hiện tại
  page?: number;
  page1?: number;
  itemsPerPage = 10;
  lstPartNumberAvailable: any[] = [];
  lstPartNumberAvailableOrigin: any[] = [];
  lstMaterialScan: any[] = [];
  lstMaterialScanOrigin: any[] = [];
  totalScaned = 0;
  totalNotScan = 0;
  partNumberSearchKey = '';
  materialSearchKey = '';
  statusSearchKey = '';
  condition = false;
  path = 'api/testing-critical';
  stopMachine = false;
  changed = false;
  showSearchInput = true;
  alertMessage = '';
  lstPartNumbers: any[] = [];
  @ViewChild('template') templateRef: any;
  @ViewChild('confirm') templateRefs: any;
  @Input() show_check = '';
  @Input() feederSearchKey = '';
  @Input() subFeederSearchKey = '';
  @Input() machineSearchKey = '';
  idWorkOrder?: string;
  show_work_order = true;
  lstMachine: any[] = [];
  lstFeederHistory: any[] = [];
  lstMachineOrigin: any[] = [];
  lstSubFeeder: any[] = [];
  lstSubFeederOrigin: any[] = [];
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
  lstScan: any[] = [];
  lstScanFail: any[] = [];

  lstbomData: Bom[] = [];
  lstScanView: NVLScan[] = [];
  profile: Profile = new Profile;
  lstPartNumberByProfileDetail: PartNumberDetail[] = [];
  form: any = {};
  strMachine?: string = '';
  strSide?: string = '';
  strFeeder?: string = '';
  strMaterial?: string = '';
  strSerial?: string = '';
  lstPartNumber: any[] = [];
  lstMaterial: any[] = [];
  lstFeeder: any[] = [];

  strQr?: string = '';
  dnlnvl?: Dnlnvl[] = []

  machineDetail?: MachineDetail;

  // @HostListener('document:keydown', ['$event'])
  // clickout(event: any) {
  //   if (event.code == 'Enter') {
  //     this.text = this.replaceAll(this.text, 'Shift', '');
  //     this.text = this.replaceAll(this.text, 'Backspace', '');
  //     this.text = this.replaceAll(this.text,'CapsLock','');
  //     this.text = this.replaceAll(this.text,'Control','')
  //     this.text = this.replaceAll(this.text,'Alt','')

  //     console.log(this.text);

  //     if(!this.strMachine){
  //       this.strMachine = this.text;
  //       this.form.machineCode = this.strMachine;
  //       this.text = "";
  //       // check machine
  //       return;
  //     }

  //     let side = this.form.side ?? '';
  //     // if(!side){
  //     //   Swal.fire({
  //     //     title: 'Lỗi',
  //     //     text: 'Bạn chưa thực hiện chọn thông tin mặt máy. Vui lòng lựa chọn mặt máy và scan lại.',
  //     //     allowEnterKey: false,
  //     //     icon: 'warning',
  //     //   })

  //     //   this.text = "";
  //     //   return;
  //     // }

  //     // get machine detail
  //     this.checkMachine();

  //     if(!this.strFeeder){
  //       this.strFeeder = this.text;
  //       this.form.feeder = this.strFeeder;
  //       this.text = "";
  //       return;
  //     }

  //     if(!this.strMaterial ){
  //       this.strMaterial = this.text;
  //       this.strQr = this.text;
  //       let materialArr =  this.strMaterial.split("#");
  //       this.strMaterial = materialArr[0];
  //       this.partnumber = materialArr[1];
  //       this.form.material = this.strMaterial;
  //       this.text = "";
  //     }

  //     this.checkFeeder();

  //   }
  //   if (event.code != 'Shift' && event.code != 'Enter') {
  //     this.text += event.key;
  //   }
  // }
  checkScan() {
    // if (event.code == 'Enter') {
    // this.text = this.replaceAll(this.text, 'Shift', '');
    // this.text = this.replaceAll(this.text, 'Backspace', '');
    // this.text = this.replaceAll(this.text, 'CapsLock', '');
    // this.text = this.replaceAll(this.text, 'Control', '')
    // this.text = this.replaceAll(this.text, 'Alt', '')

    // console.log(this.text);

    if (!this.strMachine) {
      var result = this.lstScanFail.find(x => x.confirm == false || x.confirm == 'false');
      if (result && this.condition == true) {
        this.openAlert('Xác nhận hoạt động xử lý lỗi scan');
        this.strMachine = this.form.machineCode = undefined;
        return;
      } else {
        this.strMachine = this.form.machineCode;
        const input = document.getElementById('feeder-code');
        if (input) {
          input.focus();
          // console.log('focus')
        }
      }
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

    if (!this.strFeeder) {
      var result = this.lstScanFail.find(x => x.confirm == false || x.confirm == 'false');
      if (result && this.condition == true) {
        this.openAlert('Xác nhận hoạt động xử lý lỗi scan');
        this.strFeeder = this.form.feeder = undefined;
        return;
      } else {
        this.strFeeder = this.form.feeder;
        // this.form.feeder = this.strFeeder;
        // this.text = "";
        const input = document.getElementById('material-code');
        if (input) {
          input.focus();
          // console.log('focus')
        }
      }
      return;
    }

    if (!this.strMaterial) {
      var result = this.lstScanFail.find(x => x.confirm == false || x.confirm == 'false');
      if (result && this.condition == true) {
        this.openAlert('Xác nhận hoạt động xử lý lỗi scan');
        this.strMaterial = this.form.material = undefined;
        return;
      } else {
        // this.strMaterial = this.text;
        this.strQr = this.form.material;
        let materialArr = this.form.material.split("#");
        this.strMaterial = materialArr[0];
        this.partnumber = materialArr[1];
        this.form.material = this.strMaterial;
        // this.text = "";
      }
    }

    this.checkFeeder();

    // }
    // if (event.code != 'Shift' && event.code != 'Enter') {
    //   this.text += event.key;
    // }
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }


  constructor(
    private actRoute: ActivatedRoute,
    private pqcService: PQCService,
    private nvlService: PQCNVlService,
    private scan100: PQCScan100Service,
    private modalService: NgbModal,
    protected http: HttpClient) { }

  closeResult: string = '';
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  modalOption: NgbModalOptions = {
    size: '100px',
  };
  lstScanDto: any[] = []

  ngOnInit(): void {
    if (this.show_check == 'SHOW') {
      this.show_work_order = false;
    }
    setTimeout(() => {
      // console.log('hello')
      const input = document.getElementById('machine-code');
      if (input) {
        input.focus();
        // console.log('focus')
      }
    }, 100);
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
        console.log('hello', data);
        this.lstScanDto = data.pqcWorkOrder.lstPqcScan100;
        if (this.lstScanDto && this.lstScanDto.length > 0) {
          this.lstScanDto.forEach(element => {
            let data = {
              id: element.id,
              workOrderId: element.workOrderId,
              machine: element.machine,
              side: element.side,
              feeder: element.feeder,
              material: element.material,
              pathNumber: element.qr.split("#")[1],
              qr: element.qr,
              date: element.date,
              reason: element.reason,
              confirm: element.confirm,
              timeConfirmed: element.timeConfirmed,
              createdAt: element.createdAt,
              updatedAt: element.updatedAt,
              status: element.status,
            };

            if (element.status == 1) {
              this.lstScan.push(data);
            } else {
              this.lstScanFail = [data, ... this.lstScanFail];
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
  checkMachine() {
    let machineCode = this.strMachine;
    let checkMachine = false;
    let checkSide = false;
    let side = this.form.side;
    this.lstPartNumber = [];
    this.lstFeeder = [];

    // tìm máy trong nhóm
    this.dnlnvl?.forEach(element => {
      element.machine.forEach(machine => {
        // console.log("1 machineName :: " + machine.machineName + " | machineCode::" + machineCode)
        if (machine.machineName == machineCode) {
          // console.log("2 machineName :: " + machine.machineName + " | machineCode::" + machineCode)
          checkMachine = true;
          this.lstPartNumber = machine.partNumber;
          this.lstFeeder = machine.feeders;
          setTimeout(() => {
            this.lstFeeder.forEach(x => {
              this.lstMachineOrigin.forEach(y => {
                if (x.qrFeederCode === y.qrFeederCode) {
                  x.qrFeederCode = y.replaceQrFeeder;
                }
              })
            })
            console.log("lst partNumber: ", this.lstPartNumber)
          }, 100);
        }

      })

    })

    if (!checkMachine) {
      let data = { workOrderId: this.actRoute.snapshot.params['id'], machine: this.strMachine, side: this.form.side, feeder: this.form.feeder, material: this.strMaterial, pathNumber: this.strQr!.split("#")[1], qr: this.strQr, status: false, date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US'), reason: 'Lỗi máy', confirm: false, timeConfirmed: null };
      // var resultScan = this.lstScanFail.find(x => x.machine === data.machine && x.feeder === data.feeder && x.material === data.material);
      // if (resultScan === undefined) {
      this.lstScanFail = [data, ... this.lstScanFail]
      this.scan100.createUpdate(data).subscribe(
        data => {
          console.log('hello', data)
          this.lstScanFail[0].id = data.id;
          this.lstScanFail[0].createdAt = data.createdAt;
          this.lstScanFail[0].updatedAt = data.updatedAt;
        },
        error => {
          Swal.fire({
            title: 'Lỗi',
            text: '"Có lỗi xảy ra vui lòng thử lại sau.',
            allowEnterKey: false,
            icon: 'warning',
          })
        })
      setTimeout(() => {
        this.text = ""
        this.strFeeder = "";
        this.strMachine = undefined;
        this.strMaterial = "";
        this.form.feeder = "";
        this.form.material = "";
        this.form.machineCode = "";
        this.openAlert("Thông tin máy không hợp lệ")
        if (this.condition == true) {// set cho line 12
          this.sendMessage(false);
        }
        setTimeout(() => {
          if (this.condition == true) {// set cho line 12
            this.open(this.templateRefs, '');
          }
          const input = document.getElementById('machine-code');
          if (input) {
            input.focus();
            // console.log('focus')
          }
        }, 3500);
      }, 100);
    }

  }
  updateConfirm(index: any) {
    this.lstScanFail[index].timeConfirmed = formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US');
    this.scan100.createUpdate(this.lstScanFail[index]).subscribe(
      data => {
        if (this.lstScanFail[index].reason == 'Lỗi máy') {
          this.http.post<any>(`${this.address}/scan-100/send-message`, { workOrder: sessionStorage.getItem('workOrder'), machine: null, status: true }).subscribe((res: any) => {
            console.log("check mss: ", res);
          })
        } else {
          this.http.post<any>(`${this.address}/scan-100/send-message`, { workOrder: sessionStorage.getItem('workOrder'), machine: this.lstScanFail[index].machine, status: true }).subscribe((res: any) => {
            console.log("check mss: ", res);
          })
        }
        Swal.fire({
          title: 'Thành công',
          text: 'Xử lý lỗi thành công',
          allowEnterKey: false,
          icon: 'success',
          timer: 2000
        })
      },
      error => {
        Swal.fire({
          title: 'Lỗi',
          text: '"Có lỗi xảy ra vui lòng thử lại sau.',
          allowEnterKey: false,
          icon: 'warning',
        })
      })
  }
  sendMessage(mss: any) {
    if (mss === false) {
      this.http.post<any>(`${this.address}/scan-100/send-message`, { workOrder: sessionStorage.getItem('workOrder'), machine: this.strMachine, status: mss }).subscribe((res: any) => {
        console.log("check mss: ", res);
      })
    } else {
      Swal.fire({
        title: "Nhập thông tin máy",
        input: "text",
        inputLabel: "Máy",
        inputValue: this.strMachine,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Vui lòng nhập máy cần chạy!";
          } else {
            this.strMachine = value;
            this.http.post<any>(`${this.address}/scan-100/send-message`, { workOrder: sessionStorage.getItem('workOrder'), machine: this.strMachine, status: mss }).subscribe((res: any) => {
              console.log("check mss: ", res);
            })
            return ""
          }
        }
      });
    }
  }
  checkFeeder() {
    let checkMaterial = false;
    let checkFeeder = false;
    let checkPartNumber = false;
    let resetFocus = false;
    this.lstFeeder.forEach(e => {
      if (this.strFeeder == e.qrFeederCode) {
        console.log("Check feeder:: ", this.lstFeeder);
        this.dnlnvl![0].partNumber.forEach((x: any) => {
          if (x.name == this.partnumber) {
            console.log("Check PARTNUMBER:: ", this.partnumber, x.name);
            var result = x.lstFeeder.find((z: any) => z == this.strFeeder);
            var result2 = x.lstMachine.find((z: any) => z == this.form.machineCode);
            if (result == undefined) {
              console.log("Check feeder feeder :: ", result);
            } else {
              checkFeeder = true;
            }
          }
        })
      }
    })

    if (!checkFeeder) {
      let data = { workOrderId: this.actRoute.snapshot.params['id'], machine: this.strMachine, side: this.form.side, feeder: this.form.feeder, material: this.strMaterial, pathNumber: this.strQr!.split("#")[1], qr: this.strQr, status: false, date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US'), reason: 'Lỗi feeder', confirm: false, timeConfirmed: null };
      // var resultScan = this.lstScanFail.find(x => x.machine === data.machine && x.feeder === data.feeder && x.material === data.material);
      // if (resultScan === undefined) {
      this.lstScanFail = [data, ... this.lstScanFail]
      this.scan100.createUpdate(data).subscribe(
        data => {
          this.lstScanFail[0].id = data.id;
          this.lstScanFail[0].createdAt = data.createdAt;
          this.lstScanFail[0].updatedAt = data.updatedAt;
        },
        error => {
          Swal.fire({
            title: 'Lỗi',
            text: '"Có lỗi xảy ra vui lòng thử lại sau.',
            allowEnterKey: false,
            icon: 'warning',
          })
        })
      // Swal.fire({
      //   title: 'Lỗi',
      //   text: 'Không tìm thấy thông tin feeder.',
      //   allowEnterKey: false,
      //   icon: 'warning',
      // })
      setTimeout(() => {
        console.log("feeder:: " + this.strFeeder)
        this.form.feeder = "";
        this.strFeeder = undefined;
        this.strMaterial = undefined;
        this.form.material = undefined;
        this.partnumber = "";
        this.openAlert("Thông tin Feeder không hợp lệ");
        if (this.condition == true) { // set cho line 12
          this.sendMessage(false);
        }
        setTimeout(() => {
          if (this.condition == true) {// set cho line 12
            this.open(this.templateRefs, '');
          }
          const input = document.getElementById('feeder-code');
          if (input) {
            input.focus();
            // console.log('focus')
          }
        }, 3500);
      }, 100);
      return;
    }

    this.dnlnvl![0].partNumber.forEach((p: any) => {
      if (this.partnumber === p.name) {
        console.log("lst machine: ", p.lstMachine)
        this.lstPartNumber = [];
        p.lstMachine.forEach((z: string) => {
          this.dnlnvl![0].machine.forEach(x => {
            if (z === x.machineName) {
              x.partNumber.forEach(j => {
                this.lstPartNumber.push(j);
              })
            }
          })
        })
      }
    })
    setTimeout(() => {
      console.log("lst partNumber 2: ", this.lstPartNumber)
      this.lstPartNumber.forEach(e => {
        console.log("name : " + e.name + " | " + this.partnumber)
        if (e.name == this.partnumber) {
          this.dnlnvl![0].partNumber.forEach((p: any) => {
            console.log("2 name : " + e.name + " | " + this.partnumber)
            if (p.name == this.partnumber) {
              console.log("3 name : ")
              p.lstMachine.forEach((k: any) => {
                console.log("4 name : ", this.strMachine, k)
                if (k === this.strMachine) {
                  console.log("5 name : ")
                  console.log("check part : " + p.name + " | " + this.partnumber)
                  var result = p.lstFeeder.find((z: any) => z == this.strFeeder);
                  if (result == undefined) {
                  } else {
                    console.log("Check feeder :: ", checkFeeder)
                    // this.lstMachineOrigin.forEach(z => {
                    // z.partNumber.forEach((itemPartNumber: any) => {
                    //   console.log("6 name : " + itemPartNumber + " | " + this.partnumber + " | " + z.replaceQrFeeder + " | " + this.strFeeder)
                    //   if (itemPartNumber === this.partnumber) {// sai logic
                    console.log("check : ", checkPartNumber)
                    checkPartNumber = true;
                    this.lstMaterial = [];
                    this.lstMaterial = e.materials;
                    this.lstMaterial.forEach(mate => {
                      if (mate.materialId == this.strMaterial) {
                        checkMaterial = true;
                      }
                    });
                    // }
                    // })
                    // })
                  }
                }
              })
            }
          })
        }
      })
      console.log("Check parnumber and material:: " + checkMaterial + " | checkPartNumber:: " + checkPartNumber)

      let data: any;
      if (!checkPartNumber || !checkMaterial) {
        data = { workOrderId: this.actRoute.snapshot.params['id'], machine: this.strMachine, side: this.form.side, feeder: this.strFeeder, material: this.strMaterial, pathNumber: this.strQr!.split("#")[1], qr: this.strQr, status: false, date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US'), reason: 'Lỗi part number/ material', confirm: false, timeConfirmed: null };
        // var resultScan = this.lstScanFail.find(x => x.machine === data.machine && x.feeder === data.feeder && x.material === data.material);
        // if (resultScan === undefined) {
        this.lstScanFail = [data, ... this.lstScanFail]
        this.scan100.createUpdate(data).subscribe(
          data => {
            this.lstScanFail[0].id = data.id;
            this.lstScanFail[0].createdAt = data.createdAt;
            this.lstScanFail[0].updatedAt = data.updatedAt;
          },
          error => {
            Swal.fire({
              title: 'Lỗi',
              text: '"Có lỗi xảy ra vui lòng thử lại sau.',
              allowEnterKey: false,
              icon: 'warning',
            })
          })
        // }
      } else {
        data = { workOrderId: this.actRoute.snapshot.params['id'], machine: this.strMachine, side: this.form.side, feeder: this.strFeeder, material: this.strMaterial, pathNumber: this.strQr!.split("#")[1], qr: this.strQr, status: true, date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US'), reason: 'Thành công', confirm: false, timeConfirmed: null };
        var resultScan = this.lstScan.find(x => (x.material === data.material));
        if (resultScan === undefined) {
          this.lstScan.push(data);
          this.scan100.createUpdate(data).subscribe(
            data => {
            },
            error => {
              Swal.fire({
                title: 'Lỗi',
                text: '"Có lỗi xảy ra vui lòng thử lại sau.',
                allowEnterKey: false,
                icon: 'warning',
              })
            })
        }
      }
      console.log('checkPartNumber ::' + checkPartNumber + ' checkMaterial ::' + checkMaterial)
      if (!checkPartNumber) {
        this.openAlert("PartNumber không hợp lệ");
        if (this.condition == true) { //set cho line 12
          this.sendMessage(false);
        }
        this.strFeeder = undefined;
        this.form.feeder = undefined;
        this.strMaterial = undefined;
        this.form.material = undefined;
        this.partnumber = "";
        setTimeout(() => {
          if (this.condition == true) {// set cho line 12
            this.open(this.templateRefs, '');
          }
          const input = document.getElementById('feeder-code');
          if (input) {
            input.focus();
            // console.log('focus')
          }
        }, 3500);
        return;
      } else if (checkPartNumber && !checkMaterial) {

        // Swal.fire({
        //   title: 'Lỗi',
        //   text: 'Thông tin Partnumber/Material không hợp lệ.',
        //   allowEnterKey: false,
        //   icon: 'warning',
        // })
        this.openAlert("Nvl không thuộc danh sách sx");
        if (this.condition == true) { //set cho line 12
          this.sendMessage(false);
        }
        this.strFeeder = undefined;
        this.form.feeder = undefined;
        this.strMaterial = undefined;
        this.form.material = undefined;
        this.partnumber = "";
        setTimeout(() => {
          if (this.condition == true) {// set cho line 12
            this.open(this.templateRefs, '');
          }
          const input = document.getElementById('feeder-code');
          if (input) {
            input.focus();
            // console.log('focus')
          }
        }, 3500);
        return;
      } else if (checkPartNumber && checkMaterial) {
        Swal.fire({
          title: 'Thông báo',
          text: 'Bạn đã thực hiện thêm mới thông tin scan thành công.',
          allowEnterKey: false,
          icon: 'success',
          timer: 1000
        })
        resetFocus = true;
      }
      this.strFeeder = undefined;
      this.form.feeder = undefined;
      this.strMaterial = undefined;
      this.form.material = undefined;
      this.partnumber = "";
      setTimeout(() => {
        if (resetFocus === true) {
          const input = document.getElementById('feeder-code');
          if (input) {
            input.focus();
            // console.log('focus')
          }
        }
      }, 1500);
    }, 100);

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
    //   this.lstScanFail = [data,... this.lstScanFail];
    // }else{
    //    data ={workOrderId :this.actRoute.snapshot.params['id'],machine:this.strMachine, side:this.form.side,feeder:this.strFeeder,material:this.strMaterial,qr:this.strQr, status:true,date: formatDate(new Date(), 'dd/MM/YYYY HH:mm', 'en_US')};
    //   this.lstScan.push(data);
    // }


  }
  resetMachine() {
    this.strMachine = undefined;
    this.form.machineCode = undefined;
    this.strFeeder = undefined;
    this.form.feeder = undefined;
    this.strMaterial = undefined;
    this.form.material = undefined;
    this.partnumber = "";
    setTimeout(() => {
      const input = document.getElementById('machine-code');
      if (input) {
        input.focus();
        // console.log('focus')
      }
    }, 500);
  }
  getProfileDetail() {
    this.nvlService.getProfileDetail(this.form.workOrderId).subscribe(
      data => {
        this.dnlnvl = data.dnlnvl ?? [];
        console.log("thong tin machine:", this.form.workOrderId, data.dnlnvl)
        setTimeout(() => {// set cho line 12
          this.dnlnvl![0].machine.forEach(x => {
            if (x.machineName == 'MOUN-ETON-12' || x.machineName == 'MOUN-ETON-13' || x.machineName == 'MOUN-ETON-14') {
              this.condition = true;
            }
            x.partNumber.forEach((itemPartNumber: any) => {
              var result = this.dnlnvl![0].partNumber.find((x: any) => x.name == itemPartNumber.name);
              if (!result) {
                const data = { partNumberCode: itemPartNumber.partNumberCode, name: itemPartNumber.name, lstMachine: [], subPart: [] };
                this.dnlnvl![0].partNumber.push(data as any);
              }
            })
          })
          this.dnlnvl![0].partNumber.forEach((itemPart: any) => {
            itemPart.lstMachine = []
            if (itemPart.subPart[0] != null) {
              itemPart.subPart.forEach((y: any) => {
                const data = { partNumberCode: y.partNumberCode, name: y.name, lstMachine: [], subPart: [] };
                this.dnlnvl![0].partNumber.push(data as any);
              })
            }
          })
          this.getFeederHistoryInfo(this.dnlnvl);
          this.updateListPathNumber(this.dnlnvl);
        }, 300);
      },
      err => {

      }
    );
  }
  searchByQrFeeder(machineCode: any, qrFeederCode: any) {
    this.machineSearchKey = machineCode;
    this.feederSearchKey = qrFeederCode;
    this.lstMachineSearch();
  }
  lstMachineSearch() {
    if (this.machineSearchKey === '' && this.feederSearchKey !== '') {
      Swal.fire({
        title: 'Lỗi',
        text: 'Vui lòng scan mã máy',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý',
        timer: 2000
      })
      this.feederSearchKey = ''
    } else {
      let lstRemove: any[] = [];
      this.lstMachine = this.lstMachineOrigin.filter((item: any) => item.replaceQrFeeder.includes(this.feederSearchKey) && item.machineName.includes(this.machineSearchKey));
      this.http.post<any>(`${this.address}/${this.path}/check-100/feeder-history/search`, { machineCode: this.machineSearchKey, mainQrFeeder: this.feederSearchKey }).subscribe(res1 => {
        if (this.changed === false) {
          this.lstFeederHistory = res1;
        }
        if (this.machineSearchKey !== '' && this.feederSearchKey !== '') {
          this.http.get<any>(`${this.address}/${this.path}/check-100/sub-feeder/${this.lstMachine[0].feederGroupId as number}`).subscribe((res: any[]) => {
            res.forEach((item: any) => {
              var result = this.lstMachineOrigin.find(x => x.qrFeederCode === item.qrFeederCode && x.machineName === this.machineSearchKey);
              if (result) {
                if (result.status === 'Deactivate') {
                  res[res.findIndex(x => x.qrFeederCode === result.replaceQrFeeder)].timeUpdate = result.timeUpdate;
                  res[res.findIndex(x => x.qrFeederCode === result.replaceQrFeeder)].checkType = true;
                  // if (result.replaceQrFeeder !== this.lstMachine[0].replaceQrFeeder) {
                  //   lstRemove.push(result.replaceQrFeeder)
                  // }
                }
                if (result.replaceQrFeeder !== this.lstMachine[0].replaceQrFeeder) {
                  lstRemove.push(result.replaceQrFeeder)
                }
                if (this.lstMachine[0].status === 'Active') {
                  this.showSearchInput = true;
                } else {
                  this.showSearchInput = false;
                }
              }
            })
            console.log('lst sub feeder:', lstRemove);
            this.lstSubFeederOrigin = res;
            setTimeout(() => {
              lstRemove.forEach(x => {
                this.lstSubFeederOrigin = this.lstSubFeederOrigin.filter(y => y.qrFeederCode != x)
              })
              this.lstSubFeeder = this.lstSubFeederOrigin.filter(x => x.checkType === true);
              // console.log('lst sub feeder:',this.lstSubFeeder.length);
            }, 100);
          })
        } else if ((this.machineSearchKey === '' && this.feederSearchKey === '') || (this.machineSearchKey !== '' && this.feederSearchKey === '')) {
          this.lstSubFeeder = [];
        }
      })
    }
  }
  checkBox(index: any) {
    Swal.fire({
      title: '',
      text: "Xác nhận sửa đổi",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý'
    }).then((result) => {
      if (result.isConfirmed) {
        this.changed = true;
        const today = new Date;
        const indexA = this.lstSubFeederOrigin.findIndex(x => x.qrFeederCode === this.lstSubFeeder[index].qrFeederCode);
        const indexB = this.lstMachineOrigin.findIndex(x => x.machineName === this.machineSearchKey && x.replaceQrFeeder === this.feederSearchKey);
        if (this.lstMachine[0].status === "Deactivate") {
          console.log('lst sub feeder:', this.lstMachineOrigin[indexB]);
          this.lstSubFeederOrigin[indexA].checkType = this.lstSubFeeder[index].checkType;
          this.lstMachine[0].replaceQrFeeder = this.lstSubFeeder[index].qrFeederCode;
          this.lstMachineOrigin[indexB].replaceQrFeeder = this.lstSubFeeder[index].qrFeederCode;
          this.lstMachine[0].timeUpdate = this.lstMachineOrigin[indexB].timeUpdate = this.lstSubFeeder[index].timeUpdate = this.lstSubFeederOrigin[indexA].timeUpdate = today;
          this.lstSubFeeder[this.lstSubFeeder.findIndex(x => x.qrFeederCode === this.lstMachine[0].replaceQrFeeder)].checkType = false;
          this.lstSubFeederOrigin[this.lstSubFeederOrigin.findIndex(x => x.qrFeederCode === this.lstMachine[0].replaceQrFeeder)].checkType = false
          if (this.lstMachine[0].qrFeederCode === this.lstMachine[0].replaceQrFeeder) {
            this.lstMachine[0].status = 'Active'
          }
          setTimeout(() => {
            console.log('lst sub feeder:' + this.lstMachine[0].replaceQrFeeder + "search key: " + this.feederSearchKey);
            if (this.feederSearchKey !== this.lstMachine[0].replaceQrFeeder) {
              this.feederSearchKey = this.lstMachine[0].replaceQrFeeder;
            }
          }, 100)
        } else {
          this.lstMachine[0].status = this.lstMachineOrigin[indexB].status = 'Deactivate';
          this.lstSubFeederOrigin[indexA].checkType = this.lstSubFeeder[index].checkType;
          this.lstMachine[0].replaceQrFeeder = this.lstSubFeeder[index].qrFeederCode;
          this.lstMachineOrigin[indexB].replaceQrFeeder = this.lstSubFeeder[index].qrFeederCode;
          this.lstMachine[0].timeUpdate = this.lstMachineOrigin[indexB].timeUpdate = this.lstSubFeeder[index].timeUpdate = this.lstSubFeederOrigin[indexA].timeUpdate = today;
          setTimeout(() => {
            console.log('lst sub feeder:' + this.lstMachine[0].replaceQrFeeder + "search key: " + this.feederSearchKey);
            if (this.feederSearchKey !== this.lstMachine[0].replaceQrFeeder) {
              this.feederSearchKey = this.lstMachine[0].replaceQrFeeder;
            }
          }, 100)
        }
        this.lstSubFeeder = this.lstSubFeeder.filter(x => x.checkType === true);
        if (this.lstSubFeeder.length === 0) {
          //this.lstMachine[0].status = 'Active';
          this.lstMachine[0].timeUpdate = null;
          this.lstMachine[0].replaceQrFeeder = this.lstMachine[0].qrFeederCode;
        }
        this.addNewHistoryRow(today);
      } else {
        this.lstSubFeeder[index].checkType = !this.lstSubFeeder[index].checkType;
      }
    })
  }
  addNewHistoryRow(date: any) {
    const item = {
      save: true,
      machineCode: this.machineSearchKey,
      mainQrFeeder: this.lstMachine[0].qrFeederCode,
      replaceQrFeeder: this.lstMachine[0].replaceQrFeeder,
      timeUpdate: date,
      user: 'admin'
    }
    this.lstFeederHistory = [item, ...this.lstFeederHistory];
  }
  filterBySubFeeder() {
    var result = this.lstSubFeederOrigin.find(x => x.qrFeederCode === this.subFeederSearchKey);
    if (result) {
      console.log('Deactivate:', result);
      this.lstSubFeeder = [result, ...this.lstSubFeeder];
      this.subFeederSearchKey = '';
    } else {
      Swal.fire({
        title: 'Thông báo',
        text: "Không tìm thấy feeder",
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý',
        timer: 2000
      })
      this.subFeederSearchKey = '';
    }
  }
  saveFeederHistory() {
    const body = this.lstFeederHistory.filter(x => x.save === true);
    this.http.post<any>(`${this.address}/${this.path}/check-100/feeder-history/save`, body).subscribe(() => {
      Swal.fire({
        title: 'Thành công',
        text: "Cập nhật thành công",
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Đồng ý'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      })
    })
  }
  changeStatus(index: any) {
    if (this.lstMachine[index].status === 'Active') {
      // this.lstMachine[index].status = 'Deactivate';
      this.showSearchInput = false;
      console.log('Deactivate:', this.showSearchInput);
    } else if (this.lstMachine[index].status === 'Deactivate') {
      // this.lstMachine[index].status = 'Active';
      this.showSearchInput = true;
      console.log('Active:', this.showSearchInput);
    }
  }
  open(content: any, idBom: any) {
    this.lstPartNumberAvailable = this.lstPartNumberAvailableOrigin = [];
    // console.log(idBom, this.lstbom);
    this.lstScanView = [];
    this.lstbom.forEach(element => {
      if (element.id == idBom) {
        this.lstScanView = element.lstScanNVL;

      }
    })
    this.lstScanFail.forEach(item => {
      if (item.confirm == 'false') {
        item.confirm = false;
      } else if (item.confirm == 'true') {
        item.confirm = true;
      }
    })
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;

      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.feederSearchKey = '';
        this.partNumberSearchKey = '';
      }
    );
    if (idBom === 'available') {
      // this.lstPartNumberAvailable = this.dnlnvl![0].partNumber;
      this.dnlnvl![0].partNumber.forEach(x => {
        x.lstFeeder.forEach((y: any) => {
          const data = { partNumber: x.name, feeder: y };
          this.lstPartNumberAvailableOrigin.push(data);
        })
      })
      this.lstPartNumberAvailable = this.lstPartNumberAvailableOrigin;
      console.log(this.lstPartNumberAvailable)
    }
    if (idBom === 'scan') {
      this.lstMaterialScan = this.lstMaterialScanOrigin = [];
      this.materialSearchKey = '';
      this.dnlnvl![0].machine.forEach(x => {
        x.partNumber.forEach((y: any) => {
          y.materials.forEach((z: any) => {
            var result = this.lstScan.find(item => item.material == z.materialId);
            if (result) {
              const data = { partNumber: y.name, material: z.materialId, status: 'Đã scan' };
              this.lstMaterialScanOrigin.push(data);
            } else {
              const data = { partNumber: y.name, material: z.materialId, status: 'Chưa scan' };
              this.lstMaterialScanOrigin.push(data);
            }
          })
        })
      })
      setTimeout(() => {
        this.lstMaterialScan = this.lstMaterialScanOrigin;
        this.totalNotScan = 0;
        this.totalScaned = 0;
        this.lstMaterialScanOrigin.forEach(x => {
          if (x.status == 'Đã scan') {
            this.totalScaned++;
          } else {
            this.totalNotScan++;
          }
        })
      }, 100);
      console.log(this.lstMaterialScan)
    }
  }
  searchByPartNumber() {
    this.lstPartNumberAvailable = this.lstPartNumberAvailableOrigin.filter(x => x.partNumber.includes(this.partNumberSearchKey.trim()) && x.feeder.includes(this.feederSearchKey.trim()));
  }
  searchByMaterial() {
    this.lstMaterialScan = this.lstMaterialScanOrigin.filter(x => x.partNumber.includes(this.partNumberSearchKey.trim()) && x.material.includes(this.materialSearchKey.trim()) && x.status.includes(this.statusSearchKey.trim()));
  }
  updateListPathNumber(sourceData: Dnlnvl[] | undefined) {
    sourceData!.forEach((lstMachine: any) => {
      lstMachine.machine.forEach((machineItem: any) => {
        machineItem.partNumber.forEach((itemPartNumber: any) => {
          var check = false;
          lstMachine.partNumber.forEach((dataPartNumber: any) => {
            // dataPartNumber.lstMachine = [];
            setTimeout(() => {
              if (itemPartNumber.name === dataPartNumber.name) {
                dataPartNumber.lstMachine.push(machineItem.machineName);
                check = true;
              }
            }, 50);
          })
          // setTimeout(() => {
          //   if (check === false) {
          //     const data = { partNumberCode: itemPartNumber.partNumberCode, name: itemPartNumber.name, lstMachine: [machineItem.machineName], subPart: [] };
          //     lstMachine.partNumber.push(data);
          //   }
          // }, 100);
        })
      })
      setTimeout(() => {
        lstMachine.partNumber.forEach((x: any) => {
          x.lstFeeder = [];
          this.lstMachineOrigin.forEach(y => {
            if (x.subPart.length > 0 && x.subPart[0] != null) {
              // console.log("check lst feeder : ", x)
              x.subPart.forEach((item: any) => {
                var result2 = y.partNumber.find((z: any) => z == item.name);
                if (result2) {
                  var feeder = x.lstFeeder.find((z: any) => z == y.replaceQrFeeder);
                  if (!feeder) {
                    x.lstFeeder = [y.replaceQrFeeder, ...x.lstFeeder];
                  }
                  var machine = x.lstMachine.find((z: any) => z == y.machineName);
                  if (!machine) {
                    x.lstMachine = [y.machineName, ...x.lstMachine];
                  }
                }
              });
            } else {
              var result = y.partNumber.find((z: any) => z == x.name);
              if (result) {
                x.lstFeeder = [y.replaceQrFeeder, ...x.lstFeeder];
              }
            }
          })
        })
      }, 3000);
    })
    // console.log('list partNumber: ', sourceData);
  }
  getFeederHistoryInfo(souceData: Dnlnvl[] | undefined) {
    var body: any[] = [];
    this.lstMachine = [];
    var lstSubFeeder: any[] = [];
    this.lstMachineOrigin = [];
    this.lstSubFeeder = [];
    souceData!.forEach((lstMachine: any) => {
      body.push(lstMachine.machineName);
      // lấy ds subfeeder
      lstMachine.feederGroup.forEach((itemSubFeeder: any) => {
        itemSubFeeder.feeders.forEach((qrFeeders: any) => {
          qrFeeders.qrFeeders.forEach((qrFeederCode: any) => {
            const data = { qrFeederCode: qrFeederCode.qrFeederCode, id: itemSubFeeder.id }
            lstSubFeeder.push(data);
          })
        })
      })
      // lấy ds machine
      setTimeout(() => {
        lstMachine.machine.forEach((item: any) => {
          body.push(item.machineName);
          setTimeout(() => {
            this.http.post<any>(`${this.address}/${this.path}/check-100/feeder-history`, body).subscribe(res => {
              console.log('check history:');
              this.lstFeederHistory = res;
            })
          }, 100);
          setTimeout(() => {
            item.partNumber.forEach((qrCode: any) => {
              var lstPartNumber: any[] = []
              // lstMachine.partNumber.forEach((itemPart: any) => {
              //   if (itemPart.subPart.length > 0) {
              //     itemPart.subPart.forEach((z: any) => {
              //       if (z != null && z.name === qrCode.name) {
              //         lstPartNumber = itemPart.subPart;
              //       }
              //     })
              //   }
              // })
              // console.log('check lst part number final :', lstPartNumber);
              qrCode.qrFeederDtos.forEach((feederItem: any) => {
                var result = this.lstMachine.find(x => x.qrFeederCode === feederItem.qrFeederCode && x.machineName === item.machineName);
                var group = lstSubFeeder.find(x => x.qrFeederCode === feederItem.qrFeederCode);
                if (!result) {
                  var lstPartNumberFinal = lstPartNumber.length > 0 ? lstPartNumber : [qrCode.name];
                  const exist = this.lstFeederHistory.filter(x => x.machineCode === item.machineName && x.mainQrFeeder === feederItem.qrFeederCode);
                  if (exist.length > 0) {
                    const data = { machineName: item.machineName, qrFeederCode: feederItem.qrFeederCode, qrFeederId: feederItem.qrFeederId, status: 'Deactivate', feederGroupId: group.id, timeUpdate: exist[0].timeUpdate, replaceQrFeeder: exist[0].replaceQrFeeder, partNumber: lstPartNumberFinal };
                    if (data.replaceQrFeeder === data.qrFeederCode) {
                      data.status = 'Active';
                    }
                    this.lstMachine.push(data);
                    this.lstMachineOrigin.push(data);
                  } else if (exist.length === 0) {
                    const data = { machineName: item.machineName, qrFeederCode: feederItem.qrFeederCode, qrFeederId: feederItem.qrFeederId, status: 'Active', feederGroupId: group.id, replaceQrFeeder: feederItem.qrFeederCode, partNumber: lstPartNumberFinal };
                    this.lstMachine.push(data);
                    this.lstMachineOrigin.push(data);
                  }
                } else {
                  var index = this.lstMachine.findIndex(x => x.qrFeederCode === feederItem.qrFeederCode && x.machineName === item.machineName);
                  var result = this.lstMachine[index].partNumber.find((x: any) => x === qrCode.name);
                  if (!result) {
                    this.lstMachine[index].partNumber.push(qrCode.name);
                  }
                }
              })
            })
          }, 1000);
        })
      })
      console.log('check machine', this.lstMachineOrigin)
    }, 100)
  }
  openAlert(mss: any) {
    this.alertMessage = mss;
    let audio = new Audio();
    audio.src = "../assets/img/soundEfect/beep-warning-6387.mp3";
    audio.load();
    audio.play();
    this.modalService.open(this.templateRef, this.modalOption).result.then(

      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      }
    );
    setTimeout(() => {
      this.modalService.dismissAll();
    }, 3000);
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
