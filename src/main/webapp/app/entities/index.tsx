import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Facebook from './facebook';
import UserApp from './user-app';
import Relation from './relation';
import MatchRelation from './match-relation';
import UnmatchRelation from './unmatch-relation';
import Message from './message';
import ReportUser from './report-user';
import Location from './location';
import Country from './country';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}facebook`} component={Facebook} />
      <ErrorBoundaryRoute path={`${match.url}user-app`} component={UserApp} />
      <ErrorBoundaryRoute path={`${match.url}relation`} component={Relation} />
      <ErrorBoundaryRoute path={`${match.url}match-relation`} component={MatchRelation} />
      <ErrorBoundaryRoute path={`${match.url}unmatch-relation`} component={UnmatchRelation} />
      <ErrorBoundaryRoute path={`${match.url}message`} component={Message} />
      <ErrorBoundaryRoute path={`${match.url}report-user`} component={ReportUser} />
      <ErrorBoundaryRoute path={`${match.url}location`} component={Location} />
      <ErrorBoundaryRoute path={`${match.url}country`} component={Country} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
