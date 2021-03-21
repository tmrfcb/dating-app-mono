import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UnmatchRelation from './unmatch-relation';
import UnmatchRelationDetail from './unmatch-relation-detail';
import UnmatchRelationUpdate from './unmatch-relation-update';
import UnmatchRelationDeleteDialog from './unmatch-relation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UnmatchRelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UnmatchRelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UnmatchRelationDetail} />
      <ErrorBoundaryRoute path={match.url} component={UnmatchRelation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UnmatchRelationDeleteDialog} />
  </>
);

export default Routes;
