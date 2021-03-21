import { IUserApp } from 'app/shared/model/user-app.model';

export interface IFacebook {
  id?: number;
  userApp?: IUserApp;
}

export const defaultValue: Readonly<IFacebook> = {};
