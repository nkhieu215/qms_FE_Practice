import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/share/_services/auth.service';
import { LineService } from 'src/app/share/_services/line.service';

@Component({
  selector: 'app-production-line-edit',
  templateUrl: './production-line-edit.component.html',
  styleUrls: ['./production-line-edit.component.css'],
})
export class ProductionLineEditComponent implements OnInit {
  form: any = {
    lineName: '',
    lineCode: '',
    idScada: '',
    description: '',
    source: '',
  };
  id: number;
  constructor(private lineService: LineService, private route: ActivatedRoute,
    protected autoLogout: AuthService) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.lineService.webData != undefined) {
      this.lineService.webData.forEach((element) => {
        if (element.id == this.id) {
          this.form.lineName = element.name;
          this.form.lineCode = element.code;
          this.form.idScada = element.idScada;
          this.form.description = element.description;
        }
      });
    }
  }
  onSubmit() {
    this.lineService
      .update(
        this.id,
        this.form.idScada,
        this.form.lineName,
        this.form.description,
        this.form.lineCode,
        'WEB'
      )
      .subscribe((data) => {
        alert('Cập nhật thành công!');
        // console.log(data);
      });
  }
  ngOnInit(): void {
    //  this.autoLogout.autoLogout(0); 
  }
}
