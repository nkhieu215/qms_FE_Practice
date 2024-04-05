import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TinCheckSerialService {
  path: string;

  constructor(private http: HttpClient) {
    this.path =  environment.api_end_point + '/pqc-tin-check';
  }

  createUpdateCheckSerial(
    id: any,
    checkPerson: any,
    startGia: any,
    endGia: any,
    startKhuay: any,
    endKhuay: any,
    lstSerial: any,
    workOrderId: number,
    checkTime: any,
    note: any,
    operators:any

  ): Observable<any> {
    return this.http.post(
      this.path + '/check-serial-tin',
      {
        id: id,
        checkPerson: checkPerson,
        startGia: startGia,
        endGia: endGia,
        startKhuay: startKhuay,
        endKhuay: endKhuay,
        lstSerial: lstSerial,
        workOrderId: workOrderId,
        checkTime: checkTime,
        note: note,
        operators:operators
      },
      httpOptions
    );
  }

  createUpdateTinCheck(
    id: any,
    batchId: any,
    line: any,
    checkPerson: any,
    checkTime: any,
    expiryDate: any,
    quatity: any,
    errTotal: any,
    conclude: any,
    note: any,
    classify: any,
    ids: any,
    machineCode: any,
    knifeCode: any,
    gridCode: any,
    workOrderId: any,
    operators:any
  ): Observable<any> {
    return this.http.post(
      this.path + '/add-new-tin-check',
      {
        id: id,
        checkPerson: checkPerson,
        batchId: batchId,
        line: line,
        checkTime: checkTime,
        expiryDate: expiryDate,
        quatity: quatity,
        errTotal: errTotal,
        conclude: conclude,
        note: note,
        classify: classify,
        workOrderId: workOrderId,
        machineCode: machineCode,
        knifeCode: knifeCode,
        gridCode: gridCode,
        operators:operators
      },
      httpOptions
    );
  }

  getCheckSerialByWorkOrder(workorderId: any): Observable<any> {
    return this.http.get(
      this.path + '/check-serial-by-workorder/' + workorderId,
      {}
    );
  }

  removeTinCheck(id: any, type: any): Observable<any> {
    return this.http.delete(this.path + '/remove/' + id + '/' + type, {});
  }


  deleteError(id: any): Observable<any> {
    return this.http.delete<any>( environment.api_end_point + '/pqc-tin-check/remove-eror/' + id, httpOptions);
  }

  addError(data: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/pqc-tin-check/add-error', {
      data
    }, httpOptions);
  }

  getDetail(id: any): Observable<any> {
    return this.http.post<any>( environment.api_end_point + '/pqc-tin-check/detail-check/'+ id, httpOptions);
  }

}
