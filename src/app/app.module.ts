import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzTableModule } from 'ng-zorro-antd/table';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, NgModel } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { DataTablesModule } from 'angular-datatables';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { initializer } from './app-init';
import { AuthInterceptorService } from './_helpers/auth.interceptor';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './_helpers/timeout.interceptor';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IqcModule } from './pages/iqc/iqc.module';
import { SettingModule } from './pages/setting/setting.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { PqcModule } from './pages/pqc/pqc.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { HomePageModule } from './pages/home-page/home-page.module';
import { NgChartsModule } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { Scale } from 'chart.js';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MultiSelectModule,
    ButtonModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    IconsProviderModule,
    HttpClientModule,
    NgbPaginationModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatIconModule,
    KeycloakAngularModule,
    DataTablesModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    NgHttpLoaderModule.forRoot(),
    SweetAlert2Module.forRoot(),
    IqcModule,
    HomePageModule,
    SettingModule,
    NgApexchartsModule,
    DashboardModule,
    PqcModule,
    NzBreadCrumbModule,
    NgChartsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,

    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 30000 }],


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
