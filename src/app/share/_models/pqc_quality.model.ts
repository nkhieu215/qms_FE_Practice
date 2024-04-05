import { AuditCriteriaQuality } from './auditCriteriaQuality.model';
export class PqcQuality {
  checkPersion?: string;
  workOrderId?: string;
  note?: string;
  createdAtClient?: any;
  createdAt?:string;
  conclude?: string;
  lstCheck:Array<AuditCriteriaQuality> =  [];
  id?: string;
  ids?:string;
  quantity?: number;

}
