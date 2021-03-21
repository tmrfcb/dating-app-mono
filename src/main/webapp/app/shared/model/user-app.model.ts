import { Moment } from 'moment';
import { IFacebook } from 'app/shared/model/facebook.model';
import { IRelation } from 'app/shared/model/relation.model';
import { ILocation } from 'app/shared/model/location.model';

export interface IUserApp {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  facebook?: IFacebook;
  relations?: IRelation[];
  location?: ILocation;
}

export const defaultValue: Readonly<IUserApp> = {};
