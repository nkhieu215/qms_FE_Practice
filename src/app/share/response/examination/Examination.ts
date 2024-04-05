import { AuditCriteriaNvl } from '../../_models/auditCriteriaNvl.model';

import { BaseResponse } from './../BaseResponse';
export class Examination{
  public code?:string;
  public id?:number;
  public name?:string;
  public status?:number;
  public type?:number;
  public createdAt?: string;
  lstAuditCriteriaNvl?:Array<AuditCriteriaNvl> = [];
  lstAuditCriteriaLkdt?:AuditCriteriaNvl[];
  iqcAuditCriteriaParameters?:AuditCriteriaNvl[];
}
