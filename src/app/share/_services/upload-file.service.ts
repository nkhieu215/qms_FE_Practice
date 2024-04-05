import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'multipart/form-data'

  }),
};

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = environment.api_end_point;
  constructor(private http: HttpClient) { }
  upload(file: File, woId:Number, drawNvlId:Number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    let path = `${this.baseUrl}/pqc-nvl/upload-image/${drawNvlId}/${woId}`;
    const req = new HttpRequest('POST', path, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(checkNvlId:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pqc-nvl/img/${checkNvlId}`, {});
  }
}
