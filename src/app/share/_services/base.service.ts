import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponseBase, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  path: string;
  constructor(private http: HttpClient) {
    this.path = environment.api_end_point
  }

  async postService(data: any, url: string, host: string) {

    return  await this.http.post<any>(
        `${this.path}/${url}`,
        data,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', }),
          observe: "response"
        }
      ).toPromise().then(
        response =>{
          console.log(response);
          if (response && response?.status == 200) {
            let dataRest = response?.body;
            if (dataRest.result.responseCode != '00') {
              Swal.fire('Thông báo', `${dataRest.result.message} (${dataRest.result.responseCode})`, 'warning')
            } else {
              return dataRest;
            }
          }
          if (response && response?.status == HttpStatusCode.Forbidden) {
            Swal.fire('Thông báo', 'Bạn không có quyền truy cập dữ liệu, vui lòng liên hệ quản trị viên để được hỗ trợ.', 'warning')
          }
          else {
            Swal.fire('Lỗi', 'Có lỗi xảy ra vui lòng thử lại sau', 'error')
          }
        }
      ).catch(
        x=> {
          console.log(x.status);
          if (x && x.status == HttpStatusCode.Forbidden) {
            Swal.fire('Thông báo', 'Bạn không có quyền truy cập dữ liệu, vui lòng liên hệ quản trị viên để được hỗ trợ.', 'warning')
          }else{
            Swal.fire('Lỗi', 'Có lỗi xảy ra vui lòng thử lại sau.', 'error');
          }


          return null;
        }
      );
  }


  async getService(url: string, host: string) {

    try {
      let response = await this.http.get<any>(`${this.path}/${url}`,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', }),
          observe: "response"
        }
      ).toPromise();


      let status = response?.status;
      let dataRest = response?.body;
      if (status == 200 && dataRest) {
        if (dataRest.result.responseCode != '00') {
          Swal.fire(
            'Thông báo',
            `${dataRest.result.message} (${dataRest.result.responseCode})`,
            'warning'
          )
        }
        else {
          return dataRest;
        }
      } else {
        Swal.fire(
          'Lỗi',
          'Có lỗi xảy ra vui lòng thử lại sau',
          'error'
        )
      }
    } catch (error) {
      Swal.fire(
        'Lỗi',
        'Có lỗi xảy ra vui lòng thử lại sau',
        'error'
      )
    }
    return null;
  }


  async deleteService(url: string, host: string) {

    try {
      let response = await this.http.delete<any>(`${this.path}/${url}`,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', }),
          observe: "response"
        }
      ).toPromise();


      let status = response?.status;
      let dataRest = response?.body;
      if (status == 200 && dataRest) {
        if (dataRest.result.responseCode != '00') {
          Swal.fire('Thông báo', `${dataRest.result.message} (${dataRest.result.responseCode})`, 'warning')
        }
        else {
          return dataRest;
        }
      } else {
        Swal.fire('Lỗi', 'Có lỗi xảy ra vui lòng thử lại sau', 'error')
      }
    } catch (error) {
      Swal.fire('Lỗi', 'Có lỗi xảy ra vui lòng thử lại sau', 'error')
    }
    return null;
  }


  report(url: string, host: string): Observable<Blob> {
    const formDataForExport: FormData = new FormData();
    formDataForExport.append('export', 'ALL');
    let response = this.http.post(`${this.path}/${url}`, {}, { responseType: 'blob' });
    return response;
  }

  reportPostFile(url: string, data: any, host: string): Observable<Blob> {
    try {
      const formDataForExport: FormData = new FormData();
      formDataForExport.append('export', 'ALL');
      let response = this.http.post(`${this.path}/${url}`, data, { responseType: 'blob' });
      return response;
    } catch (error) {
      Swal.fire(
        'Lỗi',
        'Có lỗi xảy ra vui lòng thử lại sau',
        'error'
      )
    }
    return new Observable;
  }
}
