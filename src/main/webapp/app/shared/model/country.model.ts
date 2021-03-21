import { ILocation } from 'app/shared/model/location.model';

export interface ICountry {
  id?: number;
  countryName?: string;
  location?: ILocation;
}

export const defaultValue: Readonly<ICountry> = {};
