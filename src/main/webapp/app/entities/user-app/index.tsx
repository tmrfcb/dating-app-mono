import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserApp from './user-app';
import UserAppDetail from './user-app-detail';
import UserAppUpdate from './user-app-update';
import UserAppDeleteDialog from './user-app-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserAppUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserAppUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserAppDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserApp} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UserAppDeleteDialog} />
  </>
);

export default Routes;
