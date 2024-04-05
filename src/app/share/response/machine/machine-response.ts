import { Machine } from "./machine";
import { BaseResponse } from "../BaseResponse";

export class MachineResponse extends BaseResponse {
    hasNext?: number;
    lstMachine?: Machine[];
    total?: number;
    totalElements?: number;
    totalPages?: number;
}