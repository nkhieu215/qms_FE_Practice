import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class AssemblesCheck {
  public id = null;
  public lotNumber = null;
  public line = null;
  public processName = null;
  public checkPerson = null;
  public quatity = null;
  public checkTime = null;
  public quatityPass?:number;
  public quatityFail = null;
  public ratio = null;
  public conclude = null;
  public note = null;
  public workOrderId= null;
  public operators?:string;

  public errorLists:Array<ErrorElectronicComponent> =  [];
  public ids ?:string;
  public dttdMountCompId?:string;
}
