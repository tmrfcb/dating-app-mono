import { IMatchRelation } from 'app/shared/model/match-relation.model';
import { IUnmatchRelation } from 'app/shared/model/unmatch-relation.model';
import { IUserApp } from 'app/shared/model/user-app.model';
import { RelationType } from 'app/shared/model/enumerations/relation-type.model';

export interface IRelation {
  id?: number;
  userIdOfOther?: string;
  relationType?: RelationType;
  matchRelation?: IMatchRelation;
  unmatchRelation?: IUnmatchRelation;
  userApp?: IUserApp;
}

export const defaultValue: Readonly<IRelation> = {};
