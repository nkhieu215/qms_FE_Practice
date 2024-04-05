import { AuditCriteriaNvl } from '../../_models/auditCriteriaNvl.model';
import { Examination } from './Examination';

import { BaseResponse } from './../BaseResponse';
export class ExaminationResponse extends BaseResponse{
  lstExamination?: Examination[];
  total?:number;
  examinationType?:Examination;
  
}
