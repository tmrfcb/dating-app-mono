export interface IReportUser {
  id?: number;
  reportId?: string;
  userId?: string;
  cause?: any;
}

export const defaultValue: Readonly<IReportUser> = {};
