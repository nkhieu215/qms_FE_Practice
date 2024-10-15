import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './../../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportProduceComponent } from './report-produce/report-produce.component';
import { ReportErrorComponent } from './report-error/report-error.component';
import { ReportPhotoelectricProductComponent } from './report-photoelectric-product/report-photoelectric-product.component';
import { ApproveStoreSapComponent } from './approve-store-sap/approve-store-sap.component';
import { AppModule } from 'src/app/app.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { PqcShowListComponent } from './pqc-show-list/pqc-show-list.component';
import { PendingProductOrderComponent } from './pending-order/pending-order.component';
import { MakeProductOrderComponent } from './make-order/make-order.component';
import { MakeOrderProductCRUDComponent } from './make-order-crud/make-order-crud.component';
import { ChecklistProductionComponent } from './checklist-production/checklist-production.component';
import { NvlProductionComponent } from './nvl-production/nvl-production.component';
import { Nvl100ProductionComponent } from './nvl100-production/nvl100-production.component';
import { ChecklistProductionLstComponent } from './checklist-production-lst/checklist-production-lst.component';
import { Nvl100ProductionLstComponent } from './nvl100-production-lst/nvl100-production-lst.component';
import { NvlProductionLstComponent } from './nvl-production-lst/nvl-production-lst.component';
import { SolderCheckComponent } from './solder-check/solder-check.component';
import { MountCompCheckComponent } from './mount-comp-check/mount-comp-check.component';
import { TinCheckComponent } from './tin-check/tin-check.component';
import { InterchangeabilityComponent } from './interchangeability/interchangeability.component';
import { AssemblesComponent } from './assembles/assembles.component';
import { PhotoelectricComponent } from './photoelectric/photoelectric.component';
import { PhotoelectricProductComponent } from './photoelectric-product/photoelectric-product.component';
import { FixErrorComponent } from './fix-error/fix-error.component';
import { StoreCheckComponent } from './store-check/store-check.component';
import { QualityEvaluationComponent } from './quality-evaluation/quality-evaluation.component';
import { AproveQualityEvaluationComponent } from './aprove-quality-evaluation/aprove-quality-evaluation.component';
import { ShowComponent } from './show/show.component';
import { WorkOrderViewComponent } from './work-order-view/work-order-view.component';
import { ShowDetailComponent } from './show-detail/show-detail.component';
import { ButtonSuccessComponent } from './button-success/button-success.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TemInComponent } from './tem-in/tem-in.component';
import { TemInLstComponent } from './tem-in-lst/tem-in-lst.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
@NgModule({
  declarations: [
    PendingProductOrderComponent,
    MakeProductOrderComponent,
    MakeOrderProductCRUDComponent,
    ChecklistProductionComponent,
    NvlProductionComponent,
    Nvl100ProductionComponent,
    ChecklistProductionLstComponent,
    Nvl100ProductionLstComponent,
    NvlProductionLstComponent,
    SolderCheckComponent,
    MountCompCheckComponent,
    TinCheckComponent,
    InterchangeabilityComponent,
    AssemblesComponent,
    PhotoelectricComponent,
    PhotoelectricProductComponent,
    FixErrorComponent,
    StoreCheckComponent,
    QualityEvaluationComponent,
    AproveQualityEvaluationComponent,
    ShowComponent,
    WorkOrderViewComponent,
    PqcShowListComponent,
    ShowDetailComponent,
    ButtonSuccessComponent,
    ReportProduceComponent,
    ReportPhotoelectricProductComponent,
    ReportErrorComponent,
    ApproveStoreSapComponent,
    TemInComponent,
    TemInLstComponent,
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
    NzFormModule,
    NzDatePickerModule,
    NgxPaginationModule,
    NzInputModule
  ],
  exports: [

  ],
  bootstrap: [

  ],
  providers: [
    PqcShowListComponent
  ],
  schemas: [

  ]
})
export class PqcModule { }
