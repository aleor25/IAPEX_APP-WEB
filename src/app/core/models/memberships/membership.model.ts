export class Membership {
  id: number;
  startDate: Date;
  endDate: Date;
  status: boolean;
  institutionName: string;

  constructor(id: number, startDate: Date, endDate: Date, status: boolean, institutionName: string) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.institutionName = institutionName;
  }
}
