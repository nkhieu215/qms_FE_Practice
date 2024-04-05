import { AuditCriteriaParam } from './auditCriteriaParam.model';
import { AuditCriteriaLKDT2 } from './auditCriteriaLkdt2.model';
import { ErrorElectronicComponent } from './errorElectronicComponent.model';
import { ErrorList } from './errorList.model';
export class PqcPhotoelectric {

  public id = null;
  public ids = "";
  public conclude = null;
  public lot = null;
  public note = null;
  public workOrderId = null;
  public quantity=null;
  public createdBy = "";
  public createdAt = "";
  public lstLkdt : Array<AuditCriteriaLKDT2> = [];
  public lstParam : Array<AuditCriteriaParam> = [];
}
