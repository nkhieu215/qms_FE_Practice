import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { DataTablesModule } from 'angular-datatables';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AqlTemplateComponent } from './aql-template/aql-template.component';
import { SettingProcessComponent } from './setting-process/setting-process.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { SettingRoutingModule } from './setting-routing.module';
import { ErrorAddComponent } from './error/error-add-update/error-add.component';
import { ErrorEditComponent } from './error/error-edit/error-edit.component';
import { ErrorListComponent } from './error/error-list/error-list.component';
import { ExaminationBrowsComponent } from './examinationTemplate/brows/brows.component';
import { ExaminationEditComponent } from './examinationTemplate/edit/edit.component';
import { ExaminationAddComponent } from './examinationTemplate/examination-add/examination-add.component';
import { MachineAddComponent } from './machine/machine-add/machine-add.component';
import { MachineDetailComponent } from './machine/machine-detail/machine-detail.component';
import { MachineEditComponent } from './machine/machine-edit/machine-edit.component';
import { MachineListComponent } from './machine/machine-list/machine-list.component';
import { ProductionLineListComponent } from './line/production-line-list/production-line-list.component';
import { ProductionLineAddComponent } from './line/production-line-add/production-line-add.component';
import { ProductionLineEditComponent } from './line/production-line-edit/production-line-edit.component';
import { ProductionLineDetailComponent } from './line/production-line-detail/production-line-detail.component';



@NgModule({
  declarations: [
    AqlTemplateComponent,
    SettingProcessComponent,
    ErrorAddComponent,
    ErrorEditComponent,
    ErrorListComponent,
    ExaminationBrowsComponent,
    ExaminationEditComponent,
    ExaminationAddComponent,
    MachineAddComponent,
    MachineDetailComponent,
    MachineEditComponent,
    MachineListComponent,

    ProductionLineListComponent,
    ProductionLineAddComponent,
    ProductionLineEditComponent,
    ProductionLineDetailComponent
  ],
  imports: [
    SettingRoutingModule,
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
    NzFormModule
  ]
})
export class SettingModule { }
