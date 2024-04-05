import { ErrorList } from '../_models/errorList.model';
import { AuditCriteriaNvl } from '../_models/auditCriteriaNvl.model';
import { AuditCriteria } from '../_models/auditCriteria.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class StoreCheckService {
  path: string;
  pathSap: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/store-check';
    this.pathSap = environment.api_end_point + "/sap-db"
  }

  createUpdateStoreCheck(data: any): Observable<any> {
    return this.http.post(
      this.path + '/create',
      {
        data: data,
      },
      httpOptions
    );
  }

  remove(id: any, type:any): Observable<any> {
    return this.http.post(
      this.path + '/remove',
      {
        id: id,
        type: type
      },
      httpOptions
    );
  }

  sendApproveStore(data: any): Observable<any> {
    return this.http.post(
      this.path + '/aproveStoreSap',data,httpOptions
    );
  }

  sendRequestApproveStore(data: any): Observable<any> {
    return this.http.post(
      this.path + '/send-approve-store-sap',data,httpOptions
    );
  }

  getLstCheckByStoreId(type: any, idStoreCheck: any): Observable<any> {
    return this.http.get(
      this.path + '/get-lst-check-store-id/' + idStoreCheck + '/' + type
    );
  }

  savePacking(
    packing: any,
    tray: any,
    lstSerial: any,
    storeId: any,
    workOrderId:any
  ): Observable<any> {
    return this.http.post(
      this.path + '/save-packing',
      {
        packing: packing,
        tray: tray,
        lstSerial: lstSerial,
        storeId: storeId,
        workOrderId: workOrderId
      },
      httpOptions
    );
  }

  createCheck(data: any, type: any): Observable<any> {
    let dataCheck: any = {};

    switch (type) {
      case 'ELEC':
        dataCheck.electric = data;
        break;

      case 'EXTER':
        dataCheck.lstexternalInspections = data;
        break;

      case 'SIZE':
        dataCheck.size = data;
        break;

      case 'SAFE':
        dataCheck.safe = data;
        break;

      case 'CONFUSED':
        dataCheck.confused = data;
        break;

      case 'STRUCTURE':
        dataCheck.structure = data;
        break;

      case 'ERROR':
        dataCheck.checkErr = data;
        break;
    }

    return this.http.post(
      this.path + '/save-check/' + type,
      {
        dataCheck,
      },
      httpOptions
    );
  }

  loadStoreCheckByWoId(id: any): Observable<any> {
    return this.http.get(this.path + '/get-check-store-by-wo/' + id);
  }


  getDetailStoreCheck(id: any): Observable<any> {
    return this.http.get(this.path + '/get-store-info/' + id);
  }

  getCommonSapApprove(): Observable<any> {
    return this.http.get(this.pathSap + '/get-common-approve-sap');
  }


  getColorSap(): Observable<any> {
    return this.http.get(this.pathSap + '/get-color');
  }


  searchBycode(name: string): Observable<any> {
    return this.http.post(
      this.pathSap + '/get-ocrd',
      {
        name: name
      },
      httpOptions
    );
  }
}
