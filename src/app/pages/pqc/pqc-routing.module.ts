import { ReportPhotoelectricProductComponent } from './report-photoelectric-product/report-photoelectric-product.component';
import { ReportProduceComponent } from './report-produce/report-produce.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportErrorComponent } from './report-error/report-error.component';
import { ApproveStoreSapComponent } from './approve-store-sap/approve-store-sap.component';
import { PendingProductOrderComponent } from './pending-order/pending-order.component';
import { MakeProductOrderComponent } from './make-order/make-order.component';
import { MakeOrderProductCRUDComponent } from './make-order-crud/make-order-crud.component';
import { ChecklistProductionLstComponent } from './checklist-production-lst/checklist-production-lst.component';
import { ChecklistProductionComponent } from './checklist-production/checklist-production.component';
import { NvlProductionLstComponent } from './nvl-production-lst/nvl-production-lst.component';
import { NvlProductionComponent } from './nvl-production/nvl-production.component';
import { Nvl100ProductionLstComponent } from './nvl100-production-lst/nvl100-production-lst.component';
import { Nvl100ProductionComponent } from './nvl100-production/nvl100-production.component';
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
import { ShowDetailComponent } from './show-detail/show-detail.component';
import { AproveQualityEvaluationComponent } from './aprove-quality-evaluation/aprove-quality-evaluation.component';
import { AuthGuard } from 'src/app/_helpers/authGuard';
import { TemInLstComponent } from './tem-in-lst/tem-in-lst.component';
import { TemInComponent } from './tem-in/tem-in.component';


const routes: Routes = [

  // danh sách lenh cho sx từ planing
  {
    path: 'pending-order-production',
    component: PendingProductOrderComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['qms_admin', 'qms_pqc_pending_order_production']
    },
  },

  {
    path: 'make-order-production',
    component: MakeProductOrderComponent,
    canActivate: [AuthGuard],
    data: {
      // allowedRoles: ['qms_admin', 'qms_pqc_pending_order_production']
      allowedRoles: []
    },
  },

  {
    path: 'make-order-production-crud/:type/:id',
    component: MakeOrderProductCRUDComponent,
    canActivate: [AuthGuard],
    data: {
      // allowedRoles: ['qms_admin', 'qms_pqc_pending_order_production']
      allowedRoles: []
    },
  },

  { path: 'checklist-production', component: ChecklistProductionLstComponent }, // check list
  {
    path: 'checklist-production/:type/:id',
    component: ChecklistProductionComponent,
  }, // check list crud

  { path: 'check-nvl', component: NvlProductionLstComponent }, // check NVL
  { path: 'check-nvl/:type/:id', component: NvlProductionComponent }, // check list crud
  // { path: 'pqc/tem-in', component: TemInLstComponent },
  { path: 'check-nvl-100', component: Nvl100ProductionLstComponent }, // check NVL 100
  { path: 'check-nvl-100/:type/:id', component: Nvl100ProductionComponent }, // check list crud

  {
    path: 'pqc-solder-check',
    data: {
      breadcrumb: 'Kiểm tra lò hàn',
    },
    children: [
      {
        path: '',
        component: SolderCheckComponent,
      },
      {
        path: ':type/:id',
        component: SolderCheckComponent,
        data: {
          breadcrumb: 'Thực hiện kiểm tra'
        }
      },
    ]
  }, // kiem tra lo han
  // { path: 'pqc-solder-check/:type/:id', component: SolderCheckComponent }, //  kiem tra lo han


  {
    path: 'mount-comp-check', component: MountCompCheckComponent,
    data: {
      breadcrumb: 'Gắn linh kiện'
    }
  }, // gan linh kien
  { path: 'mount-comp-check/:type/:id', component: MountCompCheckComponent }, // gan linh kien

  { path: 'pqc-tin-check', component: TinCheckComponent }, // in kiem thiec
  { path: 'pqc-tin-check/:type/:id', component: TinCheckComponent }, // in kiem thiec
  {
    path: 'pqc-interchangeability-check',
    component: InterchangeabilityComponent,
  }, // kiem tra lap lan
  {
    path: 'pqc-interchangeability-check/:type/:id',
    component: InterchangeabilityComponent,
  }, // kiem tra lap lan

  { path: 'pqc-assembles-check', component: AssemblesComponent }, // kiem tra lap rap hoan chinh
  { path: 'pqc-assembles-check/:type/:id', component: AssemblesComponent }, // kiem tra lap rap hoan chinh

  { path: 'photoelectric', component: PhotoelectricComponent }, // kiem tra thong so  quang
  { path: 'photoelectric/:type/:id', component: PhotoelectricComponent }, // kiem tra thong so  quang

  { path: 'photoelectric-product', component: PhotoelectricProductComponent }, //kiem tra thong so  quang sp
  {
    path: 'photoelectric-product/:type/:id',
    component: PhotoelectricProductComponent,
  }, // kiem tra thong so  quang sp

  { path: 'fix-error', component: FixErrorComponent }, //kiem tra sua loi
  { path: 'fix-error/:type/:id', component: FixErrorComponent }, // kiem tra sua loi

  { path: 'pqc-store-check', component: StoreCheckComponent }, //kiem tra nhap kho
  { path: 'pqc-store-check/:type/:id', component: StoreCheckComponent }, // kiem tra nhap kho

  { path: 'pqc-qc-check', component: QualityEvaluationComponent }, //kiem tra danh gia clsp
  { path: 'pqc-qc-check/:type/:id', component: QualityEvaluationComponent }, //kiem tra danh gia clsp

  { path: 'pqc-approve-store', component: QualityEvaluationComponent }, //PHE DUYET NHAP KHO
  {
    path: 'pqc-approve-store/:type/:id',
    component: QualityEvaluationComponent,
  }, //PHE DUYET NHAP KHO

  { path: 'pqc-show-detail/:id', component: ShowDetailComponent }, //PHE DUYET NHAP KHO
  { path: 'pqc-show-detail/:type/:id', component: ShowDetailComponent }, //PHE DUYET NHAP KHO

  { path: 'approve', component: AproveQualityEvaluationComponent }, //PHE DUYET
  { path: 'approve/:type/:id', component: AproveQualityEvaluationComponent }, //PHE DUYET



  { path: 'store/approve-store-sap', component: ApproveStoreSapComponent, },
  { path: 'store/approve-store-sap/:type/:id/:approveId', component: ApproveStoreSapComponent, },
  { path: 'store/approve-store-sap/:type/:id', component: ApproveStoreSapComponent, },
  { path: 'report/produce', component: ReportProduceComponent, },
  { path: 'report/error', component: ReportErrorComponent },
  { path: 'report/photoelectric-product', component: ReportPhotoelectricProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PqcRoutingModule { }
