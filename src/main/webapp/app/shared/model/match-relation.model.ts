import { Moment } from 'moment';
import { IMessage } from 'app/shared/model/message.model';
import { IRelation } from 'app/shared/model/relation.model';

export interface IMatchRelation {
  id?: number;
  matchDate?: string;
  messages?: IMessage[];
  relation?: IRelation;
}

export const defaultValue: Readonly<IMatchRelation> = {};
