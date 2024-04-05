import { ProductionLine } from './production-line';
import { BaseResponse } from '../BaseResponse';

export class ProductionLineResponse extends BaseResponse {
  hasNext?: number;
  lstLine?: ProductionLine[];
  total?: number;
  totalElements?: number;
  totalPages?: number;
}
