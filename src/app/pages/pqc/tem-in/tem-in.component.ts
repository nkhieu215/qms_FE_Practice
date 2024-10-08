import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/share/_services/common.service';
import { PQCService } from 'src/app/share/_services/pqc.service';
import { PQCPendingOrder } from 'src/app/share/response/pqcResponse/pqcPendingOrder';

@Component({
  selector: 'app-tem-in',
  templateUrl: './tem-in.component.html',
  styleUrls: ['./tem-in.component.css']
})
export class TemInComponent {
  @Input() show_check = '';
  @Input() item_id = '';
  idWorkOrder?: string;
  show_work_order = true;
  constructor(private pqcService: PQCService, private actRoute: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    //this.refreshPage();
    const id = this.actRoute.snapshot.params['id'];
    this.idWorkOrder = id;
    this.commonService.statusStep(id).toPromise().then(
      data => {

      },
      error => { }
    )
  }
}
