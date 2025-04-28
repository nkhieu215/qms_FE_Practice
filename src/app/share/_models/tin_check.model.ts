import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class TinCheck {
  public batchId = null;
  public line = null;
  public checkPerson = null;
  public checkTime?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public expiryDate = null;
  public quatity?: number;
  public errTotal?: string;
  public conclude = null;
  public note = null;
  public classify = null;
  public errorLists: Array<ErrorElectronicComponent> = [];
  public ids?: string;
  public id?: string;
  public dttdCheckId?: string;

  public machineCode?: string;
  public knifeCode?: string;
  public gridCode?: string;
  public workOrderId?: string;
  public operators?: string;
}
