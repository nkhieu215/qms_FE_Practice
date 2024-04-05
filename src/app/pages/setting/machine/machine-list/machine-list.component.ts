import { Component, OnInit } from '@angular/core';
import { Machine } from 'src/app/share/_models/scada_machine.model';
import { MachineService } from 'src/app/share/_services/machine.service';
import { MachineResponse } from 'src/app/share/response/machine/machine-response';


@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css'],
})
export class MachineListComponent implements OnInit {
  formSearch: any = {};
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  machineList : any[] = [];
  machineRes ?: MachineResponse;

  constructor(private machineService : MachineService) {
    this.refreshLine();
  }
  refreshLine() {
    const { machineName, machineCode } = this.formSearch;

    this.machineService
      .getAll(this.page, this.pageSize, machineName, machineCode)
      .subscribe((data) => {
        this.machineRes = data;
        this.machineList = data.lstMachine;
        this.machineService.webData = this.machineList;
        this.collectionSize =
          Number(this.machineRes?.total) * this.pageSize;
      });
  }




    // this.iqcService.getAll(this.page, this.pageSize, dataSearch, Constant.TYPE_ELECTRIC_COMPONENT_NVL).subscribe(
    //   data => {
    //     this.examiantionRes = data;
    //     this.auditnvl = this.examiantionRes?.lst;
    //     this.collectionSize = Number(this.examiantionRes?.total) * this.pageSize;
    //   },
    //   err => {

    //   }
    // );
  ngOnInit(): void {}
}
