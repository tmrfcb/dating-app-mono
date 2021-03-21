import { Moment } from 'moment';
import { IMatchRelation } from 'app/shared/model/match-relation.model';

export interface IMessage {
  id?: number;
  senderId?: string;
  receiverId?: string;
  messageContent?: string;
  messageTitle?: any;
  messageDate?: string;
  matchRelation?: IMatchRelation;
}

export const defaultValue: Readonly<IMessage> = {};
