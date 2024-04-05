export class AuditCriteria {
  constructor(
    public name: string,
    public type: string,
    public code: string,
    public description: string,
    public status: boolean,
    public id?: any
    ){}

}
