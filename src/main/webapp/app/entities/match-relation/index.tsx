import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import MatchRelation from './match-relation';
import MatchRelationDetail from './match-relation-detail';
import MatchRelationUpdate from './match-relation-update';
import MatchRelationDeleteDialog from './match-relation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={MatchRelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={MatchRelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={MatchRelationDetail} />
      <ErrorBoundaryRoute path={match.url} component={MatchRelation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={MatchRelationDeleteDialog} />
  </>
);

export default Routes;
