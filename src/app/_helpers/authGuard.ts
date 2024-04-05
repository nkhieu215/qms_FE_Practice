import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['allowedRoles'];

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    console.log();
    // Allow the user to proceed if all the required roles are present.
    let check = false;
    requiredRoles.forEach(role=>{
      if(this.roles.includes(role)){
        check = true;
        return;
      }
    })
    requiredRoles.every( (role) => this.roles.includes(role) );
    console.log("check role ::" + check + " | requiredRoles ::" + requiredRoles + " | roles :: " + this.roles);

    if (!check) {
      this.router.navigate(['/']);
      Swal.fire({
        title: 'Lỗi',
        text: 'Bạn không có quyền truy cập chức năng này, vui lòng liên hệ quản lý để được hỗ trợ.',
        icon: 'warning'
      })
    }

    return check;
  }
}
