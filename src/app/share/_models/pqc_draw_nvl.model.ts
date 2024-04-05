import { PqcDrawNvlTest } from './pqc_draw_nvl_test.model';
import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class PqcDrawNvl {
  public note = null;
  public conclude = null;
  public checkPerson?:string;
  public workOrderId = null;
  public createdAt?:any;
  public id?:string;
  public ids ?:string;

  public checkNvl:Array<PqcDrawNvlTest> =  [];
}
