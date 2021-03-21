import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Facebook from './facebook';
import FacebookDetail from './facebook-detail';
import FacebookUpdate from './facebook-update';
import FacebookDeleteDialog from './facebook-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={FacebookUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={FacebookUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={FacebookDetail} />
      <ErrorBoundaryRoute path={match.url} component={Facebook} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={FacebookDeleteDialog} />
  </>
);

export default Routes;
