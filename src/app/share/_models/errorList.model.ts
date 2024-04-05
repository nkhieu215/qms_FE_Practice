export class ErrorList {
  constructor(
    public name: string,
    public errorCode?: string,
    public description?: number,
    public errChild:Array<ErrorList> =  [],
    public ids?: string,
    public id?:any,
    public parentId?:any
    ){}

}
