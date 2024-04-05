import { AuditCriteriaNvl } from '../../_models/auditCriteriaNvl.model';

import { BaseResponse } from '../BaseResponse';
import { ErrorScada } from './ErrorScada';
export class ErrorScadaResponse{
  lstError?:Array<ErrorScada> = [];
}
