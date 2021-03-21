import { Moment } from 'moment';
import { IRelation } from 'app/shared/model/relation.model';

export interface IUnmatchRelation {
  id?: number;
  unMatchDate?: string;
  relation?: IRelation;
}

export const defaultValue: Readonly<IUnmatchRelation> = {};
