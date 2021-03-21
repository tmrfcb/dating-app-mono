import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import facebook, {
  FacebookState
} from 'app/entities/facebook/facebook.reducer';
// prettier-ignore
import userApp, {
  UserAppState
} from 'app/entities/user-app/user-app.reducer';
// prettier-ignore
import relation, {
  RelationState
} from 'app/entities/relation/relation.reducer';
// prettier-ignore
import matchRelation, {
  MatchRelationState
} from 'app/entities/match-relation/match-relation.reducer';
// prettier-ignore
import unmatchRelation, {
  UnmatchRelationState
} from 'app/entities/unmatch-relation/unmatch-relation.reducer';
// prettier-ignore
import message, {
  MessageState
} from 'app/entities/message/message.reducer';
// prettier-ignore
import reportUser, {
  ReportUserState
} from 'app/entities/report-user/report-user.reducer';
// prettier-ignore
import location, {
  LocationState
} from 'app/entities/location/location.reducer';
// prettier-ignore
import country, {
  CountryState
} from 'app/entities/country/country.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly facebook: FacebookState;
  readonly userApp: UserAppState;
  readonly relation: RelationState;
  readonly matchRelation: MatchRelationState;
  readonly unmatchRelation: UnmatchRelationState;
  readonly message: MessageState;
  readonly reportUser: ReportUserState;
  readonly location: LocationState;
  readonly country: CountryState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  facebook,
  userApp,
  relation,
  matchRelation,
  unmatchRelation,
  message,
  reportUser,
  location,
  country,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
