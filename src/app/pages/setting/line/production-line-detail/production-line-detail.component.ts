import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineService } from 'src/app/share/_services/line.service';
@Component({
  selector: 'app-production-line-detail',
  templateUrl: './production-line-detail.component.html',
  styleUrls: ['./production-line-detail.component.css'],
})
export class ProductionLineDetailComponent implements OnInit {
  form: any = {
    lineName: '',
    lineCode: '',
    idScada: '',
    description: '',
    source: '',
  };
  constructor(private lineService: LineService, private route: ActivatedRoute) {
    if (this.lineService.webData != undefined) {
      this.lineService.webData.forEach((element) => {
        if (element.id == Number(this.route.snapshot.paramMap.get('id'))) {
          this.form.lineName = element.name;
          this.form.lineCode = element.code;
          this.form.idScada = element.idScada;
          this.form.description = element.description;
        }
      });
    }
  }

  ngOnInit(): void {}
}
