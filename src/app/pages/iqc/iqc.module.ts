import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { DataTablesModule } from 'angular-datatables';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CheckNvlComponent } from './check-nvl/check-nvl.component';
import { NgbAlertModule, NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import { CheckLkdtComponent } from './check-lkdt/check-lkdt.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TestingCriticalGroupComponent } from './testing-critical-group/testing-critical-group.component';
import { TestingCriticalComponent } from './testing-critical/testing-critical.component';
import { BarcodeGeneratorAllModule, QRCodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator'

@NgModule({
  declarations: [
    CheckNvlComponent,
    ApproveRequestComponent,
    CheckLkdtComponent,
    TestingCriticalGroupComponent,
    TestingCriticalComponent,
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgbPaginationModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatIconModule,
    DataTablesModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    NzTableModule,
    NzGridModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    NzLayoutModule,
    NzFormModule, BarcodeGeneratorAllModule, QRCodeGeneratorAllModule, DataMatrixGeneratorAllModule
  ]
})

export class IqcModule { }
