import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StepCheck } from '../aprove-quality-evaluation/aprove-quality-evaluation.component';
import { CommonService } from 'src/app/share/_services/common.service';
import { PqcDataService } from 'src/app/share/_services/pqcDataService.service';
import { PQCService } from 'src/app/share/_services/pqc.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private commonService: CommonService, protected pqcService: PQCService) { }
  lstCheckStep?: string[] = []
  lstCheck: StepCheck[] = [];
  idWorkOrder = '';
  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    // this.pqcService.getDetailPqcWorkOrder(id).subscribe((data) => {
    //   console.log('check data pqc work order', data);
    // })
    this.commonService.statusStep(id).toPromise().then(
      data => {
        this.lstCheck = data.lstStep;
        this.lstCheck.forEach(element => {
          this.lstCheckStep?.push(element.step);
          element.checked = true;
        });
      },
      error => { }
    )
  }

}
