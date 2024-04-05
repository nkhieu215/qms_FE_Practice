import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class FixError {
  public errGr = null;
  public errName = null;
  public lotNumber = null;
  public note = null;
  public quantity = null;
  public ratio = null;
  public serial = null;
  public conclude = null;
  public quantityErr = null;
  public id ?:string;
  public ids ?:string;
  public workOrderId ?:string;
  public userId ?:string;
  public materials?:string;
  public stage?:string;

}
