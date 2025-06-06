import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/share/_services/auth.service';
import { LineService } from 'src/app/share/_services/line.service';

@Component({
  selector: 'app-production-line-add',
  templateUrl: './production-line-add.component.html',
  styleUrls: ['./production-line-add.component.css'],
})
export class ProductionLineAddComponent implements OnInit {
  form: any = {
    lineName: null,
    lineCode: null,
    idScada: null,
    description: null,
  };
  constructor(private lineService: LineService,
    protected autoLogout: AuthService) { }

  ngOnInit(): void {
    // this.autoLogout.autoLogout(0); 
  }
  onSubmit() {
    this.lineService
      .create(
        this.form.idScada,
        this.form.lineName,
        this.form.description,
        this.form.lineCode,
        'WEB'
      )
      .subscribe((data) => {
        console.log(data);
        alert('Thêm mới dây chuyền thành công!');
      });
  }
}
