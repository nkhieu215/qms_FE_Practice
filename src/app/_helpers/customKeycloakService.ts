import { Injectable, Injector } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class CustomKeycloakService extends KeycloakService {
  override async getToken(forceLogin = false): Promise<any> {
    try {
      await this.updateToken(10);
      return this.getKeycloakInstance().token;
    } catch (error) {
      if (forceLogin) {
        this.login();
      } else {
        throw error;
      }
    }
  }
}
