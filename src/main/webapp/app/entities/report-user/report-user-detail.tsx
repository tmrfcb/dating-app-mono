import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './report-user.reducer';
import { IReportUser } from 'app/shared/model/report-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReportUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReportUserDetail = (props: IReportUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { reportUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="datingApp.reportUser.detail.title">ReportUser</Translate> [<b>{reportUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="reportId">
              <Translate contentKey="datingApp.reportUser.reportId">Report Id</Translate>
            </span>
          </dt>
          <dd>{reportUserEntity.reportId}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="datingApp.reportUser.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{reportUserEntity.userId}</dd>
          <dt>
            <span id="cause">
              <Translate contentKey="datingApp.reportUser.cause">Cause</Translate>
            </span>
          </dt>
          <dd>{reportUserEntity.cause}</dd>
        </dl>
        <Button tag={Link} to="/report-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/report-user/${reportUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ reportUser }: IRootState) => ({
  reportUserEntity: reportUser.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReportUserDetail);
