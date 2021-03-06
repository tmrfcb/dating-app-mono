import { IUserApp } from 'app/shared/model/user-app.model';
import { ICountry } from 'app/shared/model/country.model';

export interface ILocation {
  id?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  stateProvince?: string;
  gps?: number;
  userApps?: IUserApp[];
  country?: ICountry;
}

export const defaultValue: Readonly<ILocation> = {};
