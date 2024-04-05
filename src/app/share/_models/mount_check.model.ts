import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class MountCompCheck {
  public batchId = null;
  public line = null;
  public machineName = null;
  public checkPerson = null;
  public checkTime = null;

  public quatity?:number;
  public errTotal = null;
  public conclude = null;
  public note = null;

  public errorLists:Array<ErrorElectronicComponent> =  [];
  public ids ?:string;
  public dttdMountCompId?:string;
  public workOrderId?:string;
  public operators?:string;
}
