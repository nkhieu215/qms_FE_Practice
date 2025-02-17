import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/share/_services/auth.service';
import { MachineService } from 'src/app/share/_services/machine.service';

@Component({
  selector: 'app-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.css'],
})
export class MachineEditComponent implements OnInit {
  form: any = {
    machineName: '',
    machineCode: '',
    description: '',
    idScada: '',
    source: '',
  };
  id: number;
  constructor(
    private machineService: MachineService,
    private route: ActivatedRoute,
    protected autoLogout: AuthService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.machineService.webData != undefined) {
      this.machineService.webData.forEach((element) => {
        if (element.id == this.id) {
          this.form.machineName = element.name;
          this.form.machineCode = element.code;
          this.form.idScada = element.idScada;
          this.form.description = element.description;
        }
      });
    }
  }
  onSubmit() {
    this.machineService
      .update(
        this.id,
        this.form.idScada,
        this.form.machineName,
        this.form.description,
        this.form.machineCode,
        'WEB'
      )
      .subscribe(
        (data) => {
          console.log(data);
          alert('Cập nhật thành công!');
        }
      )
  }
  ngOnInit(): void {
    // this.autoLogout.autoLogout(0);
  }
}
