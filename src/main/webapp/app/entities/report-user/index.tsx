import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ReportUser from './report-user';
import ReportUserDetail from './report-user-detail';
import ReportUserUpdate from './report-user-update';
import ReportUserDeleteDialog from './report-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReportUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReportUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReportUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={ReportUser} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ReportUserDeleteDialog} />
  </>
);

export default Routes;
