import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" })
};

@Injectable({
  providedIn: 'root'
})
export class PQCWOService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/pqc-wo'
  }


  /**
   * thêm mới yêu cầu kiểm tra
   * @param data
   * @returns
   */
  addNewProcuction(data: any, bomversion: any, lstUserDetail: any): Observable<any> {
    return this.http.post(this.path + "/pqc-create", {
      data: data,
      bomversion: bomversion,
      lstUserDetail: lstUserDetail
    }, httpOptions);
  }

}
