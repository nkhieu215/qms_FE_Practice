

  export class ErrorDetail {
      err_key: any;
      value: any;
  }

  export class Machine {
      ids: any;
      stage_name: any;
      Number_Of_Error: any;
      Number_Of_Input: any;
      Number_Of_Output: any;
      Error_Detail:Array<ErrorDetail> =  [];
  }



