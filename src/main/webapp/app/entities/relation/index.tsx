import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Relation from './relation';
import RelationDetail from './relation-detail';
import RelationUpdate from './relation-update';
import RelationDeleteDialog from './relation-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RelationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RelationDetail} />
      <ErrorBoundaryRoute path={match.url} component={Relation} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RelationDeleteDialog} />
  </>
);

export default Routes;
