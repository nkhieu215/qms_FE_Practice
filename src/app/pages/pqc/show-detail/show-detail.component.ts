import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StepCheck } from '../aprove-quality-evaluation/aprove-quality-evaluation.component';
import { CommonService } from 'src/app/share/_services/common.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute,private commonService: CommonService,) { }
  lstCheckStep ?:string[] = []
  lstCheck:StepCheck[] = [];
  idWorkOrder = '';
  ngOnInit(): void {
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    this.commonService.statusStep( id).toPromise().then(
      data=>{
        this.lstCheck = data.lstStep;
        this.lstCheck.forEach(element => {
          this.lstCheckStep?.push(element.step);
          element.checked = true;
        });
      },
      error=>{}
    )
  }

}
