import { BaseResponse } from '../BaseResponse';
import { ErrorList } from './errorList';
export class ErrorListResponse extends BaseResponse{
  lstError?: ErrorList[];
  total?:number;
  examinationType?:ErrorList;

}
