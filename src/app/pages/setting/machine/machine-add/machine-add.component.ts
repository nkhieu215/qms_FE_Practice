import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MachineService } from 'src/app/share/_services/machine.service';


@Component({
  selector: 'app-machine-add',
  templateUrl: './machine-add.component.html',
  styleUrls: ['./machine-add.component.css'],
})
export class MachineAddComponent implements OnInit {
  form: any = {
    machineName: null,
    machineCode: null,
    idScada: null,
    description: null,
  };
  constructor(private machineService : MachineService) {}

  ngOnInit(): void {}
  onSubmit() {
    this.machineService.create(
      this.form.idScada,
      this.form.machineName,
      this.form.description,
      this.form.machineCode,
      'WEB'
      )
      .subscribe(
        (data) => {
          console.log(data);
          alert('Thêm mới máy thành công!');
        }
      )
  }
}
