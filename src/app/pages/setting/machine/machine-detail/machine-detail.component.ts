import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MachineService } from 'src/app/share/_services/machine.service';

@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.css']
})
export class MachineDetailComponent implements OnInit {
  form: any = {
    machineName: '',
    machineCode: '',
    idScada: '',
    description: '',
    source: '',
  };
  constructor(
    private machineService: MachineService,
    private route: ActivatedRoute
  ) {
    if (this.machineService.webData != undefined) {
      this.machineService.webData.forEach((element) => {
        if (element.id == Number(this.route.snapshot.paramMap.get('id'))) {
          this.form.machineName = element.name;
          this.form.machineCode = element.code;
          this.form.idScada = element.idScada;
          this.form.description = element.description;
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
