
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // path: string;

  constructor(private http: HttpClient, public router: Router, private tokenService: KeycloakService) {

    // this.path =  environment.api_end_point + '/api/auth'
  }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(this.path + '/signin', {
  //     username,
  //     password
  //   }, httpOptions);
  // }

  // register(username: string, email: string, password: string): Observable<any> {
  //   return this.http.post(AUTH_API + 'signup', {
  //     username,
  //     email,
  //     password
  //   }, httpOptions);
  // }

  getToken() {

    return this.tokenService.getKeycloakInstance().token;
  }

  get isLoggedIn(): boolean {
    let authToken = this.tokenService.getKeycloakInstance().token;
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    this.tokenService.logout();
  }


  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
  autoLogout(time: number, name: string) {
    if (sessionStorage.getItem(this.tokenService.getUsername()) == null) {
      // sau 30p sẽ tự động load lại trang
      var elapsedTime = time;
      window.onfocus = function () { elapsedTime = 0 }
      window.onclick = function () { elapsedTime = 0 }

      var frequency = setInterval(() => {
        elapsedTime++;
        sessionStorage.setItem(this.tokenService.getUsername(), this.tokenService.getUsername());
        console.log("count time ", elapsedTime)
        if (elapsedTime > 1800) { // 30 mins timeout
          clearInterval(frequency)
          this.doLogout();
        }
      }, 1000)
    }
  }
  refreshToken(token: string) {

  }
}
