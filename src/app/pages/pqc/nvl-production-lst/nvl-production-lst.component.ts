import { PQCService } from 'src/app/share/_services/pqc.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nvl-production-lst',
  templateUrl: './nvl-production-lst.component.html',
  styleUrls: ['./nvl-production-lst.component.css']
})
export class NvlProductionLstComponent implements OnInit {

  constructor(private pqcService: PQCService) { }

  ngOnInit(): void {

  }
}
