import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
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
export class PQCNVlService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/pqc-nvl'
  }


  /**
   * thêm mới yêu cầu kiểm tra
   * @param data
   * @returns
   */
  addNewProcuction(id: any, note: any, conclude: any,checkPerson:any,workOrderId:any,lstPqcDrawNvl:any): Observable<any> {
    return this.http.post(this.path + "/create", {
      id: id,
      note: note,
      conclude: conclude,
      checkPerson:checkPerson,
      workOrderId:workOrderId,
      lstPqcDrawNvl:lstPqcDrawNvl
    }, httpOptions);
  }

  getProfileDetail(id: any): Observable<any> {
    return this.http.post(this.path + "/get-profile-detail/" + id, {
    }, httpOptions);
  }

  getCheckNvlDrawTest(id: any): Observable<any> {
    return this.http.get(this.path + "/get-lst-check-by-order-id/" + id);
  }


  removeNvlCheck(id: any): Observable<any> {
    return this.http.delete(this.path + "/remove/" +   id , {});
  }

}
