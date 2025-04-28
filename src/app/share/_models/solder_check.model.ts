import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class SolderCompCheck {
  public batchId = null;
  public line = null;
  public machineName = null;
  public checkPerson = null;
  public checkTime = null;
  public createdAt?: Date;
  public updatedAt?: Date;

  public quatity?: number;
  public errTotal = null;
  public conclude = null;
  public note = null;

  public errorLists: Array<ErrorElectronicComponent> = [];
  public ids?: string;
  public dttdSolderCheckId?: string;
  public id: any;
  public workOrderId: any;
  public operators?: string;
}
